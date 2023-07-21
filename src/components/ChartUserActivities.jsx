import React, { useEffect, useRef } from 'react';

const ChartUserActivities = () => {
	const chartRef = useRef(null);

	useEffect(() => {
		fetchUserActivitiesData();
	}, []);

	function fetchUserActivitiesData() {
		axios
		.get('http://127.0.0.1:8000/api/useractivities')
		.then(response => {
			const attendanceData = response.data;

			// Convert the object to an array of objects with username and activityCount keys
			const top5Data = Object.entries(attendanceData)
			.map(([username, activityCount]) => ({ username, activityCount }))
			.sort((a, b) => b.activityCount - a.activityCount)
			.slice(0, 15);

			createBarChart(top5Data);
		})
		.catch(error => {
			// Handle errors
		});
	}

	function createBarChart(data) {
		const ctx = chartRef.current.getContext('2d');
		new Chart(ctx, {
		type: 'bar',
		data: {
			labels: data.map(entry => entry.username),
			datasets: [
			{
				label: 'Activity Count',
				data: data.map(entry => entry.activityCount),
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1,
			},
			],
		},
		options: {
			scales: {
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
				<h6 className="ms-4 text-center">Top 15 Users by Activity Count</h6>
				<canvas ref={chartRef}></canvas>
			</div>
		</div>
	);
};

export default ChartUserActivities;
