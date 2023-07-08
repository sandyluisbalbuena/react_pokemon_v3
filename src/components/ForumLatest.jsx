import React, { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { useAuthState } from 'react-firebase-hooks/auth';

let uid;

const ForumLatest = (props) => {
	const [threadGroups, setThreadGroups] = useState([]);
	// const [userData, setuserData] = useState([]);
	let isAdmin = props.user.role;
	let dashboard = props.dashboard;
	const [user, isLoading] = useAuthState(firebase.auth());
	const dataTableRefs = useRef([]);

	useEffect(() => {
		if (!isLoading && user) {
			uid=user.uid;
		}
	}, [user, isLoading]);

	useEffect(() => {
		fetchThreads();
		setupListeners();
	}, []);

	useEffect(() => {
		if (dataTableRefs.current.length === 0) {
			tableInit();
		}
	}, [threadGroups]);

	function tableInit(){
		threadGroups.forEach((group, index) => {
			const tableId = `tableForumLatest${group.category}`;
			const table = new DataTable(`#${tableId}`, {
				pageLength: 4, // Limit the number of entries per page to 4
				lengthChange: false, // Remove the "Show [x] entries" dropdown
				ordering: false,
				language: {
				info: '', // Remove the footer text "Showing 1 to 4 of 4 entries"
				},
			});
		
			// Store the DataTable instance reference
			dataTableRefs.current[index] = table;
		});
	}

	const setupListeners = () => {
		const messageRef = firebase.database().ref('messages');
		const userRef = firebase.database().ref('users');
	
		const messageListener = messageRef.on('child_added', (snapshot) => {
		const newMessage = snapshot.val();
		updateMessageCount(newMessage.threadId);
		});
	
		const userListener = userRef.on('child_changed', (snapshot) => {
		const updatedUser = snapshot.val();
		updateUserData(updatedUser);
		});
	
		return () => {
		messageRef.off('child_added', messageListener);
		userRef.off('child_changed', userListener);
		};
	};

	const fetchThreads = () => {

		const threadRef = firebase.database().ref('threads');
		const categoryRef = firebase.database().ref('categories');
		const userRef = firebase.database().ref('users');
		const messageRef = firebase.database().ref('messages');
	
		const threadListener = threadRef.on('value', (snapshot) => {
		const threadData = snapshot.val();
	
		if (threadData) {
			categoryRef.once('value', (categorySnapshot) => {
			const categoryData = categorySnapshot.val();
	
			userRef.once('value', (userSnapshot) => {
				const userData = userSnapshot.val();
	
				messageRef.once('value', (messageSnapshot) => {
				const messageData = messageSnapshot.val();
	
				const threadGroups = Object.entries(threadData)
					.reduce((groups, [threadId, thread]) => {
					const categoryId = thread.categoryId;
					const userId = thread.userId;
					const category = categoryData[categoryId];
					const user = userData[userId];
					const messages = Object.values(messageData || {}).filter(
						(message) => message.threadId === threadId
					);
	
					const threadInfo = {
						id: threadId,
						title: thread?.title || '',
						hide: thread?.hide || '',
						slug: thread?.slug || '',
						content: thread?.content || '',
						createdAt: thread?.createdAt || '',
						updatedAt: thread?.updatedAt || '',
						category: category ? category.name : '',
						user: user ? user.username : '',
						userId: thread?.userId || '',
						userImage: user ? user.image : '',
						messageCount: messages.length || 0, // Update message count based on retrieved messages
						messages: messages || '',
					};
	
					if (!groups[categoryId]) {
						groups[categoryId] = {
						category: category ? category.name : '',
						threads: [threadInfo],
						};
					} else {
						groups[categoryId].threads.push(threadInfo);
					}
	
					return groups;
					}, {});
	
				// Sort threads within each category by the latest createdAt date
				const sortedThreadGroups = Object.values(threadGroups).map((group) => {
					group.threads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
					return group;
				});
	
				setThreadGroups(sortedThreadGroups);
				});
			});
			});
		}
		});
	
		return () => {
		threadRef.off('value', threadListener);
		};
	};

	const updateMessageCount = (threadId) => {

		// reinitializeDataTables();

		setThreadGroups((prevThreadGroups) => {
		const updatedGroups = [...prevThreadGroups];
		const updatedThreads = updatedGroups.flatMap((group) => group.threads.map((thread) => ({ ...thread })));
	
		const threadIndex = updatedThreads.findIndex((thread) => thread.id === threadId);
		if (threadIndex !== -1) {
			updatedThreads[threadIndex].messageCount += 1;
		}

		// threadGroups.forEach((group) => {
		// const tableId = `tableForumLatest${group.category}`;
		// const table = new DataTable(`#${tableId}`,{
		// 		pageLength: 4,
		// 		lengthChange: false,
		// 	});
		// });
	
		return updatedGroups.map((group) => ({
				...group,
				threads: updatedThreads.filter((thread) => thread.category === group.category),
			}));
		});
	};

	// const updateMessageCount = (threadId) => {
	// 	setThreadGroups((prevThreadGroups) => {
	// 	const updatedGroups = prevThreadGroups.map((group) => ({
	// 		...group,
	// 		threads: group.threads.map((thread) => {
	// 		if (thread.id === threadId) {
	// 			return {
	// 			...thread,
	// 			messageCount: thread.messageCount + 1,
	// 			};
	// 		}
	// 		return thread;
	// 		}),
	// 	}));
	
	// 	return updatedGroups;
	// 	});
	
	// };

	const updateUserData = (updatedUser) => {
		// if(uid){

			// reinitializeDataTables();

			setThreadGroups((prevThreadGroups) => {
			const updatedGroups = [...prevThreadGroups];
			const updatedThreads = updatedGroups.flatMap((group) => group.threads.map((thread) => ({ ...thread })));
		
				// console.log(user?.uid)
	
				console.log(updatedThreads,uid);
	
			// if(uid){
				updatedThreads.forEach((thread) => {
					if (uid === thread.userId) {
		
						thread.userImage = updatedUser.image;
						thread.user = updatedUser.username;
					}
				});
			// }
			
		
			return updatedGroups.map((group) => ({
				...group,
					threads: updatedThreads.filter((thread) => thread.category === group.category),
				}));
			});

			// dataTableRefs.current.forEach((dataTable) => {
			// 	dataTable.draw();
			// });

		// }
		
	};

	function deleteThread(deleteThreadId) {

		// reinitializeDataTables();

		const threadRef = firebase.database().ref('threads/' + deleteThreadId);
		const messagesRef = firebase.database().ref('messages');
	
		Swal.fire({
		title: 'Confirm Delete',
		text: 'Are you sure you want to delete this thread?',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Delete',
		showLoaderOnConfirm: true,
		preConfirm: () => {
			return new Promise((resolve, reject) => {
			threadRef
				.remove()
				.then(() => {
				// Delete related messages
				messagesRef
					.orderByChild('threadId')
					.equalTo(deleteThreadId)
					.once('value')
					.then((snapshot) => {
					const promises = [];
	
					snapshot.forEach((childSnapshot) => {
						const messageId = childSnapshot.key;
						promises.push(messagesRef.child(messageId).remove());
					});
	
					return Promise.all(promises);
					})
					.then(() => {
					resolve({ success: true, message: 'Thread and related messages deleted successfully.' });
					})
					.catch((error) => {
					reject(new Error(error.message));
					});
				})
				.catch((error) => {
				reject(new Error(error.message));
				});
			});
		},
		allowOutsideClick: () => !Swal.isLoading(),
		}).then((result) => {
		if (result.isConfirmed) {
			Swal.fire({
			title: 'Record Deleted',
			text: result.message,
			icon: 'success',
			}).then(() => {
				fetchThreads();
			});
		}
		});


	
		return false;
	}

	function hideThread(hideThreadId) {
		const threadRef = firebase.database().ref('threads/' + hideThreadId);
	
		Swal.fire({
		title: 'Confirm Hide',
		text: 'Are you sure you want to hide this thread?',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Hide',
		showLoaderOnConfirm: true,
		preConfirm: () => {
			return new Promise((resolve, reject) => {
			threadRef
				.update({ hide: 1 }) // Update hide property to 1
				.then(() => {
				resolve({ success: true, message: 'Thread hidden successfully.' });
				})
				.catch((error) => {
				reject(new Error(error.message));
				});
			});
		},
		allowOutsideClick: () => !Swal.isLoading(),
		}).then((result) => {
		if (result.isConfirmed) {
			Swal.fire({
			title: 'Thread Hidden',
			text: result.message,
			icon: 'success',
			}).then(() => {
			fetchThreads();
			});
		}
		});
	
		return false;
	}

	function unhideThread(hideThreadId) {
		const threadRef = firebase.database().ref('threads/' + hideThreadId);
	
		Swal.fire({
		title: 'Confirm Show',
		text: 'Are you sure you want to Show this thread?',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Show',
		showLoaderOnConfirm: true,
		preConfirm: () => {
			return new Promise((resolve, reject) => {
			threadRef
				.update({ hide: 0 }) // Update hide property to 1
				.then(() => {
				resolve({ success: true, message: 'Thread shown successfully.' });
				})
				.catch((error) => {
				reject(new Error(error.message));
				});
			});
		},
		allowOutsideClick: () => !Swal.isLoading(),
		}).then((result) => {
		if (result.isConfirmed) {
			Swal.fire({
			title: 'Thread shown',
			text: result.message,
			icon: 'success',
			}).then(() => {
			fetchThreads();
			});
		}
		});
	
		return false;
	}
	

	const reinitializeDataTables = () => {
		// Destroy and reinitialize each DataTable instance
		dataTableRefs.current.forEach((dataTable) => {
		dataTable.destroy();
		});
	
		// // Initialize DataTables again
		// threadGroups.forEach((group, index) => {
		// const tableId = `tableForumLatest${group.category}`;
		// const table = new DataTable(`#${tableId}`, {
		// 	pageLength: 4,
		// 	lengthChange: false,
		// 	language: {
		// 	info: '',
		// 	},
		// });
	
		// dataTableRefs.current[index] = table;
		// });
	};

	return (
		<div>
		{threadGroups.map((group) => (
			<div key={group.category} className="card my-4 px-1 animate__animated animate__fadeInUp" style={{ borderRadius: '5px' }} id={group.category}>
				<div className="card-body container">
					<div className="row">
						<h2>{group.category.charAt(0).toUpperCase() + group.category.slice(1)} Discussions</h2>
						<div className="list-group list-group-light" style={{ height: '400px', overflowY: 'auto' }}>
							{group.threads.map((thread) => (

								((dashboard !== 0 && (!thread.hide || thread.hide === '' || thread.hide === '0')) || dashboard === 1) && (
									<a key={thread.id} data-slug={thread.slug} id={thread.id} href={`/pokeforum/${thread.slug}`} className="forumItems list-group-item list-group-item-action px-3 border-0">
									<div className="row">
										<div className="col-10 col-lg-3 d-flex">
											<i className="fas fa-comments mx-3"></i>
											<p>{thread.title}</p>
										</div>
										{!dashboard && (
										<div className="d-none d-lg-block col-lg-2">
											{thread.messageCount > 1 && (
											<span className="badge badge-secondary pill-rounded">{thread.messageCount}&nbsp;Messages</span>
											)}
											{thread.messageCount == 1 && (
											<span className="badge badge-secondary pill-rounded">{thread.messageCount}&nbsp;Message</span>
											)}
										</div>
										)}
										<div className="d-none d-lg-block col-lg-3 d-lg-flex">
											{!dashboard && (
											<img width="35px" height="35px" src={`../assets/images/userIconsV2/${thread.userImage}.png`} alt={thread.user} />
											)}
											<p className="ms-3">{thread.user.toUpperCase()}</p>
										</div>
										<div className="d-none d-lg-block col-lg-3">
											<span className="badge badge-secondary pill-rounded">{new Date(thread.createdAt).toLocaleString()}</span>
										</div>
										
										{dashboard ? (
										<div className="col-2">
											<span
												onClick={(event) => {
												event.preventDefault();
												deleteThread(thread.id);
												}}
												className="badge badge-sm badge-danger"
											>
												<i className="fas fa-trash"></i>
											</span>

											{thread.hide === 1 ? (
											<span
												onClick={(event) => {
												event.preventDefault();
												unhideThread(thread.id);
												}}
												className="badge badge-sm badge-success ms-1"
											>
												<i className="fas fa-eye"></i>
											</span>
											):(
												<span
												onClick={(event) => {
												event.preventDefault();
												hideThread(thread.id);
												}}
												className="badge badge-sm badge-success ms-1"
												>
													<i className="fas fa-eye-slash"></i>
												</span>
											)}

										</div>
										):(
											<div className="col-1">
												{isAdmin && isAdmin === 'admin' && (
												<span
													onClick={(event) => {
													event.preventDefault();
													deleteThread(thread.id);
													}}
													className="badge badge-sm badge-danger"
												>
													<i className="fas fa-trash"></i>
												</span>
												)}
											</div>
										)}
									</div>
									</a>
								)
							))}
						</div>

						{/* <table className='table table-hover table-borderless' id={`tableForumLatest${group.category}`}>
							<thead>
								<tr>
									<th scope="col"></th>
									<th scope="col"></th>
									<th scope="col"></th>
									<th scope="col"></th>
									<th scope="col"></th>
									<th scope="col"></th>
									<th scope="col"></th>
								</tr>
							</thead>
							<tbody className='tableForumsLatest'>
							{group.threads.map((thread) => (
									<tr key={thread.id} data-slug={thread.slug} id={thread.id} href={`/pokeforum/${thread.slug}`} className="px-3 rounded">
									<td><i className="fas fa-comments mx-3"></i></td>
									<td>{thread.title}</td>
									<td>
										{thread.messageCount > 1 && (
										<span className="badge badge-secondary pill-rounded">{thread.messageCount}&nbsp;Messages</span>
										)}
										{thread.messageCount == 1 && (
										<span className="badge badge-secondary pill-rounded">{thread.messageCount}&nbsp;Message</span>
										)}
									</td>
									<td><img width="35px" height="35px" src={`../assets/images/userIconsV2/${thread.userImage}.png`} alt={thread.user} /></td>
									<td><p className="ms-3">{thread.user.toUpperCase()}</p></td>
									<td><span className="badge badge-secondary pill-rounded">{new Date(thread.createdAt).toLocaleString()}</span></td>
									<td>
									{isAdmin && isAdmin === 'admin' && (
										<span
										onClick={(event) => {
										event.preventDefault();
										deleteThread(thread.id);
										}}
										className="badge badge-sm badge-danger"
									>
										<i className="fas fa-trash"></i>
										</span>
									)}
									</td>
								</tr>

								
							))}
							</tbody>
						</table> */}

					</div>
				</div>
			</div>
		))}
		{/* <button onClick={() => updateMessageCount(threadId)}>Update Thread Count</button> */}
		</div>
	);
};

export default ForumLatest;
