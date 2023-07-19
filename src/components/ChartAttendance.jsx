import React, { useEffect, useRef } from 'react';

const ChartAttendance = () => {
	const chartRef = useRef(null);

	useEffect(() => {
		fetchUserAttendanceData();
	}, []);

	function fetchUserAttendanceData() {
		axios
			.get('http://127.0.0.1:8000/api/userattendance')
			.then(response => {
				const attendanceData = response.data;
				renderChart(attendanceData);
			})
			.catch(error => {
				// Handle errors
			});
	}

	function renderChart(attendanceData) {
		const ctx = chartRef.current.getContext('2d');

		// Convert the attendanceData object into an array of [date, count] pairs
		const dataEntries = Object.entries(attendanceData);

		// Separate the dates and counts into separate arrays
		const dates = dataEntries.map(([date]) => date);
		const counts = dataEntries.map(([_, count]) => count);

		new Chart(ctx, {
			type: 'bar',
			data: {
				labels: dates.map(date => formatDate(date)), // Format the dates before displaying on the x-axis
				datasets: [
					{
						label: 'Total Users',
						data: counts,
						backgroundColor: 'rgba(75, 192, 192, 0.5)',
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

	function formatDate(dateString) {
		const date = new Date(parseInt(dateString));
		return date.toLocaleDateString();
	}

	return (
		<div className="card mb-2 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{ borderRadius: '5px', height: '100%' }} id="secondCard">
			<div className="card-body container-fluid">
				<h6 className="ms-4 text-center">Daily Logged in Users</h6>
				<canvas ref={chartRef}></canvas>
			</div>
		</div>
	);
};

export default ChartAttendance;
