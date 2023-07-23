import React, { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/compat/app';

const ChartThreads = () => {
	const chartRef = useRef(null);
	const [loading, setLoading] = useState(true);
	const threadsRef = firebase.database().ref('threads');
	let chartInstance = null; // Reference to the chart instance

	useEffect(() => {

		fetchThreadsChartData().then(([pokecardCounts, pokedexCounts]) => {
			setLoading(false);
			setTimeout(() => {
				renderChart(pokecardCounts, pokedexCounts);
			}, 100);
		});

		// Listen for changes in threads data
		threadsRef.on('value', () => {
			fetchThreadsChartData().then(([pokecardCounts, pokedexCounts]) => {
				updateChart(pokecardCounts, pokedexCounts);
			});
		});

		return () => {
		// Unsubscribe from changes when component unmounts
		threadsRef.off();
		};
	}, []);

	function fetchThreadsChartData() {
		return new Promise((resolve, reject) => {
		axios
			// .get('http://127.0.0.1:8000/api/threadschartdata')
			.get('https://pok3mon.online/api/threadschartdata')
			.then(response => {
			const pokecardCounts = countThreadsByDate(response.data.pokecard);
			const pokedexCounts = countThreadsByDate(response.data.pokedex);

			resolve([pokecardCounts, pokedexCounts]);
			})
			.catch(error => {
			reject(error);
			});
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
		const maxCount = Math.max(
		Math.max(...Object.values(pokecardCounts)),
		Math.max(...Object.values(pokedexCounts))
		);
		const yAxisMax = maxCount + 2;

		chartInstance = new window.Chart(ctx, {
		type: 'bar',
		data: {
			labels: Object.keys(pokecardCounts),
			datasets: [
			{
				label: 'Pokecard',
				data: Object.values(pokecardCounts),
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				barPercentage: .8, // Adjust the width of the bars for Pokecard category
				categoryPercentage: .8, // Adjust the space between the bars for Pokecard category
			},
			{
				label: 'Pokedex',
				data: Object.values(pokedexCounts),
				backgroundColor: 'rgba(54, 162, 235, 0.5)',
				barPercentage: .8, // Adjust the width of the bars for Pokedex category
				categoryPercentage: .8, // Adjust the space between the bars for Pokedex category
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
				max: yAxisMax, // Set the maximum value for the y-axis
				ticks: {
				stepSize: 1, // Display whole numbers on the y-axis
				},
			},
			},
		},
		});
	}

	function updateChart(pokecardCounts, pokedexCounts) {
		if (chartInstance) {
		chartInstance.data.datasets[0].data = Object.values(pokecardCounts);
		chartInstance.data.datasets[1].data = Object.values(pokedexCounts);
		chartInstance.update();
		}
	}

	return (
		<>
			{loading ? (
				<div className="card mb-2 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{ borderRadius: '5px', height: '100%' }} id="secondCard">
					<div className="card-body container-fluid placeholder-wave">
						<h6 className="ms-4 placeholder col-4 offset-4 rounded"></h6>
						<img className='placeholder col-12 rounded mt-3' height={300}/>
					</div>
				</div>
			):(
				<div className="card mb-2 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{ borderRadius: '5px', height: '100%' }} id="secondCard">
					<div className="card-body container-fluid">
						<h6 className="ms-4 text-center">Daily thread count for pokedex and pokecard<br/>Year 2023</h6>
						<canvas ref={chartRef}></canvas>
					</div>
				</div>
			)}
		</>
	);
};

export default ChartThreads;
