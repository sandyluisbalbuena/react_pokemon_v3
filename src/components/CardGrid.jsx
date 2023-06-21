import React, { useEffect } from 'react'
import eventBus from '../eventBus';


const CardGrid = (props) => {

	var iso;

	useEffect(()=>{
		iso = $('.grid').isotope({
			itemSelector: '.grid-item',
			layoutMode: 'fitRows'
		});

		getonecard(props.pokemonName);
	});

	useEffect(() => {
		eventBus.subscribe('getonecard', getonecard);

		return () => {
			eventBus.unsubscribe('getonecard', getonecard);
		};
	}, []);


	const getonecard = (cardName) => {
		var myGrid = document.getElementById("myGrid");



		// let pokemonName = 'charizard';
	
		iso.isotope('destroy');
		myGrid.innerHTML = "";
	
		iso.isotope({
			itemSelector: '.grid-item',
			layoutMode: 'fitRows'
		});
	
	
		axios.get(`https://api.pokemontcg.io/v1/cards?name=`+cardName)
		.then(response => {
	
	
			let filterbuttons = [];
			filterbtns.innerHTML = '';
			filterbtns.innerHTML = `<button id="All" type="button" class="btn btn-dark text-sm btn-filter-cards">ALL</button>`;
	
			response.data.cards.forEach(function(pokecard){
	
				if(pokecard.rarity != undefined){
	
					let $newItems = $(`<div id="`+pokecard.id+`" class="grid-item card-img-forSearch `+pokecard.rarity.toUpperCase().trim().replace(/\s/g, '').replace(/[\s~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\]/g, '')+`"><img class="lazyload" loading="lazy" src="`+pokecard.imageUrlHiRes+`" data-src="`+pokecard.imageUrlHiRes+`" width="100%"/></div>`);
					iso.append($newItems).isotope('appended', $newItems);
		
					if(!filterbuttons.includes(pokecard.rarity.toUpperCase().trim().replace(/\s/g, '').replace(/[\s~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\]/g, '')) && pokecard.rarity.toUpperCase().trim().replace(/\s/g, '').replace(/[\s~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\]/g, '') != '' && pokecard.rarity.toUpperCase().trim().replace(/\s/g, '').replace(/[\s~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\]/g, '') != undefined){
		
						filterbtns.innerHTML += `<button id="`+pokecard.rarity.toUpperCase().trim().replace(/\s/g, '').replace(/[\s~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\]/g, '')+`" type="button" class="btn btn-dark text-sm btn-filter-cards">`+pokecard.rarity+`</button>`;
						filterbuttons.push(pokecard.rarity.toUpperCase().trim().replace(/\s/g, '').replace(/[\s~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\]/g, ''));
					}
				}
	
			})
			let buttonFilters = [...document.getElementsByClassName('btn-filter-cards')];
			buttonFilters.forEach((buttonFilter) => {
			buttonFilter.addEventListener('click', () => multiFilter(buttonFilter.id));
			});

			let cardImgForSearh = [...document.getElementsByClassName('card-img-forSearch')];
			cardImgForSearh.forEach((cardInfo) => {
				cardInfo.addEventListener('click', () => searchThiscard(cardInfo.id));
			});
	
		})
		.catch(error => console.error('On get one pokemon card error', error))
		.then(() => { 
	
			setTimeout(function() {
				iso.isotope({ filter: '*' })
			}, 500);
	
		})
	}

	function searchThiscard(cardId){
		eventBus.publish('getDataOneCard', cardId);
	}

	function multiFilter(filter){

		if(filter == 'All'){
			iso.isotope({ filter: '*' })
		}else{
			iso.isotope({ filter: '.'+filter })
		}
	}


	return (
		<>
			<div className="row my-4" id="filterbtnrow" >
				<div className="btn-group bg-dark" role="group" aria-label="Basic example" id="filterbtns">
				</div>
			</div>

			<div className="row my-5" id="gridrow">
				<div className="grid" id="myGrid">
				</div>
			</div>
		</>
	)
}

export default CardGrid