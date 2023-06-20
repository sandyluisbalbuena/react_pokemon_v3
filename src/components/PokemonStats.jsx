import React, { useEffect, useRef } from 'react';

const PokemonStats = (props) => {
const chartRef = useRef(null);
let chartInstance = useRef(null);

useEffect(() => {
	const pokemonAttributes = (data) => {
	if (data.stats.length === 0) {
		return;
	}

	if (chartInstance.current) {
		destroyChart();
	}

	let HP = data.stats[0].base_stat;
	let ATTACK = data.stats[1].base_stat;
	let DEFENSE = data.stats[2].base_stat;
	let SPECIAL_ATTACK = data.stats[3].base_stat;
	let SPECIAL_DEFENSE = data.stats[4].base_stat;
	let SPEED = data.stats[5].base_stat;

	const dataRadarChart = {
		labels: [
		'HP',
		'SPECIAL ATTACK',
		'ATTACK',
		'SPEED',
		'DEFENSE',
		'SPECIAL DEFENSE',
		],
		datasets: [
		{
			label: 'ATTRIBUTES',
			data: [HP, SPECIAL_ATTACK, ATTACK, SPEED, DEFENSE, SPECIAL_DEFENSE],
			fill: true,
			backgroundColor: 'rgba(255, 99, 132, 0.2)',
			borderColor: 'rgb(255, 99, 132)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgb(255, 99, 132)',
		},
		],
	};

	var options = {
		scale: {
		min: 0,
		max: 200,
		ticks: {
			beginAtZero: true,
			min: 0,
			max: 100,
			stepSize: 20,
		},
		},
		elements: {
		line: {
			borderWidth: 0,
		},
		},
		animation: {
		duration: 2000,
		delay: 500,
		},
		legend: {
		display: false,
		},
	};

	var ctx = chartRef.current.getContext('2d');
	chartInstance.current = new Chart(ctx, {
		type: 'bar',
		data: dataRadarChart,
		options: options,
	});
	};

	const destroyChart = () => {
	if (chartInstance.current) {
		chartInstance.current.destroy();
		chartInstance.current = null;
	}
	};

	pokemonAttributes(props);

	return () => {
	destroyChart();
	};
}, [props]);

return (
	<canvas
	id="pokemonStatscanvas"
	ref={chartRef}
	style={{ width: '90%', height: '600px' }}
	className="mb-3"
	></canvas>
);
};

export default PokemonStats;
