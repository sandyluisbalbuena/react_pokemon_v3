import React, { useEffect, useState } from 'react'
import CardSplide from '../components/CardSplide'
import PokemonImage from '../components/PokemonImage'
import PokemonAbilities from '../components/PokemonAbilities';
import PokemonAdvantages from '../components/PokemonAdvantages';
import PokemonDisadvantages from '../components/PokemonDisadvantages';
import PokemonMoves from '../components/PokemonMoves';
import PokemonStats from '../components/PokemonStats';
import PokemonEvolutions from '../components/PokemonEvolutions';
import PokemonRelated from '../components/PokemonRelated';
import eventBus from '../eventBus';
import PokemonVideos from '../components/PokemonVideos';
import queryString from 'query-string';


const Pokedex = () => {

	let [flavor_text, setflavor_text] = useState([]);
	let [pokemonTypes, setpokemonTypes] = useState([]);
	let [pokemonNameForCard, setpokemonNameForCard] = useState([]);
	let [abilities, setabilities] = useState([]);
	let [moves, setmoves] = useState([]);
	let [stats, setstats] = useState([]);
	let [evolution, setevolution] = useState([]);
	let [related, setrelated] = useState([]);
	let [pokemonId, setpokemonId] = useState([]);
	// let [isLoading, setIsLoading] = useState(false);
	let pokemonName2;


	useEffect(()=>{
		const parsed = queryString.parse(window.location.search);
  		var pokemonNameName = parsed.pokemonName;

		if(pokemonNameName == undefined && pokemonNameName == null){
			pokemonName2 = 'charizard';
		}
		else{
			pokemonName2 = pokemonNameName;
		}

		pokemonSearch(pokemonName2);
	}, []);

	useEffect(() => {
		eventBus.subscribe('searchPokemon', pokemonSearch);

		return () => {
			eventBus.unsubscribe('searchPokemon', pokemonSearch);
		};
	}, []);

	const pokemonSearch = (pokemonNameName) =>{
		// setIsLoading(true);

		swal.close();
		if(pokemonNameName == undefined && pokemonNameName == null){
			var pname = document.getElementById('pokemonName');
			var pokemonName = pname.value;
		}
		else{
			var pokemonName = pokemonNameName;
		}

		let existingChart = Chart.getChart("pokemonStatscanvas");

		if (existingChart) {
			existingChart.destroy();
		}
	
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	
		let pokemonrelatedtobutton = document.getElementById('pokemonrelatedtobutton');
		let pokemonEvolutionButton = document.getElementById('evolutionButton');
		let collapseExample1 = document.getElementById('collapseExample1');
		let collapseExample2 = document.getElementById('collapseExample2');
		pokemonEvolutionButton.innerHTML = "SHOW";
		pokemonEvolutionButton.setAttribute('data-custom', '0');
		pokemonEvolutionButton.setAttribute('aria-expanded', 'false');
		pokemonrelatedtobutton.innerHTML = "SHOW";
		pokemonrelatedtobutton.setAttribute('data-custom', '0');
		pokemonrelatedtobutton.setAttribute('aria-expanded', 'false');
		collapseExample1.classList.remove('show');
		collapseExample2.classList.remove('show');
		let pokemonImage = document.getElementById('pokemonImage');


		let splider = document.getElementById('splide1');
		splider.innerHTML = '';



		new Promise((resolve) => {
			new Promise((resolve) => {
				pokemonImage.classList.remove('animate__fadeIn');
				pokemonImage.classList.add('animate__fadeOut');
				setTimeout(() => resolve(), 2000);
			}).then(() => {
				pokemonImage.classList.remove('animate__fadeOut');
				pokemonImage.setAttribute('src','/assets/images/misc/loader.gif');
				pokemonImage.classList.add('animate__animated', 'animate__fadeIn');
			});
			setTimeout(() => resolve(), 3000);
		}).then(() => {
	
			pokemonImage.classList.remove('animate__fadeIn');
			pokemonImage.classList.add('animate__fadeIn');
			

			// let relatedTo = document.getElementById('relatedTo');
			let cardTitlePokemonName = document.getElementById('cardTitlePokemonName');
			let pokemonDescription = document.getElementById('pokemonDescription');
			let pokemonAbilities = document.getElementById('pokemonAbilities');
			let pokemonTypes = document.getElementById('pokemonTypes');
			let pokemonAdvantage = document.getElementById('pokemonAdvantage');
			let pokemonDisadvantage = document.getElementById('pokemonDisadvantage');
			// let myTable = document.getElementById("myTable");
			// let tbody = myTable.getElementsByTagName("tbody")[0];
	
			// tbody.innerHTML = `<div class="spinner-border spinner-border-sm mt-2" role="status"></div>`;
			// cardTitlePokemonName.innerHTML = `<div class="spinner-border spinner-border-sm mt-2" role="status"></div>`;
			// pokemonDescription.innerHTML = `<div class="spinner-border spinner-border-sm mt-2" role="status"></div>`;
			// pokemonAbilities.innerHTML=`<div class="spinner-border spinner-border-sm mt-2" role="status"></div>`;
			// pokemonTypes.innerHTML=`<div class="spinner-border spinner-border-sm mt-2" role="status"></div>`;
			// pokemonAdvantage.innerHTML=`<div class="spinner-border spinner-border-sm mt-2" role="status"></div>`;
			// pokemonDisadvantage.innerHTML=`<div class="spinner-border spinner-border-sm mt-2" role="status"></div>`;
			// console.log(pokemonName);
	
			axios.get('https://pokeapi.co/api/v2/pokemon/'+pokemonName)
			.then(response => {
				// pokemonName.value="";
				// document.getElementById('pokemonName').value="";
				console.log(response.data)
				// pokemonrelatedtobutton.setAttribute('onClick', get_pokemon_related('+JSON.stringify(response.data.types)+'));
				setflavor_text(response.data.species);   
				setmoves(response.data.moves);   
				setstats(response.data.stats);   
				setabilities(response.data.abilities);
				setpokemonTypes(response.data.types);
				setpokemonNameForCard(response.data.name);
				setevolution(response.data.species);
				setrelated(response.data.types);
				setpokemonId(response.data.id);
				// pokemon_evolution_trigger(response.data.pokemonSpecies);
				// relatedTo.innerHTML='Pokemon related to '+response.data.pokemonName;
			})
			.catch(() => { 
				tbody.innerHTML = ``;
				cardTitlePokemonName.innerHTML = ``;
				pokemonDescription.innerHTML = ``;
				pokemonAbilities.innerHTML=``;
				pokemonTypes.innerHTML=``;
				pokemonAdvantage.innerHTML=``;
				pokemonDisadvantage.innerHTML=``;
				// pagboboUser(pokemonName);
			})
			.then(() => { 
			})
		})
		.finally(() => {
			// setIsLoading(false);
		});
	}

	function pagboboUser(pokemonName){


		axios.get('/getpokemonnames')
		.then(response2 => {
	
			let guest = checkSimilarity(pokemonName,response2.data)
	
			axios.get('/getonepokemon/'+guest)
			.then(response => {
				// id = response.data.pokemonId;
	
				Swal.fire({
					icon: 'info',
					html:
						'<p>Are you refering to ' +
						'<a href="#" onclick="pokemonSearch(`'+guest+'`)">'+guest+'</a></p>'+
						'<p><img width="150px" src="https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/'+response.data.pokemonId+'.png"></p>'+
						'<button class="btn bg-dark text-white m-1" onclick="pokemonSearch(`'+guest+'`)">Yes</button>',
						// '<p><img width="150px" src="https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/'+response.data.pokemonName.toLowerCase()+'.png"></p>',
					buttons: false,
					showCancelButton: false,
					showConfirmButton: false
					// focusConfirm: false,
					// footer: '<a href="#" onclick="pokemonSearch(`'+guest+'`)">Are you reffering to '+guest+'?</a>'
				})
			})
			.catch(() => { 
				Swal.fire({
					icon: 'error',
					title:'Ooops...',
					focusConfirm: false,
				})
			})
			.then(() => { 
			})
	
		})
	
		
	}


	return (
		<div className="container">
			{/* {isLoading && (
				<div className="maskForPokemonSearch">
				</div>
			)} */}

			<section className="row mt-5">
			</section>

			<section className="row d-flex mt-5" id="pokedexSectionResult">

				<div className="col-12 col-lg-3 mt-2">
					<div className='pokedex-sidenav'>
						<PokemonImage flavor_text={flavor_text} pokemonTyping={pokemonTypes} pokemonId={pokemonId}/>
					</div>
				</div>

				<div className="col-12 col-lg-9 mt-2">
					<div className="container-fluid">

						<div className="row">
							<div className="card my-1 px-1 animate__animated animate__fadeInUp" id="secondCard">
								<div className="card-body container-fluid">

									<div className="row">
										<div className="col-12 col-lg-4">
											<h6 className="card-title">Abilities</h6>
											<div id="pokemonAbilities">
												<PokemonAbilities abilities={abilities}/>
											</div>
										</div>
								
										<div className="col-12 col-lg-4">
											<h6 className="card-title">Advantages</h6>
											<div id="pokemonAdvantage">
												<PokemonAdvantages pokemonTyping={pokemonTypes}/>
											</div>
										</div>

										<div className="col-12 col-lg-4">
											<h6 className="card-title">Disadvantages</h6>
											<div id="pokemonDisadvantage">
												<PokemonDisadvantages pokemonTyping={pokemonTypes}/>
											</div>
										</div>
									</div>

								</div>
							</div>
						</div>

						<div className="row">
							<div className="card my-1 px-2 animate__animated animate__fadeInUp pokedexCard2" id="secondCard">
								<div className="card-body container-fluid">

									<div className="row my-4">
										<div className="col-12 col-lg-8">
											<div className="row">
												<h6>Moves</h6>
												<PokemonMoves moves={moves} />
											</div>
										</div>

										<div className="col-12 col-lg-3 offset-lg-1">
											<div className="row">
												<PokemonStats stats={stats}/>
											</div>
										</div>
									</div>

								</div>
							</div>
						</div>

						<div className="row">
							<div className="card my-1 px-1" id="secondCard">
								<div className="card-body container-fluid">
									<div className="row">
										<h6 className="card-title">Evolution</h6>
										<PokemonEvolutions evolution={evolution} searchFunction = {pokemonSearch}/>
									</div>
								</div>
							</div>
						</div>

						<div className="row">
							<div className="card my-1 px-1 pokedexCard3" id="secondCard">
								<div className="card-body container-fluid">
									<div className="row">
										<PokemonRelated related={related} pokemonName={pokemonNameForCard} searchFunction = {pokemonSearch}/>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</section>

			<section className="row">
				<CardSplide pokemonName={pokemonNameForCard}/>
			</section>

			<section className="row mb-5">
				<PokemonVideos pokemonName={pokemonNameForCard}/>
			</section>
		</div>
	)
}

export default Pokedex