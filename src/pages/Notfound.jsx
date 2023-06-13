import React from 'react'
import { Link } from 'react-router-dom'

const Notfound = () => {
	return (
		<div className="col-12 col-lg-6 m-auto my-5">
			<div className="card my-1 pokedex-card-section">
				<div className="card-body text-center">
					<h1 className="card-title notfound" id="pokeCard">4<img width="40%" src="../assets/images/misc/loader.gif"/>4</h1>
					<p>Pokemon not found!</p>
					<Link to='/' className="btn btn-dark">Back</Link>
					
				</div>
			</div>
		</div>
	)
}

export default Notfound