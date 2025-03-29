// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Main Vue Application
    const app = new Vue({
        el: '#app',
        data: {
            availableMindmaps: [],
            currentMindmap: null,
            rootNode: null,
            uploadedFileName: '',
            zoomLevel: 1,
            darkMode: false,
            svg: null,
            zoom: null,
            tree: null,
            nodeGroups: null
        },
        created() {
            // Check for saved theme preference
            const savedTheme = localStorage.getItem('mindmap-theme');
            if (savedTheme === 'dark') {
                this.darkMode = true;
                document.body.classList.add('dark-mode');
            }
            
            // Load available mindmaps
            this.availableMindmaps = mindmapData;
        },
        mounted() {
            // Load the first mindmap if available
            if (this.availableMindmaps.length > 0) {
                this.loadMindmap(this.availableMindmaps[0]);
            }
        },
        methods: {
            // Toggle dark/light theme
            toggleTheme() {
                this.darkMode = !this.darkMode;
                document.body.classList.toggle('dark-mode');
                localStorage.setItem('mindmap-theme', this.darkMode ? 'dark' : 'light');
            },
            
            // Load a mindmap from the list
            loadMindmap(mindmap) {
                this.currentMindmap = mindmap;
                this.fetchMindmapContent(mindmap.path);
            },
            
            // Fetch and parse the markdown content
            fetchMindmapContent(path) {
                fetch(path)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(markdown => {
                        this.parseMarkdown(markdown);
                    })
                    .catch(error => {
                        console.error('Error loading mindmap:', error);
                        alert('Failed to load mindmap. Please check the console for details.');
                    });
            },
            
            // Parse markdown content into a hierarchical structure
            parseMarkdown(markdown) {
                // Split into lines and remove empty lines
                const lines = markdown.split('\n').filter(line => line.trim() !== '');
                
                // Create a hierarchical structure
                const rootNode = { content: 'Root', children: [] };
                const stack = [{ node: rootNode, level: -1 }];
                
                lines.forEach(line => {
                    // Determine indentation level by counting leading spaces and asterisks
                    const match = line.match(/^(\s*)\*\s+(.*)/);
                    if (!match) return;
                    
                    const indent = match[1].length;
                    let content = match[2].trim();
                    
                    // Calculate level based on indentation
                    // We assume 4 spaces per level
                    const level = Math.floor(indent / 4);
                    
                    // Create a new node
                    const newNode = {
                        content: content,
                        children: []
                    };
                    
                    // Find the appropriate parent for this node
                    while (stack.length > 1 && stack[stack.length - 1].level >= level) {
                        stack.pop();
                    }
                    
                    // Add the new node to its parent
                    stack[stack.length - 1].node.children.push(newNode);
                    
                    // Add the new node to the stack
                    stack.push({ node: newNode, level: level });
                });
                
                // Set the root node (skip the artificial root)
                if (rootNode.children.length > 0) {
                    this.rootNode = rootNode.children[0];
                    this.$nextTick(() => {
                        this.initVisualization();
                    });
                } else {
                    this.rootNode = null;
                }
            },
            
            // Initialize D3.js visualization
            initVisualization() {
                const container = document.getElementById('mindmap-container');
                if (!this.rootNode || !container) return;
                
                // Clear previous visualization
                container.innerHTML = '';
                
                // Create SVG element
                const width = container.clientWidth;
                const height = 800;
                
                const svg = d3.select(container)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('class', 'd3-mindmap');
                
                const g = svg.append('g');
                
                // Set up zoom behavior
                this.zoom = d3.zoom()
                    .scaleExtent([0.1, 3])
                    .on('zoom', (event) => {
                        g.attr('transform', event.transform);
                    });
                
                svg.call(this.zoom);
                
                // Initial transform
                const initialTransform = d3.zoomIdentity
                    .translate(width / 3, height / 2)
                    .scale(0.8);
                
                svg.call(this.zoom.transform, initialTransform);
                
                // Set up tree layout
                this.tree = d3.tree()
                    .size([height - 40, width - 160])
                    .nodeSize([80, 200]);
                
                this.svg = svg;
                this.g = g;
                
                // Render the mind map
                this.renderMindMap();
            },
            
            renderMindMap() {
                if (!this.rootNode || !this.tree || !this.g) return;
                
                // Clear previous content
                this.g.selectAll('*').remove();
                
                // Create hierarchy from data
                const root = d3.hierarchy(this.rootNode);
                
                // Compute the tree layout
                this.tree(root);
                
                // Draw links between nodes
                const links = this.g.selectAll('.link')
                    .data(root.links())
                    .enter()
                    .append('path')
                    .attr('class', 'link')
                    .attr('d', d => {
                        return `M${d.source.y},${d.source.x}
                                C${(d.source.y + d.target.y) / 2},${d.source.x}
                                ${(d.source.y + d.target.y) / 2},${d.target.x}
                                ${d.target.y},${d.target.x}`;
                    })
                    .attr('stroke', d => {
                        if (d.target.depth === 1) return '#4a6fa5';
                        return '#a8c6fa';
                    })
                    .attr('stroke-width', d => 2 - d.target.depth * 0.3);
                
                // Create node groups
                const nodes = this.g.selectAll('.node')
                    .data(root.descendants())
                    .enter()
                    .append('g')
                    .attr('class', d => `node node-level-${d.depth}`)
                    .attr('transform', d => `translate(${d.y},${d.x})`)
                    .on('click', (event, d) => {
                        if (d.children) {
                            d._children = d.children;
                            d.children = null;
                        } else if (d._children) {
                            d.children = d._children;
                            d._children = null;
                        }
                        this.renderMindMap();
                    });
                
                // Add node backgrounds
                nodes.append('rect')
                    .attr('class', 'node-box')
                    .attr('rx', 10)
                    .attr('ry', 10)
                    .attr('x', -80)
                    .attr('y', -20)
                    .attr('width', 160)
                    .attr('height', 40)
                    .attr('fill', d => {
                        if (d.depth === 0) return '#4a6fa5';
                        if (d.depth === 1) return '#a8c6fa';
                        return '#90EE90';
                    });
                
                // Add node labels
                nodes.append('text')
                    .attr('class', 'node-text')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '0.35em')
                    .attr('fill', d => d.depth === 0 ? 'white' : '#333')
                    .text(d => this.formatContent(d.data.content));
                
                // Add collapse/expand buttons for nodes with children
                nodes.filter(d => d.data.children && d.data.children.length > 0)
                    .append('circle')
                    .attr('class', 'expand-collapse')
                    .attr('r', 8)
                    .attr('cx', 90)
                    .attr('cy', 0)
                    .attr('fill', 'white')
                    .attr('stroke', '#4a6fa5');
                
                nodes.filter(d => d.data.children && d.data.children.length > 0)
                    .append('text')
                    .attr('class', 'expand-collapse-text')
                    .attr('x', 90)
                    .attr('y', 0)
                    .attr('text-anchor', 'middle')
                    .attr('dy', '0.35em')
                    .attr('font-size', '12px')
                    .attr('fill', '#4a6fa5')
                    .text(d => d._children ? '+' : '-');
                
                this.nodeGroups = nodes;
            },
            
            formatContent(content) {
                // Handle bold text
                content = content.replace(/\*\*(.*?)\*\*/g, '$1');
                
                // Handle citations
                content = content.replace(/\[(.*?)\]/g, '');
                
                // Shorten content if too long
                if (content.length > 30) {
                    return content.substring(0, 27) + '...';
                }
                
                return content;
            },
            
            // Handle file upload
            handleFileUpload(event) {
                const file = event.target.files[0];
                if (!file) return;
                
                this.uploadedFileName = file.name;
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    this.parseMarkdown(content);
                    
                    // Create a temporary mindmap object
                    this.currentMindmap = {
                        id: 'uploaded',
                        title: file.name.replace('.md', ''),
                        topic: 'Uploaded',
                        description: 'User uploaded mindmap',
                        path: '#'
                    };
                };
                reader.readAsText(file);
            },
            
            // Expand all nodes
            expandAll() {
                if (!this.rootNode) return;
                
                const expandNode = (node) => {
                    if (node._children) {
                        node.children = node._children;
                        node._children = null;
                        node.children.forEach(expandNode);
                    } else if (node.children) {
                        node.children.forEach(expandNode);
                    }
                };
                
                d3.hierarchy(this.rootNode).descendants().forEach(expandNode);
                this.renderMindMap();
            },
            
            // Collapse all nodes except root
            collapseAll() {
                if (!this.rootNode) return;
                
                const collapseNode = (node) => {
                    if (node.depth !== 0 && node.children) {
                        node._children = node.children;
                        node.children = null;
                    } else if (node.children) {
                        node.children.forEach(collapseNode);
                    }
                };
                
                const root = d3.hierarchy(this.rootNode);
                if (root.children) {
                    root.children.forEach(collapseNode);
                }
                
                this.renderMindMap();
            },
            
            // Zoom controls
            zoomIn() {
                if (this.svg && this.zoom) {
                    const currentTransform = d3.zoomTransform(this.svg.node());
                    const newScale = currentTransform.k * 1.2;
                    
                    this.svg.transition()
                        .duration(300)
                        .call(this.zoom.transform, 
                            d3.zoomIdentity
                                .translate(currentTransform.x, currentTransform.y)
                                .scale(newScale));
                }
            },
            
            zoomOut() {
                if (this.svg && this.zoom) {
                    const currentTransform = d3.zoomTransform(this.svg.node());
                    const newScale = currentTransform.k * 0.8;
                    
                    this.svg.transition()
                        .duration(300)
                        .call(this.zoom.transform, 
                            d3.zoomIdentity
                                .translate(currentTransform.x, currentTransform.y)
                                .scale(newScale));
                }
            },
            
            resetZoom() {
                if (this.svg && this.zoom) {
                    const width = this.svg.attr('width');
                    const height = this.svg.attr('height');
                    
                    this.svg.transition()
                        .duration(300)
                        .call(this.zoom.transform, 
                            d3.zoomIdentity
                                .translate(width / 3, height / 2)
                                .scale(0.8));
                }
            }
        }
    });
});

