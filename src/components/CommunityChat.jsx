import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { useAuthState } from 'react-firebase-hooks/auth';

const CommunityChat = () => {
	const [showModal, setShowModal] = useState(false);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');
	const [currentUserId, setCurrentUserId] = useState(null);

	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			setCurrentUserId(user.uid);
		} else {
			setCurrentUserId(null);
		}
		});

		return () => unsubscribe();
	}, []);


	const toggleModal = () => {
		setShowModal(!showModal);
	};

	// Listen for real-time updates
	useEffect(() => {
		const database = firebase.database();
		const messagesRef = database.ref('chats');
	
		const onMessageAdded = (snapshot) => {
		const newMessage = snapshot.val();
		// Get user data using the sender's userId
		// Replace 'users' with the actual location of your user data
		const userRef = database.ref('users/' + newMessage.senderId);
		userRef.once('value').then((userSnapshot) => {
			const user = userSnapshot.val();
			if (user) {
			newMessage.sender = user.username; // Replace 'name' with the actual field containing the user's name
			newMessage.avatar = user.image; // Replace 'avatar' with the actual field containing the user's avatar
			}
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		});
		};
	
		messagesRef.on('child_added', onMessageAdded);
	
		return () => {
		messagesRef.off('child_added', onMessageAdded);
		};
	}, []);
	
	// Handle message input
	const handleInputChange = (e) => {
		setNewMessage(e.target.value);
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
		sendMessage();
		}
	};

	// Send message to Realtime Database
	const sendMessage = () => {
		const database = firebase.database();
		const messagesRef = database.ref('chats');
		const newMessageRef = messagesRef.push();
		// Get the current user
		const currentUser = firebase.auth().currentUser;
		
		// Check if the user is logged in
		if (currentUser) {
			const senderId = currentUser.uid;
		
			newMessageRef.set({
			senderId: senderId,
			content: newMessage,
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			});
			
			setNewMessage('');
		} else {
			// User is not logged in, handle the case accordingly
			// For example, show an error message or redirect to login
		}
	};

	const formatTime = (timestamp) => {
		return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	function groupConsecutiveMessages(messages) {
		const groupedMessages = [];
	
		messages.forEach((message) => {
		const previousGroup = groupedMessages[groupedMessages.length - 1];
		const isConsecutiveMessage = previousGroup && previousGroup[0].senderId === message.senderId;
	
		if (isConsecutiveMessage) {
			previousGroup.push(message);
		} else {
			groupedMessages.push([message]);
		}
		});
	
		return groupedMessages;
	}
	


	return (
		<>
			{showModal && (
				<div className="chat-container modal-community">
					<div className="chat-header">Chat</div>

					<div className="chat-messages">
						{messages.reduce((groupedMessages, message, index) => {
							const previousMessage = groupedMessages[groupedMessages.length - 1];
							const isGrouped = previousMessage && previousMessage.senderId === message.senderId;

							if (isGrouped) {
							previousMessage.messages.push(message);
							} else {
							groupedMessages.push({
								senderId: message.senderId,
								messages: [message],
							});
							}

							return groupedMessages;
						}, []).map((groupedMessage) => (
							<div key={groupedMessage.messages[0].timestamp} className={`chat-message ${groupedMessage.senderId === currentUserId ? 'own-message' : ''}`}>
							{groupedMessage.senderId !== currentUserId && (
								<img className="avatar" src={`../assets/images/userIconsV2/${groupedMessage.messages[0].avatar}.png`} alt="Avatar" />
							)}
							<div className="content">
								{groupedMessage.messages.map((message) => (
								<div key={message.timestamp} className="message">{message.content}</div>
								))}
							</div>
							{groupedMessage.senderId !== currentUserId && (
								<div className="timestamp ms-1">{formatTime(groupedMessage.messages[0].timestamp)}</div>
							)}
							</div>
						))}
					</div>





					<div className="chat-input">
				
					<input type="text" placeholder="Type your message" value={newMessage} onChange={handleInputChange} onKeyPress={handleKeyPress}/>
					<button onClick={sendMessage} className='btn btn-sm'>Send</button>
					</div>
				</div>
				
			)}
			<div className='btn-community-chat-div bg-light rounded-circle btn' onClick={toggleModal}>
				<div className='btn-community-chat'></div>
			</div>
		</>
	);
};

export default CommunityChat;
