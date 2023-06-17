import React from 'react'

const ForumTrendingTopics = () => {
	return (
		<div className="card mb-2 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{borderRadius: '5px', height: '100%'}} id="secondCard">
			<div className="card-body container-fluid">
				<div className="d-flex justify-content-between" type="button" data-mdb-toggle="collapse" data-mdb-target="#trendingTopics" aria-expanded="true" aria-controls="trendingTopics"><h6 className="ms-4">Trending Topics</h6><i className="fas fa-angles-down"></i></div>
				<ul className="collapse show mt-4" id="trendingTopics">
				</ul>
			</div>
		</div>
	)
}

export default ForumTrendingTopics