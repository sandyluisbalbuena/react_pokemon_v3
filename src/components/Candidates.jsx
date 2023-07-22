import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app';


const Candidates = () => {
	const [candidates, setCandidates] = useState([]);
	let currentUser = firebase.auth().currentUser;
	let bearerToken = localStorage.getItem('bearerToken');

	useEffect(() => {
		fetchUserActivitiesData();

		// Set up a listener for changes in the Firebase threads reference
		const threadsRef = firebase.database().ref('threads'); // Replace 'threads' with your actual reference path
		const usersRef = firebase.database().ref('users'); // Replace 'threads' with your actual reference path
		threadsRef.on('value', handleDataChange);
		usersRef.on('value', handleDataChange);
	
		// Clean up the listener when the component unmounts
		return () => {
			threadsRef.off('value', handleDataChange);
			usersRef.off('value', handleDataChange);
		};
	}, []);

	// Callback function to handle changes in the Firebase data
	function handleDataChange(snapshot) {
		fetchUserActivitiesData();
	}

	function fetchUserActivitiesData() {
		axios
		.get('https://pok3mon.online/api/useractivities')
		// .get('http://127.0.0.1:8000/api/useractivities')
		.then(response => {
			const attendanceData = response.data;
			const top10 = Object.entries(attendanceData)
			.map(([username, activityCount]) => ({ username, activityCount }))
			.sort((a, b) => b.activityCount - a.activityCount)
			.slice(0, 10);

			setCandidates(top10);
		})
	}

	function promote(userId){
		const formData = {
			role: 'moderator',
		};

		axios
		// .put('http://127.0.0.1:8000/api/user/promote/'+userId, formData, {
		.put('https://pok3mon.online/api/user/promote/'+userId, formData, {
			headers: {
				'X-User-Uid': currentUser.uid,
				'Authorization': `Bearer ${bearerToken}`,
			},
		})
		.then(response => {
			Swal.fire({
				icon: 'success',
				title: 'User promoted successfully!',
			});
		})
		.catch(error => {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Something went wrong!',
			});
		})
	}


	return (
		<div className="card mb-2 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{ borderRadius: '5px', height: '100%' }} id="secondCard">
			<div className="card-body container-fluid">
				<div className="d-flex justify-content-between" type="button" data-mdb-toggle="collapse" data-mdb-target="#candidates" aria-expanded="true" aria-controls="candidates">
				<h6 className="ms-4">Candidates for Moderator</h6>
				<i className="fas fa-angles-down"></i>
				</div>
				<ul className="collapse show mt-3" id="candidates" style={{ listStyleType: 'none' }}>
				{candidates.map((candidate) => (
					// <a onClick={() => wew(category.name)} key={category.id} href={'/pokeforum#' + category.name}>
					<li className="px-2 py-1 rounded list-group-item threads-latest my-2 justify-content-between d-flex" key={candidate.username} style={{ fontSize: '12px', textDecoration: 'none', color: 'black' }}>
						<span>
							{candidate.username.toUpperCase()}
						</span> 
						<span className='badge badge-primary' type='button' onClick={()=>promote(candidate.activityCount.push_key)}>PROMOTE <i className="fas fa-plus"></i></span>
					</li>
					// </a>
				))}
				</ul>
			</div>
		</div>
	)
}

export default Candidates