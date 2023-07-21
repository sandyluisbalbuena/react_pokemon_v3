import React, { useEffect, useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { useAuthState } from 'react-firebase-hooks/auth';

let uid;

const ThreadsPokedex = (props) => {
	const [threadGroups, setThreadGroups] = useState([]);
	const [threads, setThreads] = useState([]);
  	const categoryId = '-NY09qsAZhynFQBPXtMI'; // Replace with the actual category ID

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
	},[]);
	
	useEffect(() => {
		if (threads.length > 0) {
			setTimeout(() => {
				initializeDataTables();
			}, 100);
		}
	}, [threads]);

	const initializeDataTables = () => {
		// setTimeout(() => {

			$(document).ready(function () {

				const dataTable = new DataTable(`#tableForumLatestPokecard`, {
					columns: [
					{ data: 'id', title: 'ID' },
					{ data: 'title', title: 'Title' },
					// { data: 'messageCount', title: 'Message Count' },
					{ data: 'user', title: 'user' },
					{ data: 'userImage', title: 'userImage' },
					{ data: 'createdAt', title: 'createdAt' },
					// { data: 'action', title: 'action' },
					],
					pageLength: 5, // Limit the number of entries per page to 4
					lengthChange: false, // Remove the "Show [x] entries" dropdown
					ordering: false,
					responsive: true,
					language: {
					info: '', // Remove the footer text "Showing 1 to 4 of 4 entries"
					},
				});

				const tableData = threads.map((thread) => ({
					id: thread.id,
					title: thread.title,
					messageCount: thread.messageCount,
					user: thread.user,
					createdAt: new Date(thread.createdAt).toLocaleString(),
					// Add more properties as needed
				}));

				// const dataTable = $('#tableForumLatestPokecard').DataTable({
				// 	columns: [
				// 	{ data: 'id', title: 'ID' },
				// 	{ data: 'title', title: 'Title' },
				// 	// { data: 'messageCount', title: 'Message Count' },
				// 	{ data: 'user', title: 'user' },
				// 	{ data: 'userImage', title: 'userImage' },
				// 	{ data: 'createdAt', title: 'createdAt' },
				// 	{ data: 'action', title: 'action' },
				// 	],
				// 	pageLength: 5,
				// 	// paging: true,
				// 	// lengthChange: false,
				// 	// header: false,
				// });
			
				dataTable.clear().rows.add(tableData).draw();
			});

		// }, 100);

	};

	
	
	const fetchThreads = () => {
		try {
		const threadsRef = firebase.database().ref('threads');
		threadsRef.orderByChild('categoryId').equalTo(categoryId).on('value', async (snapshot) => {
			const fetchedThreads = [];
			const promises = [];
	
			snapshot.forEach((childSnapshot) => {
			const threadData = childSnapshot.val();
			const threadId = childSnapshot.key;
	
			// Fetch user info for each thread
			const userRef = firebase.database().ref(`users/${threadData.userId}`);
			const promise = userRef.once('value').then((userSnapshot) => {
				const userData = userSnapshot.val();
				fetchedThreads.push({
				id: threadId,
				...threadData,
				user: userData.username,
				userImage: userData.image,
				});
			});
			promises.push(promise);
			});
	
			// Wait for all user info to be fetched before updating the state
			await Promise.all(promises);
			setThreads(fetchedThreads);

		});
		} catch (error) {
		console.error('Error fetching threads:', error);
		}
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

	const updateUserData = (updatedUser) => {
		// if(uid){

			// reinitializeDataTables();

			setThreadGroups((prevThreadGroups) => {
			const updatedGroups = [...prevThreadGroups];
			const updatedThreads = updatedGroups.flatMap((group) => group.threads.map((thread) => ({ ...thread })));
		
	
	
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

	function deleteThreadLaravel(deleteThreadId) {
		// const [user1] = useAuthState(firebase.auth());

		let currentUser = firebase.auth().currentUser;
		let bearerToken = localStorage.getItem('bearerToken');
		
		Swal.fire({
		title: 'Confirm Delete',
		text: 'Are you sure you want to delete this thread?',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Delete',
		showLoaderOnConfirm: true,
		preConfirm: () => {
			return axios
			.delete(`https:pok3mon.online/api/thread/${deleteThreadId}`, {
			// .delete(`http://127.0.0.1:8000/api/thread/${deleteThreadId}`, {
				headers: {
					'X-User-Id': uid, // Include the user ID in the request headers
					'X-User-Uid': uid,
					'Authorization': `Bearer ${bearerToken}`,
				}
			})
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
		},
		allowOutsideClick: () => !Swal.isLoading(),
		})
		.then((result) => {
			if (result.isConfirmed) {
			Swal.fire({
				title: 'Record Deleted',
				text: result.message,
				icon: 'success',
			}).then(() => {
				fetchThreads();
			});
			}
		})
		.catch((error) => {
			Swal.fire('Error', error.message, 'error');
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

	function redirectToThread(slug){
		window.location.href = "/pokeforum/"+slug;
	}

	return (
		<div>
			<div
				className="card my-4 px-1 animate__animated animate__fadeInUp"
				style={{ borderRadius: '5px' }}
			>
				<div className="card-body container">
				<div className="row">
					<h2>Pokecard Discussions</h2>
		
					<table className='table table-hover table-borderless' id={`tableForumLatestPokecard`}>
					<thead style={{display:'none'}}>
						<tr>
							<th scope="col"></th>
							<th scope="col"></th>
							{/* <th scope="col"></th> */}
							<th scope="col"></th>
							<th scope="col"></th>
							<th scope="col"></th>
							{/* <th scope="col"></th> */}
						</tr>
					</thead>
					<tbody className='tableForumsLatest'>
						{threads.map((thread) => (
						<tr key={thread.id} data-slug={thread.slug} id={thread.id} href={`/pokeforum/${thread.slug}`} className="px-3 rounded" onClick={() => redirectToThread(thread.slug)}>
							<td><i className="fas fa-comments mx-3"></i></td>
							<td>{thread.title}</td>
							{/* <td>
							{thread.messageCount > 1 && (
								<span className="badge badge-secondary pill-rounded">{thread.messageCount}&nbsp;Messages</span>
							)}
							{thread.messageCount === 1 && (
								<span className="badge badge-secondary pill-rounded">{thread.messageCount}&nbsp;Message</span>
							)}
							</td> */}
							<td><img width="35px" height="35px" src={`../assets/images/userIconsV2/${thread.userImage}.png`} alt={thread.user} /></td>
							<td><p className="ms-3">{thread.user?.toUpperCase()}</p></td>
							<td><span className="badge badge-secondary pill-rounded">{new Date(thread.createdAt).toLocaleString()}</span></td>
							{/* <td>
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
							</td> */}
						</tr>
						))}
					</tbody>
					</table>
				</div>
				</div>
			</div>
		</div>
	);
};

export default ThreadsPokedex;
