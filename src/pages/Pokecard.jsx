import React, { useEffect, useState } from 'react'
import CardInfo from '../components/CardInfo'
import CardGrid from '../components/CardGrid'
import queryString from 'query-string';

const Pokecard = () => {

	let [pokemonNameName, setpokemonNameName] = useState('');

	useEffect(()=>{
		const parsed = queryString.parse(window.location.search);
		let cardTobeSearchFromUrl = parsed.cardName;

		if(cardTobeSearchFromUrl == undefined && cardTobeSearchFromUrl == null){
			setpokemonNameName('charizard');
		}	
		else{
			setpokemonNameName(cardTobeSearchFromUrl);
		}
		
	}, []);

	return (
		<div className="container">

			<section className="row mt-5">
			</section>

			<section className="row d-flex mt-5" id="pokedexSectionResult">
				<div className="col-12 mt-2">
					<div className="card my-1 px-1 animate__animated animate__fadeInUp" style={{borderRadius: '5px', height: '100%'}} id="secondCard">
						<div className="card-body container-fluid">
							<div className="row">
								{((pokemonNameName!='')&&(<CardInfo />))}
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="row d-flex my-4" id="pokedexSectionResult">
				<div className="col-12">
					<div className="card my-1 px-1 animate__animated animate__fadeInUp" style={{borderRadius: '5px', height: '100%'}} id="secondCard">
						<div className="card-body container-fluid">
							{((pokemonNameName!='')&&(<CardGrid pokemonName={pokemonNameName}/>))}
						</div>
					</div>
				</div>
			</section>

		</div>
	)
}

export default Pokecard