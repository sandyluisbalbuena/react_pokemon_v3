import React, { useEffect, useState } from 'react'

const PokemonImage = (props) => {

	let [loading, setloading] = useState(false);

	useEffect(()=>{
		props.flavor_text.url?flavor_text(props.flavor_text.url):null;
	});

	function flavor_text(specieUrl){

		axios.get(specieUrl)
		.then(response => {
			response.data.flavor_text_entries.forEach(description => {
				if(description.language.name == 'en'){
					document.getElementById('pokemonDescription').textContent = description.flavor_text;
				}

				setloading(true);
				return;
			});
			
		})
		.catch(error => console.error('On get one pokemon error', error))
		.then(() => { 
		})
	}

	return (
		
		<div className="card my-1 animate__animated animate__fadeInLeft pokedexCard1" id="firstCard">

			<div id="backgroundColor" className="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
				{(loading == true)?(
				<img id="pokemonImage" className="animate__animated animate__fadeIn animate__delay-1s p-3 img-fluid" src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${props.pokemonId.toString().padStart(3, "0")}.png`} width="100%" height="100%"/>
				// <img id="pokemonImage" className="animate__animated animate__fadeIn animate__delay-1s p-3 img-fluid" src={`https://img.pokemondb.net/artwork/avif/${props.flavor_text.name}.avif`} width="100%" height="100%"/>
				):
				(
					<img id="pokemonImage" className="animate__animated animate__fadeIn animate__delay-1s p-3 img-fluid" src="../assets/images/misc/loader.gif" width="100%" height="100%"/>
				)}
				
				<a href="#!">
					<div className="mask pokedex-mask"></div>
				</a>
			</div>

			<div className="card-body text-center">
			<h5 id="cardTitlePokemonName" className="card-title p-2 m-1">
				{props.flavor_text.name ? props.flavor_text.name.charAt(0).toUpperCase() + props.flavor_text.name.slice(1) : ''}
			</h5>
				{/* @if(auth()->check())
					<button className="mt-3 btn btn-dark" data-mdb-toggle="modal" data-mdb-target="#postThread">
						<i className="far fa-pen-to-square me-1"></i>
						Create a thread	
					</button>
				@endif  */}
				<hr/>
				<p className="card-text" id="pokemonDescription"></p>
				<hr/>
				<div id="pokemonTypes">
					{(loading == true)?(
					props.pokemonTyping.map(type => (
							<img key={type.type.name} className="mx-1" height="25px" src={`./assets/images/pokemonTypes/${type.type.name}text.png`} alt=""/>
						))
					
					):
					(
						<div className="spinner-border spinner-border-sm mt-2" role="status"></div>
					)}
				</div>
			</div>

		</div>
	)
}

export default PokemonImage