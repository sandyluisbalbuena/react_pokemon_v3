import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const CommunityChat = () => {
	const [showModal, setShowModal] = useState(false);
	const [isUnMuted, setisUnMuted] = useState(true);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');
	const [currentUserId, setCurrentUserId] = useState(null);
	const [isTyping, setIsTyping] = useState(false);
	const [typingUser, setTypingUser] = useState('');
	const [typingUserImage, setTypingUserImage] = useState('');
	const [typingUserId, setTypingUserId] = useState('');
	const chatContainerRef = useRef(null);
	let typingTimer;


	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			setCurrentUserId(user.uid);
			// setCurrentUser(user);
		} else {
			setCurrentUserId(null);
		}
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		const typingStatusRef = firebase.database().ref('typingStatus');
	
		typingStatusRef.on('value', (snapshot) => {
		const { isTyping, user, image, id } = snapshot.val() || {};
		setIsTyping(isTyping);
		setTypingUser(user);
		setTypingUserImage(image);
		setTypingUserId(id);
		});

		setTimeout(() => {
		scrollToBottom();
		}, 0);
	
		return () => {
		typingStatusRef.off('value');
		};
	}, []);

	useEffect(() => {
		const typingStatusRef = firebase.database().ref('typingStatus');
	
		// Attach the child added event listener
		const handleChildAdded = (snapshot) => {
		const typingStatus = snapshot.val();
		// Handle the newly added child (typing status)
			setTimeout(() => {
			scrollToBottom();
			}, 0);
		};
	
		typingStatusRef.on('child_added', handleChildAdded);
	
		// Clean up the listener when the component unmounts
		return () => {
		typingStatusRef.off('child_added', handleChildAdded);
		};
	}, []);

	useEffect(() => {
		if (messages.length > 0) {
		const lastMessage = messages[messages.length - 1];
		if (lastMessage.senderId !== currentUserId) {
			playNotificationSound();
		}
		}
	}, [messages, currentUserId]);

	const formatMessageContent = (content) => {
		const urlRegex = /(https?:\/\/[^\s]+)/g;
		return content.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`);
	};
	
	const startTyping = () => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				const typingStatusRef = firebase.database().ref('typingStatus');
				const userInfo = firebase.database().ref(`users/${user.uid}`);
				userInfo.on('value', (snapshot) => {
					const userData = snapshot.val();


					if (userData) {
						typingStatusRef.set({
						isTyping: true,
						user: userData.username, 
						image: userData.image, 
						id: user.uid, 
						});
		
						clearTimeout(typingTimer);
						typingTimer = setTimeout(stopTyping, 4000); 
					}
				});

			
			}
		});
	};
	
	const stopTyping = () => {
		const typingStatusRef = firebase.database().ref('typingStatus');
		typingStatusRef.set(null);
	};

	const playNotificationSound = () => {
		const notificationSound = new Audio('../assets/notif/sound/notification.mp3');
		if(isUnMuted){
			notificationSound.play();
		}
	};

	const toggleModal = () => {
		setShowModal(!showModal);
		setTimeout(() => {
		scrollToBottom();
		}, 0);
	};

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

	function muteChat(){
		console.log('mute');
		setisUnMuted(false);
		const Toast = Swal.mixin({
			toast: true,
			position: 'top-end',
			showConfirmButton: false,
			timer: 1000,
			timerProgressBar: true,
			didOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer)
			toast.addEventListener('mouseleave', Swal.resumeTimer)
			}
		})
		
		Toast.fire({
			icon: 'info',
			title: 'Chat muted!'
		})
	}

	function unmuteChat(){
		console.log('unmute');
		setisUnMuted(true);

		const Toast = Swal.mixin({
			toast: true,
			position: 'top-end',
			showConfirmButton: false,
			timer: 1000,
			timerProgressBar: true,
			didOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer)
			toast.addEventListener('mouseleave', Swal.resumeTimer)
			}
		})
		
		Toast.fire({
			icon: 'info',
			title: 'Chat unmuted!'
		})
	}
	
	const handleInputChange = (e) => {
		setNewMessage(e.target.value);
		startTyping();
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
		sendMessage();
		}
	};

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


	
		return processedMessages;
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	function scrollToBottom() {

		const chatContainer = chatContainerRef.current;

		if (chatContainer) {
		const scrollTimeout = setTimeout(() => {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}, 0);


		return () => clearTimeout(scrollTimeout);
		}
	}

	return (
		<>
		{showModal && (
			<div className="chat-container modal-community">
			<div className="chat-header" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
				<h6>
					Chat
				</h6>
				{isUnMuted &&(<div className='btn text-white' onClick={() => muteChat()}><i className="fas fa-bell-slash"></i></div>)}
				{!isUnMuted &&(<div className='btn text-white' onClick={() => unmuteChat()}><i className="fas fa-bell"></i></div>)}
			</div>
	
			<div className="chat-messages" ref={chatContainerRef} style={{ overflowY: 'auto' }}>
				{preprocessMessages(messages).map((groupedMessage) => (
				<div
					key={groupedMessage.messages[0].timestamp}
					className={`chat-message ${groupedMessage.senderId === currentUserId ? 'own-message' : ''}`}
				>
					{groupedMessage.senderId !== currentUserId && (
					<div className="sender-info">
						<img
						className="avatar"
						src={`../assets/images/userIconsV2/${groupedMessage.messages[0].avatar}.png`}
						alt="Avatar"
						/>
					</div>
					)}
					<div className="content">
					{groupedMessage.messages.map((message, index) => (
						<React.Fragment key={message.timestamp}>
						{groupedMessage.senderId !== currentUserId && index === 0 && (
							<span className="sender">{message.sender}</span>
						)}
						<div className="message" dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }} ></div>
						</React.Fragment>
					))}
					{groupedMessage.senderId !== currentUserId && (
						<div className="timestamp ms-1">
						{formatTime(groupedMessage.messages[groupedMessage.messages.length - 1].timestamp)}
						</div>
					)}
					</div>
				</div>
				))}
				{isTyping && typingUserId !== currentUserId &&
					<div className='chat-message'>	
						<div className="sender-info">
							<img
							className="avatar"
							src={`../assets/images/userIconsV2/${typingUserImage}.png`}
							alt="Avatar"
							/>
						</div>
						<div className="content">
							<React.Fragment>
								<span className="sender">{typingUser}</span>
							<div className="message">...</div>
							</React.Fragment>
						</div>
					</div>
				}
			</div>
	
			<div className="chat-input">
				<input type="text" placeholder="Type your message" value={newMessage} onChange={handleInputChange} onKeyPress={handleKeyPress} />
				<button onClick={sendMessage} className="btn btn-sm">
				Send
				</button>
			</div>
			</div>
		)}
		<div className="btn-community-chat-div bg-light rounded-circle btn" onClick={toggleModal}>
			<div className="btn-community-chat"></div>
		</div>
		</>
	);
	};

export default CommunityChat;
