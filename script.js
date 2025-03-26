// Main Vue app
document.addEventListener('DOMContentLoaded', () => {
  const { createApp, ref, computed, onMounted } = Vue;

  createApp({
    data() {
      return {
        projects: projects,
        filters: {
          search: '',
          selectedModels: [],
          dateRange: {
            from: '',
            to: ''
          }
        }
      };
    },
    computed: {
      // Calculate available models from all projects
      availableModels() {
        const modelSet = new Set();
        
        this.projects.forEach(project => {
          if (project.models && Array.isArray(project.models)) {
            project.models.forEach(model => modelSet.add(model));
          }
        });
        
        return Array.from(modelSet).sort();
      },
      
      // Filter projects based on active filters
      filteredProjects() {
        return this.projects.filter(project => {
          // Search filter
          const searchMatch = !this.filters.search || 
            project.name.toLowerCase().includes(this.filters.search.toLowerCase());
          
          // Models filter
          const modelsMatch = this.filters.selectedModels.length === 0 || 
            (project.models && project.models.some(model => 
              this.filters.selectedModels.includes(model)
            ));
          
          // Date filter
          let dateMatch = true;
          if (project.date) {
            const projectDate = new Date(project.date);
            
            if (this.filters.dateRange.from) {
              const fromDate = new Date(this.filters.dateRange.from);
              dateMatch = dateMatch && projectDate >= fromDate;
            }
            
            if (this.filters.dateRange.to) {
              const toDate = new Date(this.filters.dateRange.to);
              // Set to end of day for inclusive comparison
              toDate.setHours(23, 59, 59, 999);
              dateMatch = dateMatch && projectDate <= toDate;
            }
          }
          
          return searchMatch && modelsMatch && dateMatch;
        });
      }
    },
    methods: {
      // Reset all filters
      resetFilters() {
        this.filters = {
          search: '',
          selectedModels: [],
          dateRange: {
            from: '',
            to: ''
          }
        };
      },
      
      // Navigate to project
      navigateToProject(path) {
        window.location.href = path;
      },
      
      // Format date for display
      formatDate(dateString) {
        if (!dateString) return 'No date';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      },
      
      // Handle image loading errors
      handleImageError(event) {
        event.target.src = 'https://via.placeholder.com/400x300?text=No+Preview';
      }
    },
    mounted() {
      // Set initial date range values based on project dates
      if (this.projects.length > 0) {
        const dates = this.projects
          .filter(project => project.date)
          .map(project => new Date(project.date));
        
        if (dates.length > 0) {
          const minDate = new Date(Math.min(...dates));
          const maxDate = new Date(Math.max(...dates));
          
          // We don't set these by default to not filter immediately
          // this.filters.dateRange.from = minDate.toISOString().split('T')[0];
          // this.filters.dateRange.to = maxDate.toISOString().split('T')[0];
        }
      }
    }
  }).mount('#app');
});