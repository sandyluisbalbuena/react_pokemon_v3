import React, { useEffect } from 'react'

const Home = () => {

	let splide;

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
				newAnchor.setAttribute('href', '/pokedex?pokemonName='+pokemon.name);

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