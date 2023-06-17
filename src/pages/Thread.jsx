import React from 'react'
import ForumCategories from '../components/ForumCategories'
import ForumThread from '../components/ForumThread'

const Thread = () => {

	return (
		<div className="container">

			<section className="row mt-5">
			</section>

			<section className="row d-flex mt-5" id="pokedexSectionResult">
				<div className="col-12 col-lg-9 px-3 px-lg-1 animate__animated animate__fadeInUp">
					<ForumThread />
				</div>
				<div className="d-none d-lg-block col-lg-3 animate__animated animate__fadeIn">
					<div className="container" style={{height:'100%'}}>
							<div style={{position: '-webkit-sticky', position: 'sticky', top: '70px'}}>

								<div className="row">
									<ForumCategories />
								</div>

								<div className="row">
									<div className="card mb-2 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{borderRadius: '5px', height: '100%'}}>
										<div className="card-body container-fluid">
											<div className="d-flex justify-content-between" type="button" data-mdb-toggle="collapse" data-mdb-target="#myThreads" aria-expanded="false" aria-controls="myThreads"><h6 className="ms-4">My threads</h6><i className="fas fa-angles-down"></i></div>
											<ul className="collapse mt-4" id="myThreads">
											</ul>
										</div>
									</div>
								</div>

								<div className="row">
									<div className="card px-1 animate__animated animate__fadeIn animate__delay-1s" style={{borderRadius: '5px', height: '100%'}} id="thirdCard">
										<div className="card-body container-fluid">
											<div className="d-flex justify-content-between" type="button" data-mdb-toggle="collapse" data-mdb-target="#trendingTopics" aria-expanded="true" aria-controls="trendingTopics"><h6 className="ms-4">Trending Topics</h6><i className="fas fa-angles-down"></i></div>
											<ul className="collapse show mt-4" id="trendingTopics">
											</ul>
										</div>
									</div>
								</div>
								
							</div>
					</div>
				</div>
			</section>
			
		</div>
	)
}

export default Thread