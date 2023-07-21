import React, { useEffect, useState } from 'react'

const Candidates = () => {

	const [candidates, setCandidates] = useState([]);

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

			setCandidates(top5Data);

			console.log(top5Data);
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
					<li className="px-2 py-1 rounded list-group-item threads-latest my-2" key={candidate.username} style={{ fontSize: '12px', textDecoration: 'none', color: 'black' }}>
						{candidate.username.toUpperCase()}
					</li>
					// </a>
				))}
				</ul>
			</div>
		</div>
	)
}

export default Candidates