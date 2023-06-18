import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';


const ForumMyThreads = () => {
const [userThreads, setUserThreads] = useState([]);
const currentUser = firebase.auth().currentUser;
let userThreadsQuery;

useEffect(() => {
	if (currentUser) {
		console.log('wew');
	const userId = currentUser.uid;
	const threadsRef = firebase.database().ref('threads');
	userThreadsQuery = threadsRef.orderByChild('userId').equalTo(userId);
	userThreadsQuery.on('value', (snapshot) => {
		const threadsData = snapshot.val();

		if (threadsData) {
		const threadsArray = Object.entries(threadsData).map(([key, value]) => ({
			threadId: key,
			...value,
		}));
		setUserThreads(threadsArray);
		} else {
		setUserThreads([]);
		}
	});
	} else {
	setUserThreads([]);
	}

	return () => {
	if (userThreadsQuery) {
		userThreadsQuery.off('value');
	}
	};
}, [currentUser]);

return (
	<div className="card mb-2 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{ borderRadius: '5px', height: '100%' }} id="secondCard">
	<div className="card-body container-fluid">
		<div className="d-flex justify-content-between" type="button" data-mdb-toggle="collapse" data-mdb-target="#myThreads" aria-expanded="false" aria-controls="myThreads">
		<h6 className="ms-4">
			My threads
		</h6>
		<i className="fas fa-angles-down"></i>
		</div>
		<ul className="collapse mt-4" id="myThreads">
		{userThreads.map((userThread) => (
			<a key={userThread.threadId}  href={`/pokeforum/${userThread.slug}`}>
			<li className="px-2 py-1 rounded list-group-item threads-latest my-2" style={{ fontSize: '12px', textDecoration: 'none', color: 'black' }}>
				{userThread.title.toUpperCase()}
			</li>
			</a>
		))}
		</ul>
	</div>
	</div>
);
};

export default ForumMyThreads;
