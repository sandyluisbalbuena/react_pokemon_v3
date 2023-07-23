import React, { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/compat/app';

const ChartAttendance = () => {
	const chartRef = useRef(null);
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		fetchUserAttendanceData();

		const userAttendanceRef = firebase.database().ref('userAttendance'); // Replace 'threads' with your actual reference path
		userAttendanceRef.on('value', handleDataChange);
	
		// Clean up the listener when the component unmounts
		return () => {
			userAttendanceRef.off('value', handleDataChange);
		};
	}, []);

	function handleDataChange(snapshot) {
		fetchUserAttendanceData();
	}

	function fetchUserAttendanceData() {
		axios
		// .get('http://127.0.0.1:8000/api/userattendance')
		.get('https://pok3mon.online/api/userattendance')
		.then(response => {
			const attendanceData = response.data;
			setLoading(false);


			// Convert the timestamps in the data object to formatted dates
			// const formattedData = Object.entries(attendanceData).map(([timestamp, value]) => ({
			// 	date: formatTimestamp(timestamp),
			// 	value,
			// }));

			// console.log(formattedData)
			setTimeout(() => {
				renderChart(attendanceData);
			}, 100);
		})
		.catch(error => {
			// Handle errors
		});
	}

	function formatTimestamp(timestamp) {
		const dateObj = new Date(parseInt(timestamp, 10));
		const month = dateObj.toLocaleString('default', { month: 'short' });
		const date = dateObj.getDate();
		return `${month} ${date}`;
	}

	function renderChart(attendanceData) {
		const ctx = chartRef.current.getContext('2d');
	
		// Convert the attendanceData object into an array of [date, count] pairs
		const dataEntries = Object.entries(attendanceData);
	
		// Separate the dates and counts into separate arrays
		const dates = dataEntries.map(([timestamp, value]) => formatTimestamp(timestamp));
		const counts = dataEntries.map(([timestamp, value]) => value);
	
		new Chart(ctx, {
		type: 'bar',
		data: {
			labels: dates,
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
		<>
		{loading ? (
			<div className="card mb-2 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{ borderRadius: '5px', height: '100%' }} id="secondCard">
				<div className="card-body container-fluid placeholder-wave">
					<h6 className="ms-4 text-center placeholder col-8 offset-2"></h6>
					<img className='placeholder col-12 rounded' style={{height:'400'}}/>
				</div>
			</div>
		):(
			<div className="card mb-2 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{ borderRadius: '5px', height: '100%' }} id="secondCard">
				<div className="card-body container-fluid">
					<h6 className="ms-4 text-center">Daily Logged in Users</h6>
					<canvas ref={chartRef}></canvas>
				</div>
			</div>
		)}
		</>
	);
};

export default ChartAttendance;
