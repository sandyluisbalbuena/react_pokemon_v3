import React, { useEffect, useRef } from 'react';
import firebase from 'firebase/compat/app';

const ChartPieThreads = () => {
  const chartRef = useRef(null);
  let chartInstance = useRef(null);

  useEffect(() => {
    fetchThreadsChartData();

    const threadsRef = firebase.database().ref('threads'); // Replace 'threads' with your actual reference path
    threadsRef.on('value', handleDataChange);

    // Clean up the listener when the component unmounts
    return () => {
      threadsRef.off('value', handleDataChange);
    };
  }, []);

  function handleDataChange(snapshot) {
    fetchThreadsChartData();
  }

  function fetchThreadsChartData() {
    axios
      .get('https://pok3mon.online/api/threadschartdata')
      .then(response => {
        const pokecardTotalThreadCount = getTotalThreadCount(response.data.pokecard);
        const pokedexTotalThreadCount = getTotalThreadCount(response.data.pokedex);

        updateChart(pokecardTotalThreadCount, pokedexTotalThreadCount);
      })
      .catch(error => {
        console.error(error);
      });
  }

  function getTotalThreadCount(categoryData) {
    let totalCount = 0;

    for (const date in categoryData) {
      const threads = categoryData[date];
      totalCount += Object.keys(threads).length;
    }

    return totalCount;
  }

  function updateChart(pokecardTotalThreadCount, pokedexTotalThreadCount) {
    if (!chartInstance.current) {
      createChart(pokecardTotalThreadCount, pokedexTotalThreadCount);
    } else {
      // Update the chart data if the chart instance exists
      chartInstance.current.data.datasets[0].data = [pokecardTotalThreadCount, pokedexTotalThreadCount];
      chartInstance.current.update();
    }
  }

  function createChart(pokecardTotalThreadCount, pokedexTotalThreadCount) {
    const ctx = chartRef.current;

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pokecard', 'Pokedex'],
        datasets: [
          {
            data: [pokecardTotalThreadCount, pokedexTotalThreadCount],
            backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  return (
    <div className="card mb-2 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{ borderRadius: '5px', height: '100%' }} id="secondCard">
      <div className="card-body container-fluid">
        <h6 className="ms-4 text-center">Total Thread by Category</h6>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ChartPieThreads;
