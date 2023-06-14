import React from 'react'
import CardInfo from '../components/CardInfo'

const Pokecard = () => {
	return (
		<div className="container">

			<section className="row mt-5">
			</section>


			<section className="row d-flex mt-5" id="pokedexSectionResult">
				<div className="col-12 mt-2">
					<div className="card my-1 px-1 animate__animated animate__fadeInUp" style={{borderRadius: '5px', height: '100%'}} id="secondCard">
						<div className="card-body container-fluid">
							<div className="row">

								<CardInfo />
								
							</div>
						</div>
					</div>
				</div>
			</section>



		</div>
	)
}

export default Pokecard