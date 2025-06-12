(function() {
    const hasToastList = document.querySelector("[toast-list]") !== null;
    const hasDataChoices = document.querySelector("[data-choices]") !== null;
    const hasDataProvider = document.querySelector("[data-provider]") !== null;
  
    if (hasToastList || hasDataChoices || hasDataProvider) {
      function loadScript(src) {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.async = false;  // carga síncrona para mantener orden
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
  
      // Cargar scripts en orden
      loadScript('https://cdn.jsdelivr.net/npm/toastify-js')
        .then(() => loadScript('assets/libs/choices.js/public/assets/scripts/choices.min.js'))
        .then(() => loadScript('assets/libs/flatpickr/flatpickr.min.js'))
        .catch(err => console.error('Error cargando scripts dinámicos:', err));
    }
  })();
  