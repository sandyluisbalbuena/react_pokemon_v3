//ILOVEXUXA

var loaderbackground = document.getElementById("preloader-background");
var preloader = document.getElementById("preloader");
var table = new DataTable('#myTable');

let forMonDescription;
let forMonName;

window.addEventListener("load", function(){
	new Promise((resolve) => {
		loaderbackground.classList.add('animate__animated', 'animate__fadeOut');
		setTimeout(() => resolve(), 1000); 
	}).then(() => {
		loaderbackground.style.display = "none";
	});
});

function handleKeyPress(event){
    if (event.keyCode === 13) {
        pokemonSearch();
    }
}

function pokemonSearch(pokemonNameName){
	swal.close();
	if(pokemonNameName == undefined && pokemonNameName == null){
		var pname = document.getElementById('pokemonName');
		var pokemonName = pname.value;
	}
	else{
		var pokemonName = pokemonNameName;
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

	new Promise((resolve) => {
		new Promise((resolve) => {
			let pokemonImage = document.getElementById('pokemonImage');
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

		let existingChart = Chart.getChart("pokemonStatscanvas");

		if (existingChart) {
			existingChart.destroy();
		}

		let relatedTo = document.getElementById('relatedTo');
		let cardTitlePokemonName = document.getElementById('cardTitlePokemonName');
		let pokemonDescription = document.getElementById('pokemonDescription');
		let pokemonAbilities = document.getElementById('pokemonAbilities');
		let pokemonTypes = document.getElementById('pokemonTypes');
		let pokemonAdvantage = document.getElementById('pokemonAdvantage');
		let pokemonDisadvantage = document.getElementById('pokemonDisadvantage');
		let myTable = document.getElementById("myTable");
		let tbody = myTable.getElementsByTagName("tbody")[0];

		tbody.innerHTML = `<div class="spinner-border spinner-border-sm mt-2" role="status"></div>`;
		cardTitlePokemonName.innerHTML = `<div class="spinner-border spinner-border-sm mt-2" role="status"></div>`;
		pokemonDescription.innerHTML = `<div class="spinner-border spinner-border-sm mt-2" role="status"></div>`;
		pokemonAbilities.innerHTML=`<div class="spinner-border spinner-border-sm mt-2" role="status"></div>`;
		pokemonTypes.innerHTML=`<div class="spinner-border spinner-border-sm mt-2" role="status"></div>`;
		pokemonAdvantage.innerHTML=`<div class="spinner-border spinner-border-sm mt-2" role="status"></div>`;
		pokemonDisadvantage.innerHTML=`<div class="spinner-border spinner-border-sm mt-2" role="status"></div>`;

		axios.get('/getonepokemon/'+pokemonName)
		.then(response => {
			// pokemonName.value="";
			document.getElementById('pokemonName').value="";

			// console.log(response.data.pokemonTypes)

			// pokemonEvolutionButton.setAttribute('onclick', 'pokemon_evolution(`'+response.data.pokemonSpecies+'`)');
			pokemonrelatedtobutton.setAttribute('onclick', 'get_pokemon_related('+JSON.stringify(response.data.pokemonTypes)+')');
			pokemonImage.setAttribute('src','https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/'+response.data.pokemonId+'.png');
			// pokemonImage.setAttribute('src','https://img.pokemondb.net/artwork/avif/'+response.data.pokemonName.toLowerCase()+'.avif');
			cardTitlePokemonName.textContent = response.data.pokemonName;
			flavor_text(response.data.pokemonSpecies);
			pokemon_moves(response.data.pokemonMoves);
			pokemon_attributes(response.data.pokemonStats);
			pokemon_abilities(response.data.pokemonAbilities)
			pokemon_types(response.data.pokemonTypes)
			get_pokemon_advantages(response.data.pokemonTypes);
			get_pokemon_disadvantages(response.data.pokemonTypes);
			pokemon_evolution_trigger(response.data.pokemonSpecies);
			get_pokemon_cards(response.data.pokemonName);
			relatedTo.innerHTML='Pokemon related to '+response.data.pokemonName;
		})
		// .catch(error => console.error('On get one pokemon error', error))
		.catch(() => { 

			tbody.innerHTML = ``;
			cardTitlePokemonName.innerHTML = ``;
			pokemonDescription.innerHTML = ``;
			pokemonAbilities.innerHTML=``;
			pokemonTypes.innerHTML=``;
			pokemonAdvantage.innerHTML=``;
			pokemonDisadvantage.innerHTML=``;


			pagboboUser(pokemonName);
		})
		.then(() => { 
		})
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
				// showOkButton: false,
				focusConfirm: false,
			})
		})
		.then(() => { 
		})

	})



	
}

