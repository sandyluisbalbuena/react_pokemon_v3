import React, { useEffect, useRef } from 'react';

const ChartThreads = () => {
const chartRef = useRef(null);

useEffect(() => {
	fetchThreadsChartData();
}, []);

function fetchThreadsChartData() {
	axios
	.get('http://127.0.0.1:8000/api/threadschartdata')
	.then(response => {
		const pokecardCounts = countThreadsByDate(response.data.pokecard);
		const pokedexCounts = countThreadsByDate(response.data.pokedex);

		renderChart(pokecardCounts, pokedexCounts);
	})
	.catch(error => {
		// Handle errors
	});
}

function countThreadsByDate(data) {
	const counts = {};

	for (const date in data) {
	counts[date] = Object.keys(data[date]).length;
	}

	return counts;
}

	function renderChart(pokecardCounts, pokedexCounts) {
		const ctx = chartRef.current.getContext('2d');
		new window.Chart(ctx, {
		type: 'bar',
		data: {
			labels: Object.keys(pokecardCounts),
			datasets: [
			{
				label: 'Pokecard',
				data: Object.values(pokecardCounts),
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				barPercentage: 0.4, // Adjust the width of the bars for Pokecard category
				categoryPercentage: 0.5, // Adjust the space between the bars for Pokecard category
			},
			{
				label: 'Pokedex',
				data: Object.values(pokedexCounts),
				backgroundColor: 'rgba(54, 162, 235, 0.5)',
				barPercentage: 0.4, // Adjust the width of the bars for Pokedex category
				categoryPercentage: 0.5, // Adjust the space between the bars for Pokedex category
			},
			],
		},
		options: {
			scales: {
			x: {
				stacked: false, // Disable stacking for side-by-side bars
			},
			y: {
				beginAtZero: true,
			},
			},
		},
		});
	}

return (
	<div className="card mb-2 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{ borderRadius: '5px', height: '100%' }} id="secondCard">
	<div className="card-body container-fluid">
		<h6 className="ms-4">Chart</h6>
		<canvas ref={chartRef}></canvas>
	</div>
	</div>
);
};

export default ChartThreads;
