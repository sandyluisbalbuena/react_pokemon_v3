import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { useAuthState } from 'react-firebase-hooks/auth';

let uid;


const ForumLatest = (props) => {
	const [threadGroups, setThreadGroups] = useState([]);
	const [userData, setuserData] = useState([]);
	let isAdmin = props.user.role;
	const [user, isLoading] = useAuthState(firebase.auth());
	// const [uid, setUid] = useState('');

	useEffect(() => {
		if (!isLoading && user) {
			uid=user.uid;
			console.log(uid);
			// Use the uid here or call a function that requires the uid
		}
	}, [user, isLoading]);

	// console.log(uid);



	useEffect(() => {
		fetchThreads();
		setupListeners();
	}, []);

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
	
				const threadGroups = Object.entries(threadData).reduce((groups, [threadId, thread]) => {
					const categoryId = thread.categoryId;
					const userId = thread.userId;
					const category = categoryData[categoryId];
					const user = userData[userId];
					const messages = Object.values(messageData || {}).filter((message) => message.threadId === threadId);
	
					const threadInfo = {
					id: threadId,
					title: thread?.title || '',
					slug: thread?.slug || '',
					content: thread?.content || '',
					createdAt: thread?.createdAt || '',
					updatedAt: thread?.updatedAt || '',
					category: category ? category.name : '',
					user: user ? user.username : '',
					userId: thread?.userId || '',
					userImage: user ? user.image : '',
					messageCount: messages.length || 0, // Update message count based on retrieved messages
					messages: messages || [],
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
	
				setThreadGroups(Object.values(threadGroups));
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
		setThreadGroups((prevThreadGroups) => {
		const updatedGroups = [...prevThreadGroups];
		const updatedThreads = updatedGroups.flatMap((group) => group.threads.map((thread) => ({ ...thread })));
	
		const threadIndex = updatedThreads.findIndex((thread) => thread.id === threadId);
		if (threadIndex !== -1) {
			updatedThreads[threadIndex].messageCount += 1;
		}
	
		return updatedGroups.map((group) => ({
				...group,
				threads: updatedThreads.filter((thread) => thread.category === group.category),
			}));
		});
	};

	const updateUserData = (updatedUser) => {
		// if(uid){
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

		// }
		
	};

	function deleteThread(deleteThreadId) {
		const threadRef = firebase.database().ref('threads/' + deleteThreadId);

		Swal.fire({
		title: 'Confirm Delete',
		text: 'Are you sure you want to delete this record?',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Delete',
		showLoaderOnConfirm: true,
		preConfirm: () => {
			return new Promise((resolve, reject) => {
			threadRef
				.remove()
				.then(() => resolve({ success: true, message: 'Thread deleted successfully.' }))
				.catch((error) => reject(new Error(error.message)));
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

	return (
		<div>
		{threadGroups.map((group) => (
			<div key={group.category} className="card my-4 px-1 animate__animated animate__fadeInUp" style={{ borderRadius: '5px' }} id={group.category}>
			<div className="card-body container">
				<div className="row">
				<h2>{group.category.charAt(0).toUpperCase() + group.category.slice(1)} Discussions</h2>
				<div className="list-group list-group-light" style={{ height: '400px', overflowY: 'auto' }}>
					{group.threads.map((thread) => (
					<a
						key={thread.id}
						data-slug={thread.slug}
						id={thread.id}
						href={`/pokeforum/${thread.slug}`}
						className="forumItems list-group-item list-group-item-action px-3 border-0"
					>
						<div className="row">
						<div className="col-12 col-lg-3 d-flex">
							<i className="fas fa-comments mx-3"></i>
							<p>{thread.title}</p>
						</div>
						<div className="d-none d-lg-block col-lg-2">
							{thread.messageCount > 1 && (
							<span className="badge badge-secondary pill-rounded">{thread.messageCount}&nbsp;Messages</span>
							)}
							{thread.messageCount == 1 && (
							<span className="badge badge-secondary pill-rounded">{thread.messageCount}&nbsp;Message</span>
							)}
						</div>
						<div className="d-none d-lg-block col-lg-3 d-lg-flex">
							<img width="35px" height="35px" src={`../assets/images/userIcons/${thread.userImage}.png`} alt={thread.user} />
							<p className="ms-3">{thread.user.toUpperCase()}</p>
						</div>
						<div className="d-none d-lg-block col-lg-3">
							<span className="badge badge-secondary pill-rounded">{new Date(thread.createdAt).toLocaleString()}</span>
						</div>
						<div className="d-none d-lg-block col-lg-1">
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
						</div>
					</a>
					))}
				</div>
				</div>
			</div>
			</div>
		))}
		</div>
	);
};

export default ForumLatest;