function flavor_text(specieUrl){

	axios.get(specieUrl)
	.then(response => {
		// console.log(response.data.flavor_text_entries);

		response.data.flavor_text_entries.forEach(description => {
			if(description.language.name == 'en'){
				forMonDescription = description.flavor_text;
				document.getElementById('pokemonDescription').textContent = description.flavor_text;
			}

			return;
		});
		
	})
	.catch(error => console.error('On get one pokemon error', error))
	.then(() => { 

	})

}

function pokemon_moves(moves_data){
    table.destroy();

	let myTable = document.getElementById("myTable");
    let tbody = myTable.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";


	table = $('#myTable').DataTable( {
		language: {
			searchPlaceholder: 'Search Move'
		},
		responsive: true
	} );

	moves_data.forEach(function(datamove) {
        axios.get('https://pokeapi.co/api/v2/move/'+datamove.move.name)
        .then(response => {
            // console.log(response.data);
            var newRowData = [response.data.name, response.data.accuracy, response.data.damage_class.name, response.data.power, response.data.pp, response.data.type.name];
            var newRow = table.row.add(newRowData).draw().node();
            let moveDescriptiontobeuse = "";
            response.data.flavor_text_entries.forEach(function(move){
                if(move.language.name=='en')
                {
                    moveDescriptiontobeuse = move.flavor_text;
                    return;
                }
            })
			// $(newRow).attr('onclick', 'moveDescription(`'+moveDescriptiontobeuse+'`)');
			$(newRow).addClass('animate__animated');
			$(newRow).addClass('animate__fadeInUp');

            $(newRow).find('td:eq(0)').html('<button onclick="moveDescription(`'+moveDescriptiontobeuse+'`)" class="btn" style="width:100%;">' + newRowData[0].toUpperCase() + '</button>');
            $(newRow).find('td:eq(5)').html('<img src="/assets/images/pokemonTypes/'+newRowData[5]+'text.png" style="width:100%;">');
        })
        .catch(error => console.error('On get one pokemon error', error))
        .then(() => { 
            // tbody.appendChild(row);
        })
    });
}

function moveDescription(moveDescriptionData)
{
    Swal.fire(moveDescriptionData)
}

function dipatapos(){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Coming Soon!',
        footer: '<a href="">Why do I have this issue?</a>'
    })
}

function pokemon_attributes(pokemonAttributes){

	let HP = pokemonAttributes[0][1];
	let ATTACK = pokemonAttributes[1][1];
	let DEFENSE = pokemonAttributes[2][1];
	let SPECIAL_ATTACK = pokemonAttributes[3][1];
	let SPECIAL_DEFENSE = pokemonAttributes[4][1];
	let SPEED = pokemonAttributes[5][1];

	const dataRadarChart = {
		labels: [
			'HP',
			'SPECIAL ATTACK',
			'ATTACK',
			'SPEED',
			'DEFENSE',
			'SPECIAL DEFENSE',
		],
		datasets: [
			{
				label: 'ATTRIBUTES',
				data: [HP, SPECIAL_ATTACK, ATTACK, SPEED, DEFENSE, SPECIAL_DEFENSE],
				fill: true,
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgb(255, 99, 132)',
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: 'rgb(255, 99, 132)'
			},
		]
	};

	// Get a reference to the existing chart instance
	let existingChart = Chart.getChart("pokemonStatscanvas");

	if (existingChart) {
		existingChart.destroy();
	}

	var options = {
		scale: {
			min:0,
			max:200,
			ticks: {
				beginAtZero: true,
				min: 0,
				max: 100,
				stepSize: 20,
			}
		},
		elements: {
			line: {
				borderWidth: 0
			}
		},
		animation: {
			duration: 2000, 
			delay: 500,
			// tension: {
			//     duration: 1000,
				// easing: 'linear',
				// from: -0.2,
				// to: 0,
				// loop: true
			// }
		},
		legend: {
			display: false // Set display to false to hide the legend
		},
	};

	var ctx = document.getElementById("pokemonStatscanvas").getContext("2d");
	new Chart(ctx, {
		type: 'bar',
		data: dataRadarChart,
		options: options
	});
}