// Main Vue Application
new Vue({
    el: '#app',
    data: {
        availableMindmaps: [],
        currentMindmap: null,
        rootNode: null,
        uploadedFileName: '',
        zoomLevel: 1,
        darkMode: false,
        mindMapInstance: null
    },
    created() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('mindmap-theme');
        if (savedTheme === 'dark') {
            this.darkMode = true;
            document.body.classList.add('dark-mode');
        }
        
        // Load available mindmaps
        this.availableMindmaps = mindmapData;
        
        // Load the first mindmap if available
        if (this.availableMindmaps.length > 0) {
            this.loadMindmap(this.availableMindmaps[0]);
        }
    },
    mounted() {
        // Add D3.js and its dependencies
        this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js');
    },
    methods: {
        // Load external scripts
        loadScript(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        },
        
        // Toggle dark/light theme
        toggleTheme() {
            this.darkMode = !this.darkMode;
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('mindmap-theme', this.darkMode ? 'dark' : 'light');
        },
        
        // Load a mindmap from the list
        loadMindmap(mindmap) {
            this.currentMindmap = mindmap;
            this.fetchMindmapContent(mindmap.path);
        },
        
        // Fetch and parse the markdown content
        fetchMindmapContent(path) {
            fetch(path)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(markdown => {
                    this.parseMarkdown(markdown);
                })
                .catch(error => {
                    console.error('Error loading mindmap:', error);
                    alert('Failed to load mindmap. Please check the console for details.');
                });
        },
        
        // Parse markdown content into a hierarchical structure
        parseMarkdown(markdown) {
            // Split into lines and remove empty lines
            const lines = markdown.split('\n').filter(line => line.trim() !== '');
            
            // Create a hierarchical structure
            const rootNode = { content: 'Root', children: [], expanded: true };
            const stack = [{ node: rootNode, level: -1 }];
            
            lines.forEach(line => {
                // Determine indentation level by counting leading spaces and asterisks
                const match = line.match(/^(\s*)\*\s+(.*)/);
                if (!match) return;
                
                const indent = match[1].length;
                let content = match[2].trim();
                
                // Calculate level based on indentation
                // We assume 4 spaces per level
                const level = Math.floor(indent / 4);
                
                // Create a new node
                const newNode = {
                    content: content,
                    children: [],
                };
                
                // Find the appropriate parent for this node
                while (stack.length > 1 && stack[stack.length - 1].level >= level) {
                    stack.pop();
                }
                
                // Add the new node to its parent
                stack[stack.length - 1].node.children.push(newNode);
                
                // Add the new node to the stack
                stack.push({ node: newNode, level: level });
            });
            
            // Set the root node (skip the artificial root)
            if (rootNode.children.length > 0) {
                this.rootNode = rootNode.children[0];
                
                // Store a reference to the mindMapInstance
                this.$nextTick(() => {
                    if (this.$refs.mindMap) {
                        this.mindMapInstance = this.$refs.mindMap;
                    }
                });
            } else {
                this.rootNode = null;
            }
        },
        
        // Handle file upload
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            this.uploadedFileName = file.name;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                this.parseMarkdown(content);
                
                // Create a temporary mindmap object
                this.currentMindmap = {
                    id: 'uploaded',
                    title: file.name.replace('.md', ''),
                    topic: 'Uploaded',
                    description: 'User uploaded mindmap',
                    path: '#'
                };
            };
            reader.readAsText(file);
        },
        
        // Expand/collapse methods that use the D3 component
        toggleNode(d) {
            // This method is called from the D3 component
            console.log('Node toggled:', d);
        },
        
        expandAll() {
            if (this.$refs.mindMap) {
                this.$refs.mindMap.expand();
            }
        },
        
        collapseAll() {
            if (this.$refs.mindMap) {
                this.$refs.mindMap.collapse();
            }
        },
        
        // Zoom controls - these now control the D3 zoom behavior
        zoomIn() {
            if (this.$refs.mindMap) {
                const currentZoom = this.$refs.mindMap.zoom.transform(
                    d3.select(this.$refs.mindMap.$refs.svg)
                ).k;
                
                const newZoom = d3.zoomIdentity
                    .translate(this.$refs.mindMap.width / 2, this.$refs.mindMap.height / 2)
                    .scale(currentZoom * 1.2)
                    .translate(-this.$refs.mindMap.width / 2, -this.$refs.mindMap.height / 2);
                
                d3.select(this.$refs.mindMap.$refs.svg)
                    .transition()
                    .duration(300)
                    .call(this.$refs.mindMap.zoom.transform, newZoom);
            }
        },
        
        zoomOut() {
            if (this.$refs.mindMap) {
                const currentZoom = this.$refs.mindMap.zoom.transform(
                    d3.select(this.$refs.mindMap.$refs.svg)
                ).k;
                
                const newZoom = d3.zoomIdentity
                    .translate(this.$refs.mindMap.width / 2, this.$refs.mindMap.height / 2)
                    .scale(currentZoom * 0.8)
                    .translate(-this.$refs.mindMap.width / 2, -this.$refs.mindMap.height / 2);
                
                d3.select(this.$refs.mindMap.$refs.svg)
                    .transition()
                    .duration(300)
                    .call(this.$refs.mindMap.zoom.transform, newZoom);
            }
        },
        
        resetZoom() {
            if (this.$refs.mindMap) {
                const initialTransform = d3.zoomIdentity
                    .translate(this.$refs.mindMap.width / 2, this.$refs.mindMap.height / 2)
                    .scale(0.8);
                
                d3.select(this.$refs.mindMap.$refs.svg)
                    .transition()
                    .duration(300)
                    .call(this.$refs.mindMap.zoom.transform, initialTransform);
            }
        }
    }
});