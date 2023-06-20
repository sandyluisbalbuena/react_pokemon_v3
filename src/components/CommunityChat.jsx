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

	// useEffect(() => {
	// 	// Play sound notification when a new message is received
	// 	if (messages.length > 0) {
	// 	const lastMessage = messages[messages.length - 1];
	// 	if (lastMessage.senderId !== currentUserId) {
	// 		const notificationSound = new Audio('./assets/notif/sound/dramatic_boom_effect.mp3');
	// 		notificationSound.play();
	// 	}
	// 	}
	// }, [messages, currentUserId]);

	const playNotificationSound = () => {
		// const notificationSound = new Audio('./assets/notif/sound/dramatic_boom_effect.mp3');
		const notificationSound = new Audio('./assets/notif/sound/notification.mp3');
		notificationSound.play();
	};
	
	useEffect(() => {
		// Play sound notification when a new message is received
		if (messages.length > 0) {
		const lastMessage = messages[messages.length - 1];
		if (lastMessage.senderId !== currentUserId) {
			playNotificationSound();
		}
		}
	}, [messages, currentUserId]);


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
		userRef.on('value', (userSnapshot) => {
			const user = userSnapshot.val();
			if (user) {
			newMessage.sender = user.username; // Replace 'username' with the actual field containing the user's username
			newMessage.avatar = user.image; // Replace 'image' with the actual field containing the user's image
			}
			setMessages((prevMessages) => {
			// Check if the message already exists in the array
			const existingMessage = prevMessages.find(
				(message) => message.timestamp === newMessage.timestamp
			);
			if (existingMessage) {
				// If the message exists, update it with the new data
				return prevMessages.map((message) =>
				message.timestamp === newMessage.timestamp ? newMessage : message
				);
			} else {
				// If the message doesn't exist, add it to the array
				return [...prevMessages, newMessage];
			}
			});
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

	const preprocessMessages = (messages) => {
		const processedMessages = [];
		let currentGroup = [];
	
		// Sort messages by timestamp in ascending order
		const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
	
		sortedMessages.forEach((message, index) => {
		const previousMessage = sortedMessages[index - 1];
	
		if (previousMessage && previousMessage.senderId === message.senderId) {
			currentGroup.push(message);
		} else {
			if (currentGroup.length > 0) {
			processedMessages.push({ senderId: currentGroup[0].senderId, messages: currentGroup });
			currentGroup = [];
			}
			currentGroup.push(message);
		}
	
		if (index === sortedMessages.length - 1) {
			processedMessages.push({ senderId: currentGroup[0].senderId, messages: currentGroup });
		}
		});

	console.log(processedMessages);

	
		return processedMessages;
	};
	

	return (
		<>
			{showModal && (
				<div className="chat-container modal-community">
					<div className="chat-header">Chat</div>

					<div className="chat-messages">
						{preprocessMessages(messages).map((groupedMessage) => (
							<div key={groupedMessage.messages[0].timestamp} className={`chat-message ${groupedMessage.senderId === currentUserId ? 'own-message' : ''}`}>
							{groupedMessage.senderId !== currentUserId && (
								<div className="sender-info">
								<img className="avatar" src={`../assets/images/userIconsV2/${groupedMessage.messages[0].avatar}.png`} alt="Avatar" />
								</div>
							)}
							<div className="content">
								{groupedMessage.messages.map((message, index) => (
								<React.Fragment key={message.timestamp}>
									{groupedMessage.senderId !== currentUserId && index === 0 && (
									<span className="sender">{message.sender}</span>
									)}
									<div className="message">{message.content}</div>
								</React.Fragment>
								))}
								{groupedMessage.senderId !== currentUserId && (
								<div className="timestamp ms-1">{formatTime(groupedMessage.messages[groupedMessage.messages.length - 1].timestamp)}</div>
								)}
							</div>
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
