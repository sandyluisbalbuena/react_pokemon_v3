import React, { useEffect } from 'react'

const CardSplide = (props) => {

	get_pokemon_cards(props.pokemonName)

	function get_pokemon_cards(pokemonName){

		if(pokemonName.length == 0){
			return;
		}

		let cardSection = document.getElementById('splideCardsId');
		cardSection.innerHTML="";
	
		if (window.innerWidth <= 768) {
			var splideCards = new Splide( '#splideCards', {
				perPage: 1,
				type   : 'loop',
				focus  : 'center',
				pagination: false,
				rewind: true,
			} ).mount();
		}
		else{
			var splideCards = new Splide( '#splideCards', {
				perPage: 10,
				type   : 'loop',
				focus  : 'center',
				pagination: false,
				rewind: true,
			} ).mount();
		}

		document.getElementById('pokeCard').innerHTML=pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)+" Cards";
		let cardLimit = 15;


		axios.get(`https://api.pokemontcg.io/v1/cards?name=`+pokemonName)
		.then(response => {
			for(let i=0; i<cardLimit; i++){
				let newImg = document.createElement('img');
				newImg.setAttribute('src', response.data.cards[i].imageUrlHiRes);
				newImg.setAttribute('width', '90%');
				newImg.setAttribute('style', 'z-index:10;');
				newImg.className = 'cardloader';

				newImg.addEventListener('click', () =>
					forCards(response.data.cards[i].imageUrlHiRes, response.data.cards[i].id)
				);

				newImg.classList.add('hvr-grow-shadow', 'rounded')
				let newSlide = document.createElement('li');
				newSlide.className = 'splide__slide';
				newSlide.className = 'text-center';
				newSlide.appendChild(newImg);
				splideCards.add(newSlide);
			}
		})
		.catch(error => console.error('On get one pokemon card error', error))
		.then(() => { 
		})
	}

	function forCards(image, id){

		Swal.fire({
			html: '<img width="90%" src="'+image+'" class="rounded my-1"><button onclick="redirectToPokeCard(`'+id+'`)" class="btn btn-dark my-2">More Details</button>',
			customClass: {
			image: 'swal2-image',
			},
			imageAlt: 'Custom image',
			showConfirmButton: false,
		})
	}


	return (
		<div className="col-12">
			<div className="card my-1 pokedex-card-section">
				<div className="card-body">
					<h5 className="card-title" id="pokeCard"></h5>
					<div className="splide" id="splideCards">
						<div className="splide__track">
							<ul className="splide__list" id="splideCardsId">
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CardSplide