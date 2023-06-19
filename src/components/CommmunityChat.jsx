import React, { useState } from 'react';
import { Widget } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

const CommmunityChat = () => {
	// const [showModal, setShowModal] = useState(false);

	// const toggleModal = () => {
	// 	setShowModal(!showModal);
	// };
	const handleNewUserMessage = (newMessage) => {
		console.log(`New message incoming! ${newMessage}`);
		// Now send the message throught the backend API
	};

	return (
		<>
		{/* {showModal && (
			<div id="communityChatModal" className='modal-community'>

			
			</div>
		)}
		<div className='btn btn-community-chat-div rounded-circle bg-light' onClick={toggleModal}>
			<div className='btn-community-chat'></div>
		</div> */}


		<div className="App">
		<Widget
			handleNewUserMessage={handleNewUserMessage}
		/>
		</div>
		</>
	);
};

export default CommmunityChat;
