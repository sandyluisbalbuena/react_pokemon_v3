import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { useParams } from 'react-router-dom';

const ForumThread = () => {

	const [threadData, setThreadData] = useState(null);
	const { slug } = useParams();
	
	useEffect(() => {
		fetchThreadBySlug(slug)
		.then((thread) => {
			if (thread) {
			// Thread found, update the state with the thread data
			setThreadData(thread);
			} else {
			// No thread found with the given slug
			console.log('Thread not found');
			}
		})
		.catch((error) => {
			console.error('Error fetching thread:', error);
		});
	}, [slug]);

	console.log(threadData);

	const fetchThreadBySlug = (slug) => {
		return new Promise((resolve, reject) => {
		const threadsRef = firebase.database().ref('threads');
		const messagesRef = firebase.database().ref('messages');
		const usersRef = firebase.database().ref('users');
	
		threadsRef
			.orderByChild('slug')
			.equalTo(slug)
			.once('value')
			.then((snapshot) => {
			const threadData = snapshot.val();
	
			if (threadData) {
				const threadId = Object.keys(threadData)[0];
				const thread = { threadId, ...threadData[threadId] };
	
				messagesRef
				.orderByChild('threadId')
				.equalTo(threadId)
				.once('value')
				.then((messagesSnapshot) => {
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
	
					usersRef
					.once('value')
					.then((usersSnapshot) => {
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
					})
					.catch((error) => {
						reject(error);
					});
				})
				.catch((error) => {
					reject(error);
				});
			} else {
				resolve(null);
			}
			})
			.catch((error) => {
			reject(error);
			});
		});
	};


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
					<div id="summernoteContent" style={{ paddingTop: '20px' }}>
					{threadData && threadData.content}
					</div>
				</div>
				</div>
	
				<span className="d-flex">
				{threadData && threadData.user && (
					<>
					<img
						className="me-2"
						src={`../assets/images/userIcons/${threadData.user.image}.png`}
						style={{ width: '25px', height: '25px' }}
						alt={threadData.user.username}
					/>
					<p style={{ fontWeight: 'bolder', fontSize: '12px' }}>{threadData.user.username}</p>
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
						<img src={`../assets/images/userIcons/${comment.user.image}.png`} style={{ width: '25px' }} alt={comment.user.username} />
						</div>
						<div>
						<span className="d-flex">
							<div style={{ fontSize: '12px', fontWeight: 'bolder' }}>{comment.user.username.toUpperCase()}</div>&nbsp;&nbsp;
							<div style={{ fontSize: '10px' }}>{/* {getCommentAge(comment.created_at)} */}</div>
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
				<form id="commentForm">
				<div id="commentError" className="text-danger text-sm"></div>
				<div className="form-outline">
					<textarea className="form-control" id="commentArea" rows="4"></textarea>
					<label className="form-label" htmlFor="commentArea">Comment</label>
				</div>
				<button type="submit" className="btn btn-dark my-2 col-12"><i className="fas fa-paper-plane"></i></button>
				</form>
			</div>
			</div>
		</div>
		</div>
	);
}

export default ForumThread