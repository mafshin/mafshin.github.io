// Initialize the Vue application
const { createApp, ref, reactive, computed, onMounted, watch } = Vue;

const app = createApp({
    setup() {
        // References to DOM elements
        const canvasContainer = ref(null);
        const canvas = ref(null);
        
        // Canvas state
        const zoomLevel = ref(1);
        const showGrid = ref(true);
        const snapToGrid = ref(true);
        const showRuler = ref(true);
        
        // UI state
        const showExportModal = ref(false);
        const searchTerm = ref('');
        const expandedCategories = ref(['Rooms', 'Furniture']);
        const selectedTool = ref(null);
        const selectedElement = ref(null);
        
        // Export settings
        const exportFormat = ref('pdf');
        const exportPaperSize = ref('a4');
        const exportScale = ref('1:100');
        const watermarkText = ref('');
        const includeMeasurements = ref(true);
        const includeGrid = ref(false);
        
        // Drawing state
        const isDrawing = ref(false);
        const startPoint = reactive({ x: 0, y: 0 });
        const endPoint = reactive({ x: 0, y: 0 });
        
        // Floor plan data
        const floorPlanElements = ref([]);
        const measurements = ref([]);
        
        // SVG drawing instance
        let draw = null;
        
        // Tool categories with items
        const toolCategories = reactive([
            {
                name: 'Rooms',
                icon: 'fas fa-home',
                items: [
                    { name: 'Rectangle Room', type: 'room', shape: 'rectangle', icon: 'fas fa-square' },
                    { name: 'L-Shaped Room', type: 'room', shape: 'l-shape', icon: 'fas fa-vector-square' },
                    { name: 'Custom Room', type: 'room', shape: 'custom', icon: 'fas fa-draw-polygon' }
                ]
            },
            {
                name: 'Walls',
                icon: 'fas fa-grip-lines',
                items: [
                    { name: 'Wall', type: 'wall', icon: 'fas fa-grip-lines-vertical' },
                    { name: 'Door', type: 'opening', subtype: 'door', icon: 'fas fa-door-open' },
                    { name: 'Window', type: 'opening', subtype: 'window', icon: 'fas fa-window-maximize' },
                    { name: 'Archway', type: 'opening', subtype: 'archway', icon: 'fas fa-archway' }
                ]
            },
            {
                name: 'Furniture',
                icon: 'fas fa-couch',
                items: [
                    { name: 'Single Bed', type: 'furniture', subtype: 'bed-single', icon: 'fas fa-bed' },
                    { name: 'Double Bed', type: 'furniture', subtype: 'bed-double', icon: 'fas fa-bed' },
                    { name: 'Sofa', type: 'furniture', subtype: 'sofa', icon: 'fas fa-couch' },
                    { name: 'Chair', type: 'furniture', subtype: 'chair', icon: 'fas fa-chair' },
                    { name: 'Table', type: 'furniture', subtype: 'table', icon: 'fas fa-table' },
                    { name: 'Kitchen Counter', type: 'furniture', subtype: 'counter', icon: 'fas fa-border-all' },
                    { name: 'Sink', type: 'fixture', subtype: 'sink', icon: 'fas fa-sink' },
                    { name: 'Bathtub', type: 'fixture', subtype: 'bathtub', icon: 'fas fa-bath' },
                    { name: 'Shower', type: 'fixture', subtype: 'shower', icon: 'fas fa-shower' },
                    { name: 'Toilet', type: 'fixture', subtype: 'toilet', icon: 'fas fa-toilet' }
                ]
            },
            {
                name: 'Stairs',
                icon: 'fas fa-stairs',
                items: [
                    { name: 'Straight Stairs', type: 'stairs', subtype: 'straight', icon: 'fas fa-stairs' },
                    { name: 'L-Shaped Stairs', type: 'stairs', subtype: 'l-shape', icon: 'fas fa-sort-amount-up' },
                    { name: 'U-Shaped Stairs', type: 'stairs', subtype: 'u-shape', icon: 'fas fa-sort-amount-down' },
                    { name: 'Spiral Stairs', type: 'stairs', subtype: 'spiral', icon: 'fas fa-yin-yang' }
                ]
            },
            {
                name: 'Measurement',
                icon: 'fas fa-ruler-combined',
                items: [
                    { name: 'Dimension Line', type: 'dimension', icon: 'fas fa-ruler' },
                    { name: 'Text Label', type: 'text', icon: 'fas fa-font' },
                    { name: 'Room Label', type: 'room-label', icon: 'fas fa-tag' }
                ]
            }
        ]);
        
        // Filtered categories based on search term
        const filteredCategories = computed(() => {
            if (!searchTerm.value) return toolCategories;
            
            return toolCategories.map(category => {
                const filteredItems = category.items.filter(item => 
                    item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
                );
                
                return {
                    ...category,
                    items: filteredItems
                };
            }).filter(category => category.items.length > 0);
        });
        
        // Initialize the SVG drawing canvas
        const initCanvas = () => {
            if (!canvas.value) return;
            
            // Initialize SVG.js drawing instance
            draw = SVG().addTo(canvas.value);
            draw.size('100%', '100%');
            
            // Initialize ruler markings
            initRulers();
            
            // Initialize canvas interactions with Interact.js
            initInteractions();
        };
        
        // Initialize the rulers with marks and numbers
        const initRulers = () => {
            const horizontalRuler = document.querySelector('.ruler.horizontal');
            const verticalRuler = document.querySelector('.ruler.vertical');
            
            if (horizontalRuler && verticalRuler) {
                // Clear existing marks
                horizontalRuler.innerHTML = '';
                verticalRuler.innerHTML = '';
                
                // Add corner square
                const corner = document.createElement('div');
                corner.style.position = 'absolute';
                corner.style.top = '0';
                corner.style.left = '0';
                corner.style.width = '25px';
                corner.style.height = '25px';
                corner.style.backgroundColor = 'var(--panel-color)';
                corner.style.borderRight = '1px solid var(--ruler-color)';
                corner.style.borderBottom = '1px solid var(--ruler-color)';
                corner.style.zIndex = '11';
                document.querySelector('.canvas-container').appendChild(corner);
                
                // Add horizontal ruler marks
                for (let i = 0; i < 50; i++) {
                    const mark = document.createElement('div');
                    mark.className = 'ruler-mark';
                    mark.dataset.value = `${i * 100}`;
                    horizontalRuler.appendChild(mark);
                }
                
                // Add vertical ruler marks
                for (let i = 0; i < 50; i++) {
                    const mark = document.createElement('div');
                    mark.className = 'ruler-mark';
                    mark.dataset.value = `${i * 100}`;
                    verticalRuler.appendChild(mark);
                }
            }
        };
        
        // Initialize dragging and resizing interactions
        const initInteractions = () => {
            // Make elements draggable
            interact('.floor-element').draggable({
                inertia: true,
                modifiers: [
                    interact.modifiers.snap({
                        targets: snapToGrid.value ? [
                            { x: 20, y: 20 } // Snap to grid
                        ] : [],
                        range: 10,
                        relativePoints: [
                            { x: 0, y: 0 } // Snap relative to the element's top-left corner
                        ]
                    }),
                    interact.modifiers.restrict({
                        restriction: canvas.value,
                        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                    })
                ],
                onstart: (event) => {
                    const elementId = event.target.dataset.id;
                    selectElementById(elementId);
                },
                onmove: (event) => {
                    const target = event.target;
                    const elementId = target.dataset.id;
                    const element = floorPlanElements.value.find(el => el.id === elementId);
                    
                    if (!element) return;
                    
                    // Update position
                    element.x += event.dx / zoomLevel.value;
                    element.y += event.dy / zoomLevel.value;
                    
                    // Update the element's transform
                    updateElementTransform(element);
                    
                    // Update any associated measurements
                    updateMeasurements(element);
                }
            });
            
            // Make elements resizable
            interact('.floor-element').resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                modifiers: [
                    interact.modifiers.snap({
                        targets: snapToGrid.value ? [
                            { x: 20, y: 20 } // Snap to grid
                        ] : [],
                        range: 10
                    })
                ],
                onstart: (event) => {
                    const elementId = event.target.dataset.id;
                    selectElementById(elementId);
                },
                onmove: (event) => {
                    const target = event.target;
                    const elementId = target.dataset.id;
                    const element = floorPlanElements.value.find(el => el.id === elementId);
                    
                    if (!element) return;
                    
                    // Update element dimensions
                    element.width = Math.max(20, event.rect.width / zoomLevel.value);
                    element.height = Math.max(20, event.rect.height / zoomLevel.value);
                    
                    if (event.edges.left) {
                        element.x += event.deltaRect.left / zoomLevel.value;
                    }
                    
                    if (event.edges.top) {
                        element.y += event.deltaRect.top / zoomLevel.value;
                    }
                    
                    // Update the element's transform
                    updateElementTransform(element);
                    
                    // Update any associated measurements
                    updateMeasurements(element);
                }
            });
        };
        
        // Update element position and dimensions on the DOM
        const updateElementTransform = (element) => {
            const domElement = document.querySelector(`.floor-element[data-id="${element.id}"]`);
            
            if (!domElement) return;
            
            domElement.style.transform = `translate(${element.x}px, ${element.y}px) rotate(${element.rotation || 0}deg)`;
            domElement.style.width = `${element.width}px`;
            domElement.style.height = `${element.height}px`;
        };
        
        // Create a new element based on selected tool
        const createNewElement = (x, y, width, height) => {
            if (!selectedTool.value) return;
            
            const id = `element-${Date.now()}`;
            const layer = getLayerForType(selectedTool.value.type);
            
            const element = {
                id,
                type: selectedTool.value.type,
                subtype: selectedTool.value.subtype || '',
                x,
                y,
                width: width || getDefaultWidth(selectedTool.value),
                height: height || getDefaultHeight(selectedTool.value),
                rotation: 0,
                layer
            };
            
            // Add specific properties based on type
            if (selectedTool.value.type === 'text') {
                element.text = 'Text Label';
            }
            
            floorPlanElements.value.push(element);
            renderElement(element);
            
            return element;
        };
        
        // Get the appropriate layer for an element type
        const getLayerForType = (type) => {
            const layerMap = {
                'room': 'background',
                'wall': 'walls',
                'opening': 'walls',
                'furniture': 'furniture',
                'fixture': 'furniture',
                'stairs': 'furniture',
                'dimension': 'annotations',
                'text': 'annotations',
                'room-label': 'annotations'
            };
            
            return layerMap[type] || 'furniture';
        };
        
        // Get default width for an element based on its type
        const getDefaultWidth = (tool) => {
            const defaults = {
                'room': 400,
                'wall': 200,
                'furniture': getSubtypeWidth(tool.subtype),
                'fixture': getSubtypeWidth(tool.subtype),
                'stairs': 100,
                'dimension': 200,
                'text': 100,
                'room-label': 80
            };
            
            return defaults[tool.type] || 100;
        };
        
        // Get default height for an element based on its type
        const getDefaultHeight = (tool) => {
            const defaults = {
                'room': 300,
                'wall': 10,
                'furniture': getSubtypeHeight(tool.subtype),
                'fixture': getSubtypeHeight(tool.subtype),
                'stairs': 200,
                'dimension': 10,
                'text': 30,
                'room-label': 30
            };
            
            return defaults[tool.type] || 100;
        };
        
        // Get width for specific furniture subtypes
        const getSubtypeWidth = (subtype) => {
            const widths = {
                'bed-single': 90,
                'bed-double': 140,
                'sofa': 200,
                'chair': 50,
                'table': 120,
                'counter': 180,
                'sink': 60,
                'bathtub': 170,
                'shower': 90,
                'toilet': 50
            };
            
            return widths[subtype] || 80;
        };
        
        // Get height for specific furniture subtypes
        const getSubtypeHeight = (subtype) => {
            const heights = {
                'bed-single': 200,
                'bed-double': 200,
                'sofa': 80,
                'chair': 50,
                'table': 80,
                'counter': 60,
                'sink': 50,
                'bathtub': 70,
                'shower': 90,
                'toilet': 70
            };
            
            return heights[subtype] || 80;
        };
        
        // Render a single element on the canvas
        const renderElement = (element) => {
            const elementsContainer = canvas.value.querySelector('.elements-container');
            
            if (!elementsContainer) return;
            
            const elementDiv = document.createElement('div');
            elementDiv.className = 'floor-element';
            elementDiv.dataset.id = element.id;
            elementDiv.dataset.type = element.type;
            elementDiv.dataset.subtype = element.subtype || '';
            
            // Set position and dimensions
            elementDiv.style.transform = `translate(${element.x}px, ${element.y}px) rotate(${element.rotation || 0}deg)`;
            elementDiv.style.width = `${element.width}px`;
            elementDiv.style.height = `${element.height}px`;
            
            // Create SVG representation
            const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', '100%');
            svgElement.setAttribute('viewBox', `0 0 ${element.width} ${element.height}`);
            
            // Create SVG content based on element type
            svgElement.innerHTML = getSvgForElement(element);
            
            elementDiv.appendChild(svgElement);
            elementsContainer.appendChild(elementDiv);
        };
        
        // Generate SVG content for an element based on its type
        const getSvgForElement = (element) => {
            const { type, subtype, width, height } = element;
            
            switch (type) {
                case 'room':
                    return `<rect x="0" y="0" width="${width}" height="${height}" 
                           fill="#f5f7fa" stroke="#2c3e50" stroke-width="2" />`;
                           
                case 'wall':
                    return `<rect x="0" y="0" width="${width}" height="${height}" 
                           fill="#2c3e50" stroke="none" />`;
                           
                case 'opening':
                    if (subtype === 'door') {
                        return `
                            <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#2c3e50" stroke-width="1" />
                            <path d="M 0 0 A ${width} ${width} 0 0 1 ${width} ${height}" 
                                  fill="none" stroke="#2c3e50" stroke-width="1" />
                        `;
                    } else if (subtype === 'window') {
                        return `
                            <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#2c3e50" stroke-width="1" />
                            <line x1="0" y1="0" x2="${width}" y2="${height}" stroke="#2c3e50" stroke-width="1" />
                            <line x1="${width}" y1="0" x2="0" y2="${height}" stroke="#2c3e50" stroke-width="1" />
                        `;
                    } else if (subtype === 'archway') {
                        return `
                            <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="none" />
                            <path d="M 0 ${height} L 0 0 Q ${width/2} ${-height/2} ${width} 0 L ${width} ${height}" 
                                  fill="none" stroke="#2c3e50" stroke-width="1" />
                        `;
                    }
                    break;
                    
                case 'furniture':
                    if (subtype === 'bed-single' || subtype === 'bed-double') {
                        return `
                            <rect x="0" y="0" width="${width}" height="${height}" 
                                  fill="#f5f7fa" stroke="#2c3e50" stroke-width="1" />
                            <rect x="0" y="0" width="${width}" height="${height * 0.25}" 
                                  fill="#dfe6e9" stroke="#2c3e50" stroke-width="1" />
                        `;
                    } else if (subtype === 'sofa') {
                        return `
                            <rect x="0" y="0" width="${width}" height="${height}" rx="5" ry="5" 
                                  fill="#dfe6e9" stroke="#2c3e50" stroke-width="1" />
                            <rect x="5" y="${height - 15}" width="${width - 10}" height="10" rx="2" ry="2" 
                                  fill="#b2bec3" stroke="#2c3e50" stroke-width="0.5" />
                        `;
                    } else if (subtype === 'chair') {
                        return `
                            <rect x="5" y="5" width="${width - 10}" height="${height - 10}" rx="2" ry="2" 
                                  fill="#dfe6e9" stroke="#2c3e50" stroke-width="1" />
                        `;
                    } else if (subtype === 'table') {
                        return `
                            <rect x="0" y="0" width="${width}" height="${height}" 
                                  fill="#dfe6e9" stroke="#2c3e50" stroke-width="1" />
                        `;
                    } else if (subtype === 'counter') {
                        return `
                            <rect x="0" y="0" width="${width}" height="${height}" 
                                  fill="#dfe6e9" stroke="#2c3e50" stroke-width="1" />
                            <line x1="0" y1="${height/2}" x2="${width}" y2="${height/2}" 
                                  stroke="#2c3e50" stroke-width="0.5" />
                        `;
                    }
                    break;
                    
                case 'fixture':
                    if (subtype === 'sink') {
                        return `
                            <rect x="0" y="0" width="${width}" height="${height}" 
                                  fill="white" stroke="#2c3e50" stroke-width="1" />
                            <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height) * 0.3}" 
                                    fill="none" stroke="#2c3e50" stroke-width="1" />
                        `;
                    } else if (subtype === 'bathtub') {
                        return `
                            <rect x="0" y="0" width="${width}" height="${height}" rx="20" ry="20" 
                                  fill="white" stroke="#2c3e50" stroke-width="1" />
                            <ellipse cx="${width/2}" cy="${height/2}" rx="${width * 0.3}" ry="${height * 0.3}" 
                                    fill="none" stroke="#2c3e50" stroke-width="0.5" />
                        `;
                    } else if (subtype === 'shower') {
                        return `
                            <rect x="0" y="0" width="${width}" height="${height}" 
                                  fill="white" stroke="#2c3e50" stroke-width="1" />
                            <circle cx="${width * 0.7}" cy="${height * 0.3}" r="5" 
                                    fill="none" stroke="#2c3e50" stroke-width="1" />
                            <line x1="${width * 0.2}" y1="${height * 0.2}" x2="${width * 0.8}" y2="${height * 0.8}" 
                                  stroke="#2c3e50" stroke-width="0.5" stroke-dasharray="2,2" />
                            <line x1="${width * 0.8}" y1="${height * 0.2}" x2="${width * 0.2}" y2="${height * 0.8}" 
                                  stroke="#2c3e50" stroke-width="0.5" stroke-dasharray="2,2" />
                        `;
                    } else if (subtype === 'toilet') {
                        return `
                            <rect x="0" y="0" width="${width}" height="${height}" 
                                  fill="none" stroke="none" />
                            <ellipse cx="${width/2}" cy="${height * 0.4}" rx="${width * 0.45}" ry="${height * 0.35}" 
                                    fill="white" stroke="#2c3e50" stroke-width="1" />
                            <rect x="${width * 0.3}" y="${height * 0.5}" width="${width * 0.4}" height="${height * 0.5}" 
                                  fill="white" stroke="#2c3e50" stroke-width="1" />
                        `;
                    }
                    break;
                    
                case 'stairs':
                    if (subtype === 'straight') {
                        const steps = 8;
                        const stepWidth = width;
                        const stepHeight = height / steps;
                        
                        let path = '';
                        for (let i = 0; i < steps; i++) {
                            path += `<rect x="0" y="${i * stepHeight}" width="${stepWidth}" height="${stepHeight}" 
                                         fill="none" stroke="#2c3e50" stroke-width="1" />`;
                        }
                        return path;
                    } else if (subtype === 'l-shape') {
                        const halfHeight = height / 2;
                        return `
                            <path d="M 0 0 L ${width} 0 L ${width} ${halfHeight} L ${width/2} ${halfHeight} L ${width/2} ${height} L 0 ${height} Z" 
                                  fill="#f5f7fa" stroke="#2c3e50" stroke-width="1" />
                            <line x1="0" y1="${height/4}" x2="${width}" y2="${height/4}" stroke="#2c3e50" stroke-width="0.5" />
                            <line x1="0" y1="${height/2}" x2="${width/2}" y2="${height/2}" stroke="#2c3e50" stroke-width="0.5" />
                            <line x1="${width/2}" y1="${height*3/4}" x2="${width/2}" y2="${height}" stroke="#2c3e50" stroke-width="0.5" />
                        `;
                    } else if (subtype === 'spiral') {
                        return `
                            <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height) * 0.45}" 
                                    fill="#f5f7fa" stroke="#2c3e50" stroke-width="1" />
                            <path d="M ${width/2} ${height/2} L ${width/2} 0 A ${width/2} ${height/2} 0 0 1 ${width} ${height/2}" 
                                  fill="none" stroke="#2c3e50" stroke-width="0.5" />
                            <path d="M ${width/2} ${height/2} L ${width} ${height/2} A ${width/2} ${height/2} 0 0 1 ${width/2} ${height}" 
                                  fill="none" stroke="#2c3e50" stroke-width="0.5" />
                            <path d="M ${width/2} ${height/2} L ${width/2} ${height} A ${width/2} ${height/2} 0 0 1 0 ${height/2}" 
                                  fill="none" stroke="#2c3e50" stroke-width="0.5" />
                            <path d="M ${width/2} ${height/2} L 0 ${height/2} A ${width/2} ${height/2} 0 0 1 ${width/2} 0" 
                                  fill="none" stroke="#2c3e50" stroke-width="0.5" />
                        `;
                    }
                    break;
                    
                case 'dimension':
                    return `
                        <line x1="0" y1="${height/2}" x2="${width}" y2="${height/2}" 
                              stroke="#2c3e50" stroke-width="1" />
                        <line x1="0" y1="0" x2="0" y2="${height}" 
                              stroke="#2c3e50" stroke-width="1" />
                        <line x1="${width}" y1="0" x2="${width}" y2="${height}" 
                              stroke="#2c3e50" stroke-width="1" />
                        <text x="${width/2}" y="${height/2 - 5}" font-size="12" text-anchor="middle">${width} cm</text>
                    `;
                    
                case 'text':
                    return `
                        <rect x="0" y="0" width="${width}" height="${height}" 
                              fill="none" />
                        <text x="${width/2}" y="${height/2 + 5}" font-size="14" text-anchor="middle">${element.text || 'Text'}</text>
                    `;
                    
                case 'room-label':
                    return `
                        <rect x="0" y="0" width="${width}" height="${height}" 
                              fill="none" />
                        <text x="${width/2}" y="${height/2 + 5}" font-size="14" font-weight="bold" text-anchor="middle">${element.text || 'Room'}</text>
                    `;
                    
                default:
                    return `<rect x="0" y="0" width="${width}" height="${height}" 
                           fill="rgba(200, 200, 200, 0.5)" stroke="#2c3e50" stroke-width="1" />`;
            }
        };
        
        // Add a measurement to the canvas
        const addMeasurement = (x1, y1, x2, y2, value, orientation = 'horizontal') => {
            const measurementId = `measurement-${Date.now()}`;
            const measurement = {
                id: measurementId,
                x1, y1, x2, y2,
                value,
                orientation
            };
            
            measurements.value.push(measurement);
            renderMeasurement(measurement);
        };
        
        // Render a measurement on the canvas
        const renderMeasurement = (measurement) => {
            const { id, x1, y1, x2, y2, value, orientation } = measurement;
            const measurementsContainer = canvas.value.querySelector('.measurements-container');
            
            if (!measurementsContainer) return;
            
            const measurementDiv = document.createElement('div');
            measurementDiv.className = `measurement measurement-${orientation}`;
            measurementDiv.dataset.id = id;
            
            if (orientation === 'horizontal') {
                measurementDiv.style.left = `${Math.min(x1, x2)}px`;
                measurementDiv.style.top = `${y1}px`;
                measurementDiv.style.width = `${Math.abs(x2 - x1)}px`;
                measurementDiv.textContent = `${value}`;
            } else {
                measurementDiv.style.left = `${x1}px`;
                measurementDiv.style.top = `${Math.min(y1, y2)}px`;
                measurementDiv.style.height = `${Math.abs(y2 - y1)}px`;
                measurementDiv.style.writingMode = 'vertical-rl';
                measurementDiv.textContent = `${value}`;
            }
            
            measurementsContainer.appendChild(measurementDiv);
        };
        
        // Update measurements associated with an element
        const updateMeasurements = (element) => {
            // Implementation would update any measurements connected to this element
            // For simplicity, we're not fully implementing this in this example
        };
        
        // Toggle category expansion
        const toggleCategory = (categoryName) => {
            if (expandedCategories.value.includes(categoryName)) {
                expandedCategories.value = expandedCategories.value.filter(c => c !== categoryName);
            } else {
                expandedCategories.value.push(categoryName);
            }
        };
        
        // Select a tool from the toolbox
        const selectTool = (tool) => {
            selectedTool.value = tool;
            // Deselect the current element when selecting a tool
            selectedElement.value = null;
            clearSelectedElementClass();
        };
        
        // Select an element by ID
        const selectElementById = (elementId) => {
            // Clear previous selection
            clearSelectedElementClass();
            
            // Find the element by ID
            const element = floorPlanElements.value.find(el => el.id === elementId);
            
            if (!element) return;
            
            // Update selected element
            selectedElement.value = element;
            
            // Add selected class
            const domElement = document.querySelector(`.floor-element[data-id="${elementId}"]`);
            if (domElement) {
                domElement.classList.add('selected');
            }
        };
        
        // Clear selected class from all elements
        const clearSelectedElementClass = () => {
            document.querySelectorAll('.floor-element.selected').forEach(el => {
                el.classList.remove('selected');
            });
        };
        
        // Update element properties
        const updateElement = () => {
            if (!selectedElement.value) return;
            
            // Update the element's DOM representation
            updateElementTransform(selectedElement.value);
            
            // Update the SVG content
            const elementDiv = document.querySelector(`.floor-element[data-id="${selectedElement.value.id}"]`);
            if (elementDiv && elementDiv.querySelector('svg')) {
                elementDiv.querySelector('svg').setAttribute('viewBox', `0 0 ${selectedElement.value.width} ${selectedElement.value.height}`);
                elementDiv.querySelector('svg').innerHTML = getSvgForElement(selectedElement.value);
            }
            
            // Update any associated measurements
            updateMeasurements(selectedElement.value);
        };
        
        // Delete the selected element
        const deleteElement = () => {
            if (!selectedElement.value) return;
            
            // Remove from DOM
            const elementDiv = document.querySelector(`.floor-element[data-id="${selectedElement.value.id}"]`);
            if (elementDiv) {
                elementDiv.remove();
            }
            
            // Remove from data
            floorPlanElements.value = floorPlanElements.value.filter(el => el.id !== selectedElement.value.id);
            
            // Clear selection
            selectedElement.value = null;
        };
        
        // Drawing functions
        const startDrawing = (event) => {
            if (!selectedTool.value) return;
            
            isDrawing.value = true;
            
            // Get the canvas coordinates
            const canvasRect = canvas.value.getBoundingClientRect();
            const x = (event.clientX - canvasRect.left) / zoomLevel.value;
            const y = (event.clientY - canvasRect.top) / zoomLevel.value;
            
            // Snap to grid if enabled
            startPoint.x = snapToGrid.value ? Math.round(x / 20) * 20 : x;
            startPoint.y = snapToGrid.value ? Math.round(y / 20) * 20 : y;
            
            endPoint.x = startPoint.x;
            endPoint.y = startPoint.y;
            
            // Create temporary element for drawing
            if (selectedTool.value.type === 'room' || 
                selectedTool.value.type === 'wall' || 
                selectedTool.value.type === 'dimension') {
                // For these types, we'll create the element when drawing stops
            } else {
                // For other types, create immediately at the clicked position
                const element = createNewElement(startPoint.x, startPoint.y);
                if (element) {
                    selectElementById(element.id);
                }
                isDrawing.value = false;
            }
        };
        
        const drawing = (event) => {
            if (!isDrawing.value || !selectedTool.value) return;
            
            // Get the canvas coordinates
            const canvasRect = canvas.value.getBoundingClientRect();
            const x = (event.clientX - canvasRect.left) / zoomLevel.value;
            const y = (event.clientY - canvasRect.top) / zoomLevel.value;
            
            // Snap to grid if enabled
            endPoint.x = snapToGrid.value ? Math.round(x / 20) * 20 : x;
            endPoint.y = snapToGrid.value ? Math.round(y / 20) * 20 : y;
            
            // Display temporary drawing guide
            // In a real implementation, you'd show a preview of the element being drawn
        };
        
        const stopDrawing = (event) => {
            if (!isDrawing.value || !selectedTool.value) return;
            
            // Create the element based on the drawing dimensions
            if (selectedTool.value.type === 'room' || 
                selectedTool.value.type === 'wall' || 
                selectedTool.value.type === 'dimension') {
                
                const width = Math.abs(endPoint.x - startPoint.x);
                const height = Math.abs(endPoint.y - startPoint.y);
                
                // Only create if it has a meaningful size
                if (width > 10 || height > 10) {
                    const x = Math.min(startPoint.x, endPoint.x);
                    const y = Math.min(startPoint.y, endPoint.y);
                    
                    const element = createNewElement(x, y, width, height);
                    if (element) {
                        selectElementById(element.id);
                        
                        // Add dimension measurements for rooms
                        if (selectedTool.value.type === 'room') {
                            addMeasurement(x, y - 25, x + width, y - 25, `${width} cm`, 'horizontal');
                            addMeasurement(x - 25, y, x - 25, y + height, `${height} cm`, 'vertical');
                        }
                    }
                }
            }
            
            isDrawing.value = false;
        };
        
        // Zoom functions
        const zoomIn = () => {
            zoomLevel.value = Math.min(2, zoomLevel.value + 0.1);
        };
        
        const zoomOut = () => {
            zoomLevel.value = Math.max(0.5, zoomLevel.value - 0.1);
        };
        
        // Toggle grid visibility
        const toggleGrid = () => {
            showGrid.value = !showGrid.value;
        };
        
        // Toggle snap to grid
        const toggleSnap = () => {
            snapToGrid.value = !snapToGrid.value;
            
            // Update interactions when snap changes
            initInteractions();
        };
        
        // Toggle ruler visibility
        const toggleRuler = () => {
            showRuler.value = !showRuler.value;
            
            // Reinitialize rulers if they're being shown
            if (showRuler.value) {
                setTimeout(initRulers, 0);
            }
        };
        
        // Create a new project
        const newProject = () => {
            if (confirm('Are you sure you want to start a new project? All unsaved changes will be lost.')) {
                floorPlanElements.value = [];
                measurements.value = [];
                selectedElement.value = null;
                
                // Clear the canvas
                canvas.value.querySelector('.elements-container').innerHTML = '';
                canvas.value.querySelector('.measurements-container').innerHTML = '';
            }
        };
        
        // Save the current project
        const saveProject = () => {
            // Create a project object with all data
            const project = {
                elements: floorPlanElements.value,
                measurements: measurements.value,
                settings: {
                    showGrid: showGrid.value,
                    snapToGrid: snapToGrid.value,
                    showRuler: showRuler.value
                }
            };
            
            // Convert to JSON and create a Blob
            const blob = new Blob([JSON.stringify(project)], { type: 'application/json' });
            
            // Create a download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'floor-plan.json';
            
            // Trigger the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        
        // Export the floor plan
        const exportFloorPlan = () => {
            // Create a clone of the canvas for export
            const exportCanvas = canvas.value.cloneNode(true);
            
            // Apply export settings
            if (!includeGrid.value) {
                const gridElement = exportCanvas.querySelector('.grid');
                if (gridElement) gridElement.remove();
            }
            
            if (!includeMeasurements.value) {
                const measurementsContainer = exportCanvas.querySelector('.measurements-container');
                if (measurementsContainer) measurementsContainer.innerHTML = '';
            }
            
            // Add watermark if specified
            if (watermarkText.value) {
                const watermark = document.createElement('div');
                watermark.style.position = 'absolute';
                watermark.style.bottom = '20px';
                watermark.style.right = '20px';
                watermark.style.fontFamily = 'Arial, sans-serif';
                watermark.style.fontSize = '14px';
                watermark.style.color = 'rgba(0, 0, 0, 0.5)';
                watermark.style.padding = '5px 10px';
                watermark.style.background = 'rgba(255, 255, 255, 0.7)';
                watermark.style.borderRadius = '4px';
                watermark.textContent = watermarkText.value;
                
                exportCanvas.appendChild(watermark);
            }
            
            // Add title and scale
            const titleBar = document.createElement('div');
            titleBar.style.position = 'absolute';
            titleBar.style.top = '20px';
            titleBar.style.left = '20px';
            titleBar.style.right = '20px';
            titleBar.style.textAlign = 'center';
            titleBar.style.fontFamily = 'Arial, sans-serif';
            titleBar.style.fontSize = '18px';
            titleBar.style.fontWeight = 'bold';
            titleBar.innerHTML = `FURNITURE PLAN<br>SCALE: ${exportScale.value}`;
            
            exportCanvas.appendChild(titleBar);
            
            // Use html-to-image or similar library to convert to PNG in a real implementation
            // For this example, we'll just create a placeholder download
            
            if (exportFormat.value === 'pdf') {
                // In a real implementation, you would use jsPDF to create the PDF
                alert('PDF export would be implemented here. The PDF would include the floor plan with the specified settings.');
            } else if (exportFormat.value === 'svg') {
                // In a real implementation, you would serialize the SVG elements
                alert('SVG export would be implemented here.');
            } else if (exportFormat.value === 'png') {
                // In a real implementation, you would use html-to-image or similar
                alert('PNG export would be implemented here.');
            }
            
            // Close the modal
            showExportModal.value = false;
        };
        
        // Initialize the app when mounted
        onMounted(() => {
            initCanvas();
        });
        
        // Watchers
        watch(showGrid, () => {
            // Update grid visibility as needed
        });
        
        watch(snapToGrid, () => {
            // Update snap behavior
            initInteractions();
        });
        
        return {
            // References
            canvasContainer,
            canvas,
            
            // State
            zoomLevel,
            showGrid,
            snapToGrid,
            showRuler,
            showExportModal,
            searchTerm,
            expandedCategories,
            selectedTool,
            selectedElement,
            exportFormat,
            exportPaperSize,
            exportScale,
            watermarkText,
            includeMeasurements,
            includeGrid,
            
            // Computed
            filteredCategories,
            
            // Methods
            toggleCategory,
            selectTool,
            updateElement,
            deleteElement,
            zoomIn,
            zoomOut,
            toggleGrid,
            toggleSnap,
            toggleRuler,
            startDrawing,
            drawing,
            stopDrawing,
            newProject,
            saveProject,
            exportFloorPlan
        };
    }
}).mount('#app');