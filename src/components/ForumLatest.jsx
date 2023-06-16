import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const ForumLatest = () => {
	const [threads, setThreads] = useState([]);

	useEffect(() => {
		const fetchThreads = async () => {
			const threadRef = firebase.database().ref('threads');
			const categoryRef = firebase.database().ref('categories');
			const userRef = firebase.database().ref('users');

			try {
				const threadSnapshot = await threadRef.once('value');
				const threadData = threadSnapshot.val();

				const categorySnapshot = await categoryRef.once('value');
				const categoryData = categorySnapshot.val();

				const userSnapshot = await userRef.once('value');
				const userData = userSnapshot.val();

				const mappedThreads = Object.entries(threadData || {}).map(([threadId, thread]) => {
					const categoryId = thread.categoryId;
					const userId = thread.userId;
					const category = categoryData[categoryId];
					const user = userData[userId];

					console.log(categoryId);

					return {
						id: threadId,
						title: thread?.title || '',
						content: thread?.content || '',
						createdAt: thread?.createdAt || '',
						updatedAt: thread?.updatedAt || '',
						category: category ? category.name : '',
						user: user ? user.username : '',
					};
				
				});

				setThreads(mappedThreads);
			} catch (error) {
				console.error('Error fetching threads:', error);
			}
		};

		fetchThreads();

		const threadRef = firebase.database().ref('threads');
		const categoryRef = firebase.database().ref('categories'); // Move categoryRef here
		const userRef = firebase.database().ref('users'); // Move userRef here

		const threadListener = threadRef.on('value', (snapshot) => {
			const threadData = snapshot.val();

			if (threadData) {
				categoryRef.once('value', (categorySnapshot) => {
					const categoryData = categorySnapshot.val();

					userRef.once('value', (userSnapshot) => {
						const userData = userSnapshot.val();

						const mappedThreads = Object.entries(threadData).map(([threadId, thread]) => {
							const categoryId = thread.categoryId;
							const userId = thread.userId;
							const category = categoryData[categoryId];
							const user = userData[userId];

							return {
								id: threadId,
								title: thread?.title || '',
								content: thread?.content || '',
								createdAt: thread?.createdAt || '',
								updatedAt: thread?.updatedAt || '',
								category: category ? category.name : '',
								user: user ? user.username : '',
							};
						});

						setThreads(mappedThreads);
					});
				});
			}
		});

		return () => {
			threadRef.off('value', threadListener);
		};

	}, []);

	console.log(threads);

	return (
		<div>
		<h2>Thread List</h2>
		<ul>
			{threads.length > 0 ? (
			threads.map((thread) => (
				<li key={thread.id}>
				<h3>{thread.title}</h3>
				<p>Category: {thread.category}</p>
				<p>User: {thread.user}</p>
				<p>Content: {thread.content}</p>
				</li>
			))
			) : (
			<li>No threads available.</li>
			)}
		</ul>
		</div>
	);
};

export default ForumLatest;
