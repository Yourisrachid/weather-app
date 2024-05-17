export function responsiveGraph() {

    function appendGraph(x) {
        if (x.matches) {
            const chartCanvas = detailsContainer.querySelector('canvas.chart');
            const graphContainer = document.createElement('div')
            const main = document.querySelector('main')
            main.appendChild(graphContainer)
            graphContainer.appendChild(chartCanvas)
        }
      
      let a = window.matchMedia("(min-width: 1024)")
      
      a.addEventListener("change", function() {
        appendGraph(a);
      });
    
      const details = document.querySelector('.details')
    
      details.addEventListener("click", function() {
        appendGraph(a);
    })
    }

}


