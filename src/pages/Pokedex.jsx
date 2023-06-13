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
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import firebase from 'firebase/compat/app';
import { renderToString } from 'react-dom/server';


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
	const [pokemonNamesCollection, setPokemonNamesCollection] = useState([]);

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

	// useEffect(() => {
	// 	const pokemonRef = firebase.database().ref('pokemon');
	
	// 	pokemonRef.on('value', (snapshot) => {
	// 	  const data = snapshot.val();
	// 	  if (data) {
	// 		const names = Object.values(data).map((pokemon) => pokemon.name);
	// 		setPokemonNamesCollection(names);
	// 	  }
	// 	});

	// 	return () => pokemonRef.off();
	// }, []);

	console.log(pokemonNamesCollection)

	const pokemonSearch = (pokemonNameName) =>{
		// setIsLoading(true);

		console.log('yeye');

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

			axios.get('https://pokeapi.co/api/v2/pokemon/'+pokemonName)
			.then(response => {
		
				console.log(response.data)
				setflavor_text(response.data.species);   
				setmoves(response.data.moves);   
				setstats(response.data.stats);   
				setabilities(response.data.abilities);
				setpokemonTypes(response.data.types);
				setpokemonNameForCard(response.data.name);
				setevolution(response.data.species);
				setrelated(response.data.types);
				setpokemonId(response.data.id);
			})
			.catch(() => { 
	
				pagboboUser(pokemonName);
			})
			.then(() => { 
			})
		
	}

	function checkSimilarity(enteredValue, nameCollection) {

		console.log(enteredValue, nameCollection);

		enteredValue = enteredValue.toLowerCase(); // Convert entered value to lowercase for case-insensitive comparison
		for (var i = 0; i < nameCollection.length; i++) {
		var name = nameCollection[i].toLowerCase(); // Convert name from the collection to lowercase for case-insensitive comparison
		if (name.includes(enteredValue)) {
			return name; // Entered value is similar to at least one name in the collection
		}
		// Calculate the Levenshtein distance between the entered value and the name
		var distance = calculateLevenshteinDistance(enteredValue, name);
		// Define a threshold for similarity (adjust as needed)
		var similarityThreshold = 2;
			if (distance <= similarityThreshold) {
				return name; // Entered value is similar to at least one name in the collection (based on Levenshtein distance)
			}
		}
		return false; // Entered value is not similar to any names in the collection
	}

	function calculateLevenshteinDistance(a, b) {
		if (a.length === 0) return b.length;
		if (b.length === 0) return a.length;
		var matrix = [];
	
		for (var i = 0; i <= b.length; i++) {
		matrix[i] = [i];
		}
	
		for (var j = 0; j <= a.length; j++) {
		matrix[0][j] = j;
		}
	
		for (var i = 1; i <= b.length; i++) {
			for (var j = 1; j <= a.length; j++) {
				if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
				} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1, // substitution
					matrix[i][j - 1] + 1, // insertion
					matrix[i - 1][j] + 1 // deletion
				);
				}
			}
		}
	
		return matrix[b.length][a.length];
	}

	function pagboboUser(pName){

		const pokemonRef = firebase.database().ref('pokemon');
	
		pokemonRef.on('value', (snapshot) => {
			const data = snapshot.val();
			if (data) {
				const names = Object.values(data).map((pokemon) => pokemon.name);

				let guest = checkSimilarity(pName,names)

				console.log(guest);

				axios.get('https://pokeapi.co/api/v2/pokemon/'+guest)
				.then(response => {
					// id = response.data.pokemonId;

					Swal.fire({
						icon: 'info',
						html: `
						<p>Are you referring to 
							<a href="#" id="pokemonLink">${guest}</a>
						</p>
						<p>
							<img width="150px" src="https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${response.data.id.toString().padStart(3, "0")}.png" />
						</p>
						<button class="btn bg-dark text-white m-1" id="yesButton">Yes</button>
						`,
						showCancelButton: false,
						showConfirmButton: false,
						didOpen: () => {
						const pokemonLink = document.getElementById('pokemonLink');
						const yesButton = document.getElementById('yesButton');
						if (pokemonLink && yesButton) {
							pokemonLink.addEventListener('click', () =>
							pokemonSearch(guest)
							);
							yesButton.addEventListener('click', () =>
							pokemonSearch(guest)
							);
						}
						},
						willClose: () => {
						const pokemonLink = document.getElementById('pokemonLink');
						const yesButton = document.getElementById('yesButton');
						if (pokemonLink && yesButton) {
							pokemonLink.removeEventListener('click', () =>
							pokemonSearch(guest)
							);
							yesButton.removeEventListener('click', () =>
							pokemonSearch(guest)
							);
						}
						},
					});
				})
				.catch((error) => { 
					Swal.fire({
						icon: 'error',
						title:'Ooops...',
						text:error,
						focusConfirm: false,
					})
				})
			}
		});
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
				{/* <CardSplide pokemonName={pokemonNameForCard}/> */}
			</section>

			<section className="row mb-5">
				{/* <PokemonVideos pokemonName={pokemonNameForCard}/> */}
			</section>
		</div>
	)
}

export default Pokedex