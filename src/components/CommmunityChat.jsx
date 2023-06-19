import React from 'react'

const CommmunityChat = () => {
	return (
		<>
			<div id="communityChatModal" className='modal-community'>CommmunityChat</div>
			<div className='btn btn-community-chat-div rounded-circle bg-light' data-mdb-toggle="modal" data-mdb-target="#communityChatModal">
				<div className='btn-community-chat'></div>
			</div>
			{/* <img className='btn' type='button' width='25px' height='25px' src='../assets/images/misc/pokeball_loader.png'/> */}
		</>
		
	)
}

export default CommmunityChat