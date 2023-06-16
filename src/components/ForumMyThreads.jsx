import React from 'react'

const ForumMyThreads = () => {
	return (
		<div className="card my-1 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{borderRadius: '5px', height: '100%'}} id="secondCard">
			<div className="card-body container-fluid">
				<div className="d-flex justify-content-between" type="button" data-mdb-toggle="collapse" data-mdb-target="#myThreads" aria-expanded="false" aria-controls="myThreads">
					<h6 className="ms-4">
						My threads
					</h6>
					<i className="fas fa-angles-down">
					</i>
				</div>
				<ul className="collapse mt-4" id="myThreads">
				</ul>
			</div>
		</div>
	)
}

export default ForumMyThreads