function pokemon_evolution_trigger(specieUrl){

	let evolutionButton = document.getElementById('evolutionButton');


	axios.get(specieUrl)
	.then(response => {

		// console.log(response.data);

		evolutionButton.setAttribute('onclick', 'pokemon_evolution("'+response.data.evolution_chain.url+'")')

		// pokemon_evolution(response.data.evolution_chain.url);

	})
	.catch(error => console.error('On get one pokemon error', error))
	.then(() => { 

	})

}

function pokemon_evolution(pokemonEvolution){

	// console.log(pokemonEvolution);

	if(document.getElementById("evolutionButton").getAttribute('data-custom') == 0){
		let EvolutionChainSection = document.getElementById('EvolutionChainSection');
		EvolutionChainSection.className = "text-center"
		EvolutionChainSection.innerHTML=`<div class="spinner-border spinner-border-sm mt-2" role="status">
											<span class="visually-hidden">Loading...</span>
										</div>`;
		axios.get(pokemonEvolution)
		.then(response => {
			new Promise((resolve) => {
			setTimeout(() => resolve(), 1000);
			}).then(() => {
				let chainEvo = [];
				chainEvo.push(response.data.chain.species.name+"__"+response.data.chain.species.url.replace('https://pokeapi.co/api/v2/pokemon-species/', ""));
				if(response.data.chain.evolves_to.length>0)
				{
					response.data.chain.evolves_to.forEach(function(evolution) {
						chainEvo.push(evolution.species.name+"__"+evolution.species.url.replace('https://pokeapi.co/api/v2/pokemon-species/', ""));
						if(evolution.evolves_to.length>0)
						{
							evolution.evolves_to.forEach(function(evolution2) {
								chainEvo.push(evolution2.species.name+"__"+evolution2.species.url.replace('https://pokeapi.co/api/v2/pokemon-species/', ""));
							})
						}
					})
				}

				EvolutionChainSection.innerHTML="";
				chainEvo.forEach(function(name){
					let nameAndId = name.replace('/', "");
					nameAndId = nameAndId.split("__");
					EvolutionChainSection.innerHTML += '<img onclick="pokemonSearch(`'+nameAndId[0]+'`)" class="hvr-float" width="150px" src="https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/'+nameAndId[1].toString().padStart(3, `0`)+'.png">';
					// EvolutionChainSection.innerHTML += '<img onclick="pokemonSearch(`'+nameAndId[0]+'`)" class="hvr-float" width="150px" src="https://img.pokemondb.net/artwork/avif/'+nameAndId[0]+'.avif">';
				})
			});
		})
		.catch(error => console.error('On get one pokemon error', error))
		.then(() => { 
			// EvolutionChainSectionBtn.innerHTML="";
			document.getElementById("evolutionButton").innerHTML="HIDE";
			document.getElementById("evolutionButton").setAttribute('data-custom', '1');
		})
	}else{
		document.getElementById("evolutionButton").innerHTML="SHOW";
		document.getElementById("evolutionButton").setAttribute('data-custom', '0');
	}
}

function get_ablities_description(url){

	let abilitiesDescription = '';

	axios.get(url)
	.then(response => {

		response.data.flavor_text_entries.forEach(flavor_text_entry => {
			if(flavor_text_entry.language.name == 'en'){
				abilitiesDescription = flavor_text_entry.flavor_text;
				return;
			}
		});

	})
	.catch(error => console.error('On get one pokemon error', error))
	.then(() => { 
		Swal.fire(abilitiesDescription)
	})
	
}

function get_pokemon_related(pokemonTypes){

	let splider = document.getElementById('splide1');
	if(document.getElementById('pokemonrelatedtobutton').getAttribute('data-custom') == 0){
		splider.innerHTML=`<div class="spinner-border spinner-border-sm mt-2" role="status">
								<span class="visually-hidden">Loading...</span>
							</div>`;
		document.getElementById('pokemonrelatedtobutton').innerHTML="HIDE";
		let pokemonStart = 0;
		let pokemonEnd = 200;
		if (window.innerWidth <= 768) {
			var splide = new Splide( '.splide', {
				type   : 'loop',
				perPage: 2,
				focus  : 'center',
				arrows: false, 
				pagination: false,
				rewind: true,
				drag   : 'free',
			} ).mount();
		}
		else{
			var splide = new Splide( '.splide', {
				type   : 'loop',
				perPage: 6,
				focus  : 'center',
				arrows: false, 
				pagination: false,
				rewind: true,
				drag   : 'free',
			} ).mount();
		}
		if(splide.Components.Elements.slides.length > 0)
		{
			document.getElementById('splide1').innerHTML='';
			splide.destroy();
			if (window.innerWidth <= 768) {
				var splide = new Splide( '.splide', {
					type   : 'loop',
					perPage: 2,
					focus  : 'center',
					arrows: false, 
					pagination: false,
					rewind: true,
					drag   : 'free',
				} ).mount();
			}
			else{
				var splide = new Splide( '.splide', {
					type   : 'loop',
					perPage: 6,
					focus  : 'center',
					arrows: false, 
					pagination: false,
					rewind: true,
					drag   : 'free',
				} ).mount();
			}
		}
		axios.get('https://pokeapi.co/api/v2/pokemon?limit='+pokemonEnd+'&offset='+pokemonStart)
		.then(response => {
			new Promise((resolve) => {
			setTimeout(() => resolve(), 1000);
			}).then(() => {
				let pokemons = response.data.results;
				pokemons.forEach((pokemon) => {
					axios.get(`https://pokeapi.co/api/v2/pokemon/`+pokemon.name)
					.then(response => {
						let array1 =[];
						let array2 =[];
						response.data.types.forEach((type) => {
						
						array1.push(type.type.name)
						})
						pokemonTypes.forEach((type) => {
							array2.push(type[0])
						})
						// console.log(array1,array2);
						// console.log(array1.some(item => array2.includes(item)));
						if(array1.some(item => array2.includes(item))){
							// console.log(pokemon.name);
							let commonType = array1.filter(item => array2.includes(item));
							// EvolutionChainSection.innerHTML += '<img onclick="getonepokemondata(`'+nameAndId[0]+'`)" class="hvr-float" width="150px" src="https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/'+nameAndId[1].toString().padStart(3, `0`)+'.png">';
							let newImg = document.createElement('img');
							// newImg.classList.add('col-xs-1'); 
							newImg.setAttribute('src', 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/'+response.data.id.toString().padStart(3, `0`)+'.png');
							// newImg.setAttribute('src', 'https://img.pokemondb.net/artwork/avif/'+pokemon.name.toLowerCase()+'.avif');
							newImg.setAttribute('width', '100px');
							newImg.setAttribute('height', '100px');
							// newImg.setAttribute('src', 'https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/1x/'+pokemon.name+'.png');
							newImg.setAttribute('onclick', 'pokemonSearch(`'+pokemon.name+'`)');
							newImg.className = 'hvr-float';
							// newImg.setAttribute('href', '#');
							// newImg.setAttribute('data-mdb-toggle', 'tooltip');
							// newImg.setAttribute('title', 'Im '+pokemon.name+', and Im also a '+commonType[0]+' type.');
							// new mdb.Tooltip(newImg).init();
							// mdb.Tooltip.getInstance(newImg) || new mdb.Tooltip(newImg).show();
							let newSlide = document.createElement('li');
							newSlide.className = 'splide__slide';
							// newSlide.textContent = 'New Slide';
							newSlide.appendChild(newImg);
							splide.add(newSlide);
						}
					})
					.catch(error => console.error('On get one pokemon error', error))
					.then(() => { 
					})
				});
			});
			
		})
		.catch(error => console.error('On get one pokemon error', error))
		.then(() => { 
			document.getElementById('pokemonrelatedtobutton').setAttribute('data-custom', '1')
		})
	}
	else{
		document.getElementById('pokemonrelatedtobutton').setAttribute('data-custom', '0');
		document.getElementById('pokemonrelatedtobutton').innerHTML="SHOW";
		splider.innerHTML="";
	}
	
}

function pokemon_abilities(pokemonAbilities){
	let pokemonAbilities2 = document.getElementById('pokemonAbilities');
	pokemonAbilities2.innerHTML="";
	pokemonAbilities.forEach(ability => {

		if(ability[2]){
			pokemonAbilities2.innerHTML += '<button class="text-white animate__animated animate__fadeInUp btn bg-dark m-1" style="width:100%;" onclick="get_ablities_description(`'+ability[1]+'`)" class="btn btn-dark mb-1" type="button" )">'+ability[0]+'&nbsp;&nbsp;<span class="badge badge-primary badge-sm badge-light bg-light">HIDDEN</span></button>';
		}
		else{
			pokemonAbilities2.innerHTML += '<button class="text-white animate__animated animate__fadeInUp btn bg-dark m-1" style="width:100%;" onclick="get_ablities_description(`'+ability[1]+'`)" class="btn btn-dark mb-1" type="button" )">'+ability[0]+'</button>';
		}

	});
}

function pokemon_types(pokemonTypes){
	let pokemonTypes2 = document.getElementById('pokemonTypes');
	pokemonTypes2.innerHTML="";
	pokemonTypes.forEach(type => {
		pokemonTypes2.innerHTML += '<img class="animate__animated animate__fadeInUp m-1" height="25px" onclick="dipatapos()" src="/assets/images/pokemonTypes/'+type[0]+'text.png" alt="">';
	});
}

function pokemon_advantage(pokemonAdvantageData){
	let pokemonAdvantage = document.getElementById('pokemonAdvantage');
	pokemonAdvantage.innerHTML="";

	console.log(pokemonAdvantage);	

	pokemonAdvantageData.forEach(adv => {
		pokemonAdvantage.innerHTML += '<img class="animate__animated animate__fadeInUp m-1" height="25px" onclick="dipatapos()" src="/assets/images/pokemonTypes/'+adv+'text.png" alt="">';
	});
}

function pokemon_disadvantage(pokemonDisAdvantageData){
	let pokemonDisadvantage = document.getElementById('pokemonDisadvantage');
	pokemonDisadvantage.innerHTML="";
	pokemonDisAdvantageData.forEach(dadv => {
		pokemonDisadvantage.innerHTML += '<img class="animate__animated animate__fadeInUp m-1" height="25px" onclick="dipatapos()" src="/assets/images/pokemonTypes/'+dadv+'text.png" alt="">';
	});
}

function get_pokemon_advantages(pokemonTypes){

	let pokemonAdvantagesSection = document.getElementById('pokemonAdvantage');
	pokemonAdvantagesSection.innerHTML="";

	let adv = [];

	pokemonTypes.forEach(type => {
		axios.get(type[1])
		.then(response => {

			adv.push(response.data.damage_relations.double_damage_to);
			// console.log(response.data.damage_relations.double_damage_to);


			response.data.damage_relations.double_damage_to.forEach(advantage => {
				adv.push(advantage.name);
				pokemonAdvantagesSection.innerHTML += '<img class="m-1" height="25px" onclick="dipatapos()" src="/assets/images/pokemonTypes/'+advantage.name+'text.png" alt="">';
			});

		})
		.catch(error => console.error('On get one pokemon error', error))
		.then(() => { 
		})
	});

	// console.log(adv)

	// console.log([...new Set(adv)]);

	// console.log(uniqueArray);

	// let remove_duplicates = [...adv[0], ...adv[1]];
	


}

function get_pokemon_disadvantages(pokemonTypes){
	let pokemonAdvantagesSection = document.getElementById('pokemonDisadvantage');
	pokemonAdvantagesSection.innerHTML="";
	pokemonTypes.forEach(type => {
		axios.get(type[1])
		.then(response => {
			response.data.damage_relations.double_damage_from.forEach(disadvantage => {
				pokemonAdvantagesSection.innerHTML += '<img class="m-1" height="25px" onclick="dipatapos()" src="/assets/images/pokemonTypes/'+disadvantage.name+'text.png" alt="">';
			});
		})
		.catch(error => console.error('On get one pokemon error', error))
		.then(() => { 

		})
	});
}

function get_pokemon_immunity_from(pokemonTypes){
}

function get_pokemon_immunity_to(pokemonTypes){

}

function get_pokemon_species(specieUrl){

	let evolutionButton = document.getElementById('evolutionButton');

	axios.get(specieUrl)
	.then(response => {
		// console.log(response.data);

		evolutionButton.setAttribute('onclick', 'pokemon_evolution("'+response.data.evolution_chain.url+'")');

	})
	.catch(error => console.error('On get one pokemon error', error))
	.then(() => { 

	})
}	

function get_pokemon_cards(pokemonName){

	forMonName = pokemonName;

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
	let cardLimit = 10;
	axios.get(`https://api.pokemontcg.io/v1/cards?name=`+pokemonName)
    .then(response => {
        // console.log(response.data.cards);
		for(let i=0; i<cardLimit; i++){
			let newImg = document.createElement('img');
            newImg.setAttribute('src', response.data.cards[i].imageUrlHiRes);
            newImg.setAttribute('width', '90%');
            newImg.setAttribute('style', 'z-index:10;');
            newImg.setAttribute('loading', 'lazy');
            // newImg.setAttribute('style', 'opacity:0;');
            newImg.className = 'cardloader';
            // newImg.setAttribute('id', pokecard.id);
            // newImg.setAttribute('onclick', 'getonepokemondata("'+response.data.name+'")');
            newImg.setAttribute('onclick', 'forCards("'+response.data.cards[i].imageUrlHiRes+'","'+response.data.cards[i].id+'")');
			newImg.classList.add('hvr-grow-shadow', 'rounded')
            // newImg.className = 'hvr-float';
            // newImg.className = 'rounded';
            let newSlide = document.createElement('li');
            newSlide.className = 'splide__slide';
            newSlide.className = 'text-center';
            newSlide.appendChild(newImg);
            splideCards.add(newSlide);
		}
        // images = document.getElementsByClassName("pokecard");
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
		// html:''
    })
}

function checkSimilarity(enteredValue, nameCollection) {
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

	// Initialize the matrix
	for (var i = 0; i <= b.length; i++) {
	matrix[i] = [i];
	}

	for (var j = 0; j <= a.length; j++) {
	matrix[0][j] = j;
	}

	// Calculate the Levenshtein distance
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

function redirectToPokeCard(cardId) {
	console.log(cardId);
	window.location.href = "/pokecard?id=" + cardId;
}

function stringToSlug(string) {
    return string
      .toLowerCase() // convert to lowercase
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/[^\w-]+/g, '') // remove non-word characters
      .replace(/--+/g, '-') // replace multiple consecutive hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // remove hyphens from the beginning and end
}

formPostThread.addEventListener('submit', (e)=>{
	e.preventDefault();
	
	let formData = {
		'category' : category.value,
		'title' : title.value,
		'content' : tinymce.activeEditor.getContent(),
		// 'content' : summernote.value,
	};

    let slug = stringToSlug(title.value);


	axios.post('/pokeforum', formData)
    .then(response => {

		if(response.data.success){
			
			$('#postThread').modal('hide');

			Swal.fire({
				icon: 'success',
				title: 'Thread Created successfully!',
			})

            setTimeout(() => {
                window.location.href = "/pokeforum/"+slug;
            }, 1000);
		
		}else{
			document.getElementById('categoryError').textContent = response.data.message.category;
			document.getElementById('titleError').innerHTML = response.data.message.title;													
			document.getElementById('contentError').innerHTML = response.data.message.content;
			Swal.fire({
				icon: 'error',
				title: 'Something went wrong!',
			})
		}
    })
    .catch(function (error){
		console.error(error);
	})
    .then(() => { 
    })
})

function createThreadMon() {
	document.getElementById('category').value = 1;
    document.getElementById('category').setAttribute('disabled', '');

    tinymce.execCommand('setContent', false, ``);

    

    tinymce.execCommand('mceInsertContent', false, `<img  class="rounded cardForThread" src="https://img.pokemondb.net/artwork/avif/`+forMonName.toLowerCase()+`.avif">
                                                        <h6>
                                                        `+
                                                        forMonName
                                                        +` 
                                                        </h6>
														<p>
                                                        `+
                                                        forMonDescription
                                                        +` 
                                                        </p>
                                                    `);
}