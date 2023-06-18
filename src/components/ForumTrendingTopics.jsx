import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const ForumTrendingTopics = () => {
const [trendingThreads, setTrendingThreads] = useState([]);

useEffect(() => {
	const messagesRef = firebase.database().ref('messages');

	messagesRef.on('value', (snapshot) => {
	const messagesData = snapshot.val();

	if (messagesData) {
		// Count the number of messages per thread
		const threadCounts = {};
		Object.values(messagesData).forEach((message) => {
		const threadId = message.threadId;
		threadCounts[threadId] = threadCounts[threadId] ? threadCounts[threadId] + 1 : 1;
		});

		// Sort threads based on the number of messages in descending order
		const sortedThreads = Object.keys(threadCounts).sort(
		(a, b) => threadCounts[b] - threadCounts[a]
		);

		// Get the top 5 threads
		const trendingThreadsArray = sortedThreads.slice(0, 5);

		// Fetch thread details from the "threads" reference
		const threadsRef = firebase.database().ref('threads');
		threadsRef.on('value', (snapshot) => {
		const threadsData = snapshot.val();

		if (threadsData) {
			const trendingThreadsData = trendingThreadsArray.map((threadId) => ({
			threadId,
			...threadsData[threadId],
			}));
			setTrendingThreads(trendingThreadsData);
		} else {
			setTrendingThreads([]);
		}
		});
	} else {
		setTrendingThreads([]);
	}
	});

	return () => {
	messagesRef.off('value');
	};
}, []);

return (
	<div
	className="card mb-2 px-1 animate__animated animate__fadeIn animate__delay-1s"
	style={{ borderRadius: '5px', height: '100%' }}
	id="secondCard"
	>
	<div className="card-body container-fluid">
		<div
		className="d-flex justify-content-between"
		type="button"
		data-mdb-toggle="collapse"
		data-mdb-target="#trendingTopics"
		aria-expanded="true"
		aria-controls="trendingTopics"
		>
		<h6 className="ms-4">Trending Topics</h6>
		<i className="fas fa-angles-down"></i>
		</div>
		<ul className="collapse show mt-4" id="trendingTopics">
		{trendingThreads.map((thread) => (
			<a key={thread.threadId} href={'/pokeforum/' + thread.slug}>
			<li
				className="px-2 py-1 rounded list-group-item threads-latest my-2"
				style={{ fontSize: '12px', textDecoration: 'none', color: 'black' }}
			>
				{thread.title && thread.title.toUpperCase()}
			</li>
			</a>
		))}
		</ul>
	</div>
	</div>
);
};

export default ForumTrendingTopics;
