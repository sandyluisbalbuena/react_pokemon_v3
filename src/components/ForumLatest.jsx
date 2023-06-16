import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const ForumLatest = (props) => {
	const [threads, setThreads] = useState([]);

	let isAdmin = props.user.role;



	useEffect(() => {

		const fetchThreads = async () => {
			const threadRef = firebase.database().ref('threads');
			const categoryRef = firebase.database().ref('categories');
			const userRef = firebase.database().ref('users');
			const messageRef = firebase.database().ref('messages');

			try {
				const threadSnapshot = await threadRef.once('value');
				const threadData = threadSnapshot.val();

				const categorySnapshot = await categoryRef.once('value');
				const categoryData = categorySnapshot.val();

				const userSnapshot = await userRef.once('value');
				const userData = userSnapshot.val();

				const messageSnapshot = await messageRef.once('value');
				const messageData = messageSnapshot.val();

				const mappedThreads = Object.entries(threadData || {}).map(([threadId, thread]) => {
					const categoryId = thread.categoryId;
					const userId = thread.userId;
					const category = categoryData[categoryId];
					const user = userData[userId];
					const messages = Object.values(messageData || {}).filter(
						(message) => message.threadId === threadId
					);

					return {
						id: threadId,
						title: thread?.title || '',
						slug: thread?.slug || '',
						content: thread?.content || '',
						createdAt: thread?.createdAt || '',
						updatedAt: thread?.updatedAt || '',
						category: category ? category.name : '',
						user: user ? user.username : '',
						userImage: user ? user.image : '',
						messages: messages || [],
					};
				});

				setThreads(mappedThreads);
			} catch (error) {
				console.error('Error fetching threads:', error);
			}
		};

		fetchThreads();

		const threadRef = firebase.database().ref('threads');
		const categoryRef = firebase.database().ref('categories');
		const userRef = firebase.database().ref('users');

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
					slug: thread?.slug || '',
					content: thread?.content || '',
					createdAt: thread?.createdAt || '',
					updatedAt: thread?.updatedAt || '',
					category: category ? category.name : '',
					user: user ? user.username : '',
					userImage: user ? user.image : '',
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

	function deleteThread(deleteThreadId){
		console.log(deleteThreadId);

		// Swal.fire({
		// 	title: 'Confirm Delete',
		// 	text: 'Are you sure you want to delete this record?',
		// 	icon: 'warning',
		// 	showCancelButton: true,
		// 	confirmButtonText: 'Delete',
		// 	showLoaderOnConfirm: true,
		// 	preConfirm: () => {
		// 	// Make an AJAX request to delete the record
		// 	return axios.delete(`/pokeforum/delete/thread/`+deleteThreadId)
		// 		.then(response => {
		// 			if (!response.data.success) {
		// 				throw new Error(response.data.message)
		// 			}
		// 			return response.data
		// 		})
		// 		.catch(error => {
		// 			Swal.showValidationMessage(
		// 				`Request failed: ${error}`
		// 			)
		// 		})
		// 	},
		// 	allowOutsideClick: () => !Swal.isLoading()
		// }).then((result) => {
		// 	if (result.isConfirmed) {
		// 	Swal.fire({
		// 		title: 'Record Deleted',
		// 		text: result.message,
		// 		icon: 'success'
		// 	}).then(() => {
		// 		getForumLatest();
		// 	});
		// 	}
		// });
	
		return false;
	}

	// console.log(threads);

	return (
		<div>
		{threads.map((thread) => (
			<div key={thread.category} className="card my-4 px-1 animate__animated animate__fadeInUp" style={{borderRadius: '5px'}} id={thread.category}>
				<div className="card-body container">
					<div className="row">
						<h2>{thread.category.charAt(0).toUpperCase() + thread.category.slice(1)} Discussions</h2>
						<div className="list-group list-group-light" style={{height:'400px', overflowY:'auto'}}>


							{/* <a data-slug={thread.slug} href={`/pokeforum/${thread.slug}`} className="forumItems list-group-item list-group-item-action px-3 border-0">
							<div className="row">
								<div className="col-2">
								<img src={thread.userImage} alt={thread.user} />
								</div>
								<div className="col-10">
								<h4>{thread.title}</h4>
								<p>Created By: {thread.user}</p>
								<p>Created At: {thread.createdAt}</p>
								<p>Updated At: {thread.updatedAt}</p>
								</div>
							</div>
							{thread.messages && thread.messages.length > 0 && (
								<div>
								<h4>Replies:</h4>
								{thread.messages.map((message) => (
									<div key={message.id}>
										<p>Content: {message.content}</p>
										<p>Created At: {message.createdAt}</p>
										<p>Updated At: {message.updatedAt}</p>
										<p>User ID: {message.userId}</p>
									</div>
								))}
								</div>
							)}
							</a> */}


							<a data-slug={thread.slug} id={thread.id} href={`/pokeforum/${thread.slug}`} className="forumItems list-group-item list-group-item-action px-3 border-0">
								<div className="row">
									<div className="col-12 col-lg-3 d-flex">
										<i className="fas fa-comments mx-3"></i>
										<p>{thread.title}</p>
									</div>
									<div className="d-none d-lg-block col-lg-2">
										{thread.messages && thread.messages.length > 1 && (
										<span className="badge badge-secondary pill-rounded">{thread.messages.length}&nbsp;Messages</span>
										)}
										{thread.messages && thread.messages.length > 0 && (
										<span className="badge badge-secondary pill-rounded">{thread.messages.length}&nbsp;Message</span>
										)}
									</div>
									<div className="d-none d-lg-block col-lg-3 d-lg-flex">
										<img width="35px" height="35px" src={`../assets/images/userIcons/${thread.userImage}.png`}/>
										<p className="ms-3">{thread.user.toUpperCase()}</p>
									</div>
									<div className="d-none d-lg-block col-lg-3">
										<span className="badge badge-secondary pill-rounded">{new Date(thread.createdAt).toLocaleString()}</span>
									</div>
									<div className="d-none d-lg-block col-lg-1">
										{isAdmin && isAdmin == "admin" && (
											<span onClick={() => deleteThread('wew')} className="badge badge-sm badge-danger"><i className="fas fa-trash"></i></span>
										)}
									</div>
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		))}
		</div>
	);
};

export default ForumLatest;
