import React, { useEffect, useRef } from 'react';
// import Chart from 'chart.js';

const PokemonStats = (props) => {
  const chartRef = useRef(null);
  let chartInstance;

  useEffect(() => {
    chartInstance = createChartInstance(chartRef.current);
    updateChartData(props, chartInstance);

    return () => {
      destroyChart(chartInstance);
    };
  }, [props]);

  function createChartInstance(chartElement) {
    const ctx = chartElement.getContext('2d');
    return new Chart(ctx, {
      type: 'bar',
      data: {},
      options: {},
    });
  }

  function updateChartData(data, chartInstance) {
    // Update the chart data here based on the provided data
    // Example:
    chartInstance.data = {
      labels: data.labels,
      datasets: [
        {
          label: 'ATTRIBUTES',
          data: data.values,
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)',
        },
      ],
    };

    chartInstance.update();
  }

  function destroyChart(chartInstance) {
    if (chartInstance) {
      chartInstance.destroy();
    }
  }

  return <canvas ref={chartRef} style={{ width: '90%', height: '600px' }} className="mb-3"></canvas>;
};

export default PokemonStats;
