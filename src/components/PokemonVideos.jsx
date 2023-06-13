import React, { useEffect } from 'react';

const PokemonVideos = (props) => {


	getVideos(props.pokemonName)


	function getVideos(pokemonName){

		if(pokemonName.length == 0){
			return;
		}

		const options = {
			method: 'GET',
			url: 'https://youtube-v31.p.rapidapi.com/search',
			params: {
			q: 'pokemon ' + pokemonName,
			part: 'snippet,id',
			regionCode: 'US',
			maxResults: '10',
			order: 'date'
			},
			headers: {
			'X-RapidAPI-Key': 'f293597e7dmsh66104292b3eccfcp16db32jsnd523df679fcf',
			'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
			}
		};

		try {
				axios.request(options)
				.then(response=>{

					response.data.items.forEach(video => {
						let vid = document.createElement('iframe');
						vid.setAttribute('src', 'https://www.youtube.com/embed/' +video.id.videoId);
						vid.setAttribute('width', '80%');
						vid.setAttribute('height', '100%');
						vid.classList.add('rounded');
						vid.setAttribute('title', 'YouTube video player');
						vid.setAttribute('frameborder', '0');
						vid.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
						vid.setAttribute('allowfullscreen', '');

						let newSlide = document.createElement('li');
						newSlide.className = 'splide__slide';
						newSlide.appendChild(vid);
						splideCards.add(newSlide);
					});
				
				})
			} 
		catch (error) {
			console.error(error);
		}
	}


	if(props.pokemonName.length > 0){
		document.getElementById('pokeVid').innerHTML=props.pokemonName.charAt(0).toUpperCase() + props.pokemonName.slice(1)+" Videos";

		let cardSection = document.getElementById('splideVideoId');
		cardSection.innerHTML="";
	
		if (window.innerWidth <= 768) {
			var splideCards = new Splide( '#splideVideos', {
				perPage: 1,
				type   : 'loop',
				focus  : 'center',
				pagination: false,
			} ).mount();
		}
		else{
			var splideCards = new Splide( '#splideVideos', {
				perPage: 5,
				type   : 'loop',
				focus  : 'center',
				pagination: false,
			} ).mount();
		}
	}



	return (
		<div className="col-12">
			<div className="card my-2 pokedex-video-section">
				<div className="card-body">
					<h5 className="card-title" id="pokeVid"></h5>
					<div className="splide" id="splideVideos">
						<div className="splide__track">
							<ul className="splide__list" id="splideVideoId">
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PokemonVideos;
