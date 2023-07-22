import React, { useEffect, useRef } from 'react';
import firebase from 'firebase/compat/app';

const ChartUserActivities = () => {
	const chartRef = useRef(null);
  	let chartInstance = useRef(null);

	useEffect(() => {
		createBarChart(); // Initial chart creation
		fetchUserActivitiesData();

		// Set up a listener for changes in the Firebase users reference
		const usersRef = firebase.database().ref('users'); // Replace 'users' with your actual reference path
		usersRef.on('value', handleDataChange);
	
		// Set up a listener for changes in the Firebase threads reference
		const threadsRef = firebase.database().ref('threads'); // Replace 'threads' with your actual reference path
		threadsRef.on('value', handleDataChange);
	
		// Clean up the listeners when the component unmounts
		return () => {
			usersRef.off('value', handleDataChange);
			threadsRef.off('value', handleDataChange);
		};
	}, []);

	function handleDataChange(snapshot) {
		// User data has changed, refetch the data and update the chart
		fetchUserActivitiesData();
	}

	function updateBarChart(data) {
		if (chartInstance.current) {
		// Update the chart data and labels if the chart instance exists
		chartInstance.current.data.labels = data.map(entry => entry.username);
		chartInstance.current.data.datasets[0].data = data.map(entry => entry.activityCount.count);
		chartInstance.current.update();
		}
	}
	

	function fetchUserActivitiesData() {
		axios
		// .get('http://127.0.0.1:8000/api/useractivities')
		.get('https://pok3mon.online/api/useractivities')
		.then(response => {
			const attendanceData = response.data;

			// Convert the object to an array of objects with username and activityCount keys
			const top5Data = Object.entries(attendanceData)
			.map(([username, activityCount]) => ({ username, activityCount }))
			.sort((a, b) => b.activityCount - a.activityCount)
			.slice(0, 10);

			updateBarChart(top5Data);
		})
		.catch(error => {
			// Handle errors
		});
	}

	function createBarChart() {
		const ctx = chartRef.current;
	
		chartInstance.current = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: [],
			datasets: [
			{
				label: 'Activity Count',
				data: [],
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
				<h6 className="ms-4 text-center">Top Users by Activity Count</h6>
				<canvas ref={chartRef}></canvas>
			</div>
		</div>
	);
};

export default ChartUserActivities;
