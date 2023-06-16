import React, { useEffect } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import { useNavigate } from 'react-router-dom';


const Home = () => {

	let splide;
	const navigate = useNavigate();


	function storePokemonNames(){

		let RAPIDAPI_API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0';

		axios.get(`${RAPIDAPI_API_URL}`)
		.then(response => {

			const pokemons = response.data.results;

			pokemons.forEach((pokemon) => {

				const pokemonRef = firebase.database().ref('pokemon');
				const newPokemonRef = pokemonRef.push();
				newPokemonRef.set({
					name: pokemon.name
				});

				console.log(pokemon.name);
			});
			
		})
		.catch(error => console.error('On get pokemon error', error))
		.then(() => { 
		})
	}

	function storeCategories(){

		// let RAPIDAPI_API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0';

		// axios.get(`${RAPIDAPI_API_URL}`)
		// .then(response => {

			// const pokemons = response.data.results;

			// pokemons.forEach((pokemon) => {

				// const categoriesRef = firebase.database().ref('categories');
				// const newcategoriesRef = categoriesRef.push();
				// newcategoriesRef.set({
				// 	name: 'samples',
				// 	slug: 'samples',
				// });https://console.firebase.google.com/u/0/project/pokemon-react-450b4/database/pokemon-react-450b4-default-rtdb/data/~2Fthreads~2F-NY0Xi71HKDa_3BHo7Mw

				const categoriesRef = firebase.database().ref('messages');
				const newcategoriesRef = categoriesRef.push();
				newcategoriesRef.set({
					threadId: '-NY0Xi71HKDa_3BHo7Mw',
					userId: 'fqDbUPCZu4em2dWhaMYPVdITouw2',
					parentID: null,
					content:'I like Rayquaza the most.',
					createdAt:'2023-06-03 19:11:07',
					updatedAt:'2023-06-03 19:11:07',
				});

				// console.log(pokemon.name);https://console.firebase.google.com/u/0/project/pokemon-react-450b4/database/pokemon-react-450b4-default-rtdb/data/~2Fusers~2FAsU7wLz6pGhiZZlTdiTtIHChMi53
			// });
			
		// })
		// .catch(error => console.error('On get pokemon error', error))
		// .then(() => { 
		// })
	}

	useEffect(()=>{
		if (window.innerWidth <= 768) {
			splide = new Splide( '.splide', {
				type   : 'loop',
				perPage: 3,
				focus  : 'center',
				arrows: false, 
				pagination: false,
				rewind: true,
				drag   : 'free',
				autoplay: true,
				speed: 100000,
				interval:1000,
			} ).mount();
			// ...
		}
		else{
			splide = new Splide( '.splide', {
				type   : 'loop',
				perPage: 10,
				focus  : 'center',
				arrows: false, 
				pagination: false,
				rewind: true,
				drag   : 'free',
				autoplay: true,
				speed: 100000,
				interval:1000,
			} ).mount();
		}
		getpokemondata(0,20)
	});





	function getpokemondata(pokemonStart,pokemonEnd)
	{
		let RAPIDAPI_API_URL = 'https://pokeapi.co/api/v2/pokemon?limit='+pokemonEnd+'&offset='+pokemonStart;

		axios.get(`${RAPIDAPI_API_URL}`)
		.then(response => {

			// console.log(response.data.results);

			const pokemons = response.data.results;

			// https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/1x/'+pokemons[pokemonsname2d].name+'-s.png

			pokemons.forEach((pokemon) => {

				let newImg = document.createElement('img');
				// newImg.classList.add('col-xs-1'); 
				newImg.setAttribute('src', 'https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/1x/'+pokemon.name+'.png');
				// newImg.setAttribute('data-mdb-toggle', 'tooltip');
				// newImg.setAttribute('title', pokemon.name);
				// newImg.setAttribute('onclick', "showLoader()");
				newImg.classList.add('hvr-grow');

				let newAnchor = document.createElement('a');
				// newAnchor.setAttribute('href', '/pokedex?pokemonName='+pokemon.name);


				// const buttonToRedirectToCard = document.getElementById('buttonToRedirectToCard');
				// if (buttonToRedirectToCard) {
					newAnchor.addEventListener('click', () =>
						redirectToPokeDex(pokemon.name)
					);
				// }

				newAnchor.appendChild(newImg);


				// mdb.Tooltip.getInstance(newImg) || new mdb.Tooltip(newImg).show();

				let newSlide = document.createElement('li');
				newSlide.className = 'splide__slide';
				// newSlide.textContent = 'New Slide';

				newSlide.appendChild(newAnchor);

				splide.add(newSlide);
			});
			
		})
		.catch(error => console.error('On get pokemon error', error))
		.then(() => { 
	

		})
	}

	function redirectToPokeDex(id){
		navigate('/pokedex?pokemonName='+id);
	}

	return (
		<>
			<div className="p-5 text-center bg-image hero">
				<div className="mask">
					<div className="d-flex justify-content-center align-items-center h-100">
						<div className="text-white">
							<h1 className="mb-3"><img src="./assets/images/brand/pokemonBrandName2.png" width="40%" /></h1>
							<form className="d-flex input-group w-auto mt-5 container" action="/pokedex" method="get">
								<input id="pokemonName" name="pokemonName" type="search" className="form-control rounded" placeholder="Pokemon Search" aria-label="Search" aria-describedby="search-addon" required/>
								<button className="btn bg-dark" type="submit">
									<i className="fas fa-search text-white"></i>
								</button>
							</form>
							{/* <button className="btn bg-dark my-5 text-white" onClick={storePokemonNames}>Start</button> */}
							{/* <button className="btn bg-dark my-5 text-white" onClick={storeCategories}>Create a new Thread</button> */}
						</div>
					</div>
				</div>
			</div>

			<main className="container-fluid">
				<section>
					<div className="row">
						<div className="splide">
							<div className="splide__track">
								<ul className="splide__list">
									
								</ul>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	)
}

export default Home