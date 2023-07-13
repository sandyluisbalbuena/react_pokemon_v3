import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const OnlineUsers = () => {
const [onlineUsers, setOnlineUsers] = useState([]);
const [userMap, setUserMap] = useState({});

useEffect(() => {
	const onlineUsersRef = firebase.database().ref('onlineUsers');
	const usersRef = firebase.database().ref('users');

	const handleOnlineUsersChange = (snapshot) => {
	const onlineUserIds = Object.entries(snapshot.val() || {})
		.filter(([userId, isOnline]) => isOnline === true)
		.map(([userId]) => userId);

	// Retrieve user data for each online user
	const onlineUserPromises = onlineUserIds.map((userId) => {
		return usersRef.child(userId).once('value');
	});

	Promise.all(onlineUserPromises)
		.then((snapshots) => {
		const onlineUserData = snapshots.reduce((data, snapshot) => {
			const userId = snapshot.key;
			const userData = snapshot.val();
			data[userId] = userData;
			return data;
		}, {});

		setOnlineUsers(onlineUserIds);
		setUserMap(onlineUserData);
		})
		.catch((error) => {
		console.error('Error retrieving user data:', error);
		});
	};

	const handleUserStatusChange = (snapshot) => {
	const userId = snapshot.key;
	const isOnline = snapshot.val();

	if (!isOnline) {
		setOnlineUsers((prevOnlineUsers) => prevOnlineUsers.filter((id) => id !== userId));
		setUserMap((prevUserMap) => {
		const newUserMap = { ...prevUserMap };
		delete newUserMap[userId];
		return newUserMap;
		});
	}
	};

	const handleUsernameChange = (snapshot) => {
	const userId = snapshot.key;
	const newUsername = snapshot.val()?.username;

	setUserMap((prevUserMap) => ({
		...prevUserMap,
		[userId]: {
		...prevUserMap[userId],
		username: newUsername,
		},
	}));
	};

	onlineUsersRef.on('value', handleOnlineUsersChange);
	onlineUsersRef.on('child_removed', handleUserStatusChange);
	usersRef.on('child_changed', handleUsernameChange);

	return () => {
	onlineUsersRef.off('value', handleOnlineUsersChange);
	onlineUsersRef.off('child_removed', handleUserStatusChange);
	usersRef.off('child_changed', handleUsernameChange);
	};
}, []);

return (
	<div className="card mb-2 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{ borderRadius: '5px', height: '100%' }} id="secondCard">
	<div className="card-body container-fluid">
		<div className="d-flex justify-content-between" type="button" data-mdb-toggle="collapse" data-mdb-target="#onlineUsers" aria-expanded="false" aria-controls="onlineUsers">
		<h6 className="ms-4">Online Users</h6>
		<i className="fas fa-angles-down"></i>
		</div>
		<ul className="collapse mt-3" id="onlineUsers" style={{ listStyleType: 'none' }}>
		{onlineUsers.map((userId) => (
			<a key={userId}>
			<li className="px-2 py-1 rounded threads-latest my-2" style={{ fontSize: '12px', textDecoration: 'none', color: 'black' }}>
				{/* {userMap[userId].username.toUpperCase()} */}
			</li>
			</a>
		))}
		</ul>
	</div>
	</div>
);
};

export default OnlineUsers;
