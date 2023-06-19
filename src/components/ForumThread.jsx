import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

const ForumThread = () => {

	const [threadData, setThreadData] = useState(null);
	const { slug } = useParams();
	const [user] = useAuthState(firebase.auth());

	
	useEffect(() => {
		fetchThreadBySlug(slug)
		.then((thread) => {
			if (thread) {
				setThreadData(thread);
			} else {
				console.log('Thread not found');
			}
		})
		.catch((error) => {
			console.error('Error fetching thread:', error);
		});
	}, [slug]);

	useEffect(()=>{
		const messagesRef = firebase.database().ref('messages');
		const usersRef = firebase.database().ref('users');

		messagesRef.on('child_added', handleNewMessage);
		usersRef.on('child_changed', handleNewMessage);
	},[])

	const handleNewMessage = () => {
		// const newMessage = snapshot.val();
		// console.log('New message:', newMessage);


		fetchThreadBySlug(slug)
		.then((thread) => {
			if (thread) {
				setThreadData(thread);
			} else {
				console.log('Thread not found');
			}
		})
		.catch((error) => {
			console.error('Error fetching thread:', error);
		});

		// if(threadData)
		// {
			// console.log(threadData);
		// }
	
		// Process the new message as needed
		// ...
	};


	const fetchThreadBySlug = (slug) => {
		return new Promise((resolve, reject) => {
		const threadsRef = firebase.database().ref('threads');
		const messagesRef = firebase.database().ref('messages');
		const usersRef = firebase.database().ref('users');

		threadsRef
		.orderByChild('slug')
		.equalTo(slug)
		.on('value', (snapshot) => {
			const threadData = snapshot.val();

			if (threadData) {
			const threadId = Object.keys(threadData)[0];
			const thread = { threadId, ...threadData[threadId] };

			messagesRef
				.orderByChild('threadId')
				.equalTo(threadId)
				.on('value', (messagesSnapshot) => {
				const messagesData = messagesSnapshot.val();
				const messages = [];

				if (messagesData) {
					Object.keys(messagesData).forEach((messageId) => {
					const message = { messageId, ...messagesData[messageId] };
					messages.push(message);
					});
				}

				const userIds = messages.map((message) => message.userId);
				const uniqueUserIds = [...new Set(userIds)];

				usersRef.once('value').then((usersSnapshot) => {
					const usersData = usersSnapshot.val();
					const users = {};

					uniqueUserIds.forEach((userId) => {
					users[userId] = usersData[userId];
					});

					messages.forEach((message) => {
					const userId = message.userId;
					if (users[userId]) {
						message.user = users[userId];
					}
					});

					thread.messages = messages;

					// Fetch the user data separately using threadData.userId
					usersRef
					.child(threadData[threadId].userId)
					.once('value')
					.then((userSnapshot) => {
						const userData = userSnapshot.val();

						if (userData) {
						thread.user = { userId: threadData[threadId].userId, ...userData };
						}

						resolve(thread);
					})
					.catch((error) => {
						reject(error);
					});
				});
				});
			} else {
			resolve(null);
			}
		});
	});
	};


	function sendCommentToThread(){

		let commentArea = document.getElementById('commentArea');

		let formData = {
			content: commentArea.value,
			threadId: threadData.threadId,
			userId:user.uid,
			createdAt: firebase.database.ServerValue.TIMESTAMP,
			updatedAt: firebase.database.ServerValue.TIMESTAMP,
		};
	
		// Simple validation to check if any field is empty
		if (!formData.content) {
			Swal.fire({
				icon: 'error',
				title: 'All fields are required!',
			});
			return; // Exit the function if any field is empty
		}
	
		const threadRef = firebase.database().ref('messages');
	
		threadRef
		.push(formData)
		.then(() => {
			Swal.fire({
			icon: 'success',
			title: 'Post Created successfully!',
			});
		})
		.catch((error) => {
			console.error(error);
	
			Swal.fire({
			icon: 'error',
			title: 'Something went wrong!',
			});
		})
		.finally(() => {
			commentArea.value = '';
		});
	}

	function getCommentAge(commentDate) {
		const now = new Date(); // current date and time
		const postedDate = new Date(commentDate); // convert comment date to Date object
		const timeDiff = now - postedDate; // get the time difference in milliseconds
	
		const seconds = Math.floor(timeDiff / 1000); // convert milliseconds to seconds
		const minutes = Math.floor(seconds / 60); // convert seconds to minutes
		const hours = Math.floor(minutes / 60); // convert minutes to hours
		const days = Math.floor(hours / 24); // convert hours to days
		const years = Math.floor(days / 365); // convert days to years
	
		if (seconds < 60) {
			if (seconds > 1) {
				return `${seconds} seconds ago`;
			} else {
				return `${seconds} second ago`;
			}
		} else if (minutes < 60) {
			if (minutes > 1) {
				return `${minutes} minutes ago`;
			} else {
				return `${minutes} minute ago`;
			}
		} else if (hours < 24) {
			if (hours > 1) {
				return `${hours} hours ago`;
			} else {
				return `${hours} hour ago`;
			}
		} else if (days < 365) {
			if (days > 1) {
				return `${days} days ago`;
			} else {
				return `${days} day ago`;
			}
		} else {
			if (years > 1) {
				return `${years} years ago`;
			} else {
				return `${years} year ago`;
			}
		}
	}
	

	return (
		<div className="container">
		<div className="row">
			<div className="card" style={{ borderRadius: '5px' }} id="firstCard">
			<div className="p-2 py-3 px-lg-5">
				<div className="row text-center">
				{threadData && <h2 id="threadTitle">{threadData.title}</h2>}
				</div>
	
				<div className="container summernote_container">
				<div className="row text-center">
					<div id="summernoteContent" style={{ paddingTop: '20px'}}>
					{threadData && (
                    <div dangerouslySetInnerHTML={{ __html: threadData.content }} />
					)}
					</div>
				</div>
				</div>
	
				<span className="d-flex">
				{threadData && threadData.user && (
					<>
					<img
						className="me-2"
						src={`../assets/images/userIconsV2/${threadData.user.image}.png`}
						style={{ width: '45px', height: '45px' }}
						alt={threadData.user.username}
					/>
					<p style={{ fontWeight: 'bolder', fontSize: '12px' }}>{threadData.user.username}</p>
					<div style={{ fontSize: '10px' }} className='ms-1'>{getCommentAge(threadData.createdAt)}</div>
					</>
				)}
				</span>
	
				<span className="py-3">
				<i className="fas fa-thumbs-up ms-2"></i>
				<i className="fas fa-thumbs-down ms-2"></i>
				<i className="fas fa-reply ms-2"></i>
				</span>
			</div>
			</div>
		</div>
	
		<div className="row my-3">
			<div className="card" style={{ borderRadius: '5px' }} id="firstCard">
			<div className="p-2 py-3 px-lg-5">
				<h6 type="button" data-mdb-toggle="collapse" data-mdb-target="#replies" aria-expanded="false" aria-controls="replies">
				Comments&nbsp;&nbsp;<i className="fas fa-angles-down"></i>
				</h6>
				<div id="replies" className="collapse">
				{threadData && threadData.messages && threadData.messages.map((comment) => (
					<div className="rounded my-3" key={comment.messageId}>
					<div className="d-flex">
						<div className="me-3">
						<img src={`../assets/images/userIconsV2/${comment.user.image}.png`} style={{ width: '40px' }} alt={comment.user.username} />
						</div>
						<div>
						<span className="d-flex">
							<div style={{ fontSize: '12px', fontWeight: 'bolder' }}>{comment.user.username.toUpperCase()}</div>&nbsp;&nbsp;
							<div style={{ fontSize: '10px' }}>{getCommentAge(comment.createdAt)}</div>
						</span>
						<div style={{ fontSize: '11px' }}>{comment.content}</div>
						<div className="mt-2 d-flex">
							<i className="fas fa-thumbs-up ms-2" style={{ width: '15px', height: '15px' }}></i>
							<i className="fas fa-thumbs-down ms-2" style={{ width: '15px', height: '15px' }}></i>
							<i className="fas fa-reply ms-2" style={{ width: '15px', height: '15px' }} data-mdb-toggle="collapse" href={`#repliesToThreadInput${comment.id}`} role="button" aria-expanded="false" aria-controls={`repliesToThreadInput${comment.id}`}></i>
						</div>
						<div className="collapse mt-1" id={`repliesToThreadInput${comment.messageId}`}>
							<div className="d-flex">
							<div id={`replyCommentError${comment.id}`} className="text-danger text-sm"></div>
							<input type="text" id={`replyToComment${comment.messageId}`} name={`replyToComment${comment.messageId}`} className="form-control" />
							<form className="formReplyToComment">
								<div className="btn-group ms-1 btn-dark" role="group" aria-label="Basic example">
								{/* <button type="submit" onClick={() => sendFormReplyToComment(comment.id)} className="btn btn-dark"><i className="fas fa-paper-plane"></i></button> */}
								{/* <button type="button" className="btn btn-dark" data-mdb-toggle="collapse" data-mdb-target={`#repliesToThreadInput${comment.id}`} aria-expanded="false" aria-controls={`repliesToThreadInput${comment.id}`}><i className="fas fa-xmark"></i></button> */}
								</div>
							</form>
							</div>
						</div>
						</div>
					</div>
					</div>
				))}
				</div>
			</div>
			</div>
		</div>
	
			<div className="row my-3">
				<div className="card" style={{ borderRadius: '5px' }} id="firstCard">
					<div className="p-2 py-3 px-lg-5">
						<div id="commentError" className="text-danger text-sm"></div>
						<textarea placeholder='Comment' className="form-control" id="commentArea" rows="4"></textarea>
						<button onClick={()=>sendCommentToThread()} className="btn btn-dark my-2 col-12"><i className="fas fa-paper-plane"></i></button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ForumThread