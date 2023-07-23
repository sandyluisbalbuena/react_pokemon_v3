import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app';

const Moderators = () => {
	const [moderators, setModerators] = useState([]);
	const [demoting, setDemoting] = useState(false);
	let currentUser = firebase.auth().currentUser;
	let bearerToken = localStorage.getItem('bearerToken');


	useEffect(() => {
		fetchModeratorsData();

		const threadsRef = firebase.database().ref('users'); // Replace 'threads' with your actual reference path
		threadsRef.on('value', handleDataChange);
	
		// Clean up the listener when the component unmounts
		return () => {
			threadsRef.off('value', handleDataChange);
		};
	}, []);

	function handleDataChange(snapshot) {
		fetchModeratorsData();
	}

	function fetchModeratorsData() {
		axios
		// .get('http://127.0.0.1:8000/api/moderators')
		.get('https://pok3mon.online/api/moderators')
		.then(response => {
			setModerators(response.data);
		})
	}

	function demote(userId){
		setDemoting(true);
		const formData = {
			role: 'user',
		};

		axios
		.put('http://127.0.0.1:8000/api/user/demote/'+userId, formData, {
			// .put('https://pok3mon.online/api/user/demote/'+userId, formData, {
			headers: {
				'X-User-Uid': currentUser.uid,
				'Authorization': `Bearer ${bearerToken}`,
			},
		})
		.then(response => {
			setTimeout(() => {
				setDemoting(false);
				Swal.fire({
					icon: 'success',
					title: 'User demoted successfully!',
				});
			}, 500);
			
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
				<div className="d-flex justify-content-between" type="button" data-mdb-toggle="collapse" data-mdb-target="#moderators" aria-expanded="true" aria-controls="moderators">
				<h6 className="ms-4">Moderators</h6>
				<i className="fas fa-angles-down"></i>
				</div>
				<ul className="collapse mt-3" id="moderators" style={{ listStyleType: 'none' }}>
				{moderators.map((moderator) => (
					<li className="px-2 py-1 rounded list-group-item threads-latest my-2 justify-content-between d-flex" key={moderator.firebase_id} style={{ fontSize: '12px', textDecoration: 'none', color: 'black' }}>
						<span>
							{moderator.username?.toUpperCase()}
						</span> 
						{demoting ? (
							<div class="spinner-border spinner-border-sm text-danger text-sm" role="status"></div>
						):(
							<span className='badge badge-danger' type='button' onClick={()=>demote(moderator.firebase_id)}>DEMOTE <i className="fas fa-minus"></i></span>
						)}
					</li>
				))}
				</ul>
			</div>
		</div>
	)
}

export default Moderators