const { createApp, ref, computed, onMounted, watch } = Vue;

createApp({
    setup() {
        // Configuration
        const basePath = 'assets/stories/001/';
        const audioFile = `${basePath}story.mp3`;
        const slideDuration = 6000; // How long each slide shows (in ms)
        const fadeTime = 1000; // Transition time between slides (in ms)
        
        // State
        const images = ref([]);
        const audio = ref(null);
        const currentImageIndex = ref(0);
        const isPlaying = ref(true);
        const currentTime = ref(0);
        const duration = ref(0);
        const volume = ref(0.4);
        const zoomDirections = ref([]); // true for zoom-in, false for zoom-out
        
        // Add subtle frame movement effect
        const applyFrameEffect = () => {
            const frame = document.querySelector('.wall-frame');
            if (!frame) return;
            
            document.addEventListener('mousemove', (e) => {
                const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
                const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
                frame.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
            });
        };
        
        // Load images
        const loadImages = () => {
            // In a real app, you'd dynamically fetch this list
            const imageCount = 4; // Adjust based on your actual image count
            const loadedImages = [];
            
            for (let i = 1; i <= imageCount; i++) {
                // Format number with leading zero if needed (01, 02, etc.)
                const imageNumber = i.toString().padStart(2, '0');
                const imagePath = `${basePath}image${imageNumber}.jpg`;
                
                loadedImages.push({
                    src: imagePath,
                    loaded: false
                });
                
                // Preload images
                const img = new Image();
                img.onload = () => {
                    loadedImages[i-1].loaded = true;
                };
                img.src = imagePath;
                
                // Randomly assign zoom direction for each image
                zoomDirections.value.push(Math.random() > 0.5);
            }
            
            images.value = loadedImages;
        };
        
        // Initialize audio
        const initAudio = () => {
            audio.value = new Audio(audioFile);
            audio.value.volume = volume.value;
            
            audio.value.addEventListener('loadedmetadata', () => {
                duration.value = audio.value.duration;
                audio.value.play();
            });
            
            audio.value.addEventListener('timeupdate', () => {
                currentTime.value = audio.value.currentTime;
                
                // Calculate which image should be shown based on current time
                if (images.value.length > 0) {
                    const newIndex = Math.min(
                        Math.floor(currentTime.value / (duration.value / images.value.length)),
                        images.value.length - 1
                    );
                    
                    if (newIndex !== currentImageIndex.value) {
                        currentImageIndex.value = newIndex;
                    }
                }
            });
            
            audio.value.addEventListener('ended', () => {
                isPlaying.value = false;
                audio.value.currentTime = 0;
                currentImageIndex.value = 0;
            });
            
            // Preload audio
            audio.value.load();
        };
        
        // Computed
        const progressPercentage = computed(() => {
            return (currentTime.value / duration.value) * 100 || 0;
        });
        
        // Methods
        const togglePlayPause = () => {
            if (isPlaying.value) {
                audio.value.pause();
            } else {
                audio.value.play();
            }
            isPlaying.value = !isPlaying.value;
        };
        
        const updateVolume = () => {
            if (audio.value) {
                audio.value.volume = volume.value;
            }
        };
        
        const getSlideStyle = (index) => {
            // Determine if this slide should zoom in or out
            const shouldZoomIn = zoomDirections.value[index];
            
            if (index === currentImageIndex.value) {
                return {
                    'transition': 'opacity 1s ease',
                    'opacity': 1,
                    'z-index': 1,
                    'animation': shouldZoomIn ? 
                        'zoomInEffect 6s ease-in-out forwards' : 
                        'zoomOutEffect 6s ease-in-out forwards'
                };
            }
            return {};
        };
        
        onMounted(() => {
            loadImages();
            initAudio();
            applyFrameEffect();
            
            // Add CSS animations dynamically
            const styleSheet = document.styleSheets[0];
            styleSheet.insertRule(`
                @keyframes zoomInEffect {
                    from { transform: scale(1); }
                    to { transform: scale(1.2); }
                }
            `, styleSheet.cssRules.length);
            
            styleSheet.insertRule(`
                @keyframes zoomOutEffect {
                    from { transform: scale(1.2); }
                    to { transform: scale(1); }
                }
            `, styleSheet.cssRules.length);
        });
        
        // Handle click on progress bar to seek
        const seekToPosition = (event) => {
            const progressContainer = event.currentTarget;
            const clickPosition = event.offsetX / progressContainer.offsetWidth;
            const seekTime = clickPosition * duration.value;
            
            if (audio.value) {
                audio.value.currentTime = seekTime;
            }
        };
        
        return {
            images,
            currentImageIndex,
            isPlaying,
            volume,
            progressPercentage,
            togglePlayPause,
            updateVolume,
            getSlideStyle,
            seekToPosition
        };
    }
}).mount('#app');