import './App.css'
import { Routes, Route } from 'react-router-dom'
import Template from './layout/Template'
import Home from './pages/Home'
import Pokedex from './pages/Pokedex'
import Pokecard from './pages/Pokecard'
import Notfound from './pages/Notfound'
import PokedexContext from './PokedexContext'

function App() {


  const pokemonSearch = (pokemonNameName) =>{
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
			let existingChart = Chart.getChart("pokemonStatscanvas");

			if (existingChart) {
				existingChart.destroy();
			}

			// let relatedTo = document.getElementById('relatedTo');
			let cardTitlePokemonName = document.getElementById('cardTitlePokemonName');
			let pokemonDescription = document.getElementById('pokemonDescription');
			let pokemonAbilities = document.getElementById('pokemonAbilities');
			let pokemonTypes = document.getElementById('pokemonTypes');
			let pokemonAdvantage = document.getElementById('pokemonAdvantage');
			let pokemonDisadvantage = document.getElementById('pokemonDisadvantage');
			let myTable = document.getElementById("myTable");
			let tbody = myTable.getElementsByTagName("tbody")[0];
	
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
		});
	}

  return (
    <>
      <PokedexContext.Provider value={pokemonSearch}>
        <Routes>
          <Route element={<Template />}>
            <Route path='/' element={<Home />}/>
            <Route path='/pokedex' element={<Pokedex />}/>
            <Route path='/pokecard' element={<Pokecard />}/>
          </Route>
          <Route path='*' element={<Notfound />}/>
        </Routes>
      </PokedexContext.Provider>
    </>
  )
}

export default App
