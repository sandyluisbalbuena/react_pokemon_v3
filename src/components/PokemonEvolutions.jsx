import React, { useState } from 'react';

const PokemonEvolutions = (props) => {

  const [showEvolutions, setShowEvolutions] = useState(false);
  const [evolutionChain, setEvolutionChain] = useState([]);

	let evolutionButton = document.getElementById('evolutionButton');

  if(props.evolution.length != 0){
    axios.get(props.evolution.url)
    .then(response => {
      evolutionButton.addEventListener('click',()=>pokemon_evolution(response.data.evolution_chain.url))
    })
    .catch(error => console.error('On get one pokemon error', error));
  }

  function pokemonSearch(name){
    props.searchFunction(name);
  }

  function pokemon_evolution(pokemonEvolution) {

    if(!pokemonEvolution){
      return;
    }

    if (document.getElementById("evolutionButton").getAttribute('data-custom') === '0') {
      let EvolutionChainSection = document.getElementById('EvolutionChainSection');
      EvolutionChainSection.className = "text-center";
      EvolutionChainSection.innerHTML = `<div class="spinner-border spinner-border-sm mt-2" role="status">
                                          <span class="visually-hidden">Loading...</span>
                                        </div>`;
      axios.get(pokemonEvolution)
        .then(response => {
          new Promise((resolve) => {
            setTimeout(() => resolve(), 1000);
          }).then(() => {
            let chainEvo = [];
            chainEvo.push(response.data.chain.species.name + "__" + response.data.chain.species.url.replace('https://pokeapi.co/api/v2/pokemon-species/', ""));
            if (response.data.chain.evolves_to.length > 0) {
              response.data.chain.evolves_to.forEach(function (evolution) {
                chainEvo.push(evolution.species.name + "__" + evolution.species.url.replace('https://pokeapi.co/api/v2/pokemon-species/', ""));
                if (evolution.evolves_to.length > 0) {
                  evolution.evolves_to.forEach(function (evolution2) {
                    chainEvo.push(evolution2.species.name + "__" + evolution2.species.url.replace('https://pokeapi.co/api/v2/pokemon-species/', ""));
                  });
                }
              });
            }

            EvolutionChainSection.innerHTML = "";
            chainEvo.forEach(function (name) {
              // let nameAndId = name.replace('/', "");
              // nameAndId = nameAndId.split("__");
              // EvolutionChainSection.innerHTML += '<img onClick={pokemonSearch(`' + nameAndId[0] + '`)} class="hvr-float" width="150px" src="https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/' + nameAndId[1].toString().padStart(3, '0') + '.png">';
              let nameAndId = name.replace('/', '');
              nameAndId = nameAndId.split('__');
              const img = document.createElement('img');
              img.className = 'hvr-float img-pokemon'; // Add the "img-pokemon" class
              img.src = `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${nameAndId[1]
                .toString()
                .padStart(3, '0')}.png`;
              img.alt = nameAndId[0];
              img.addEventListener('click', () => pokemonSearch(nameAndId[0]));

              EvolutionChainSection.appendChild(img);
            });
          });
        })
        .catch(error => console.error('On get one pokemon error', error))
        .then(() => {
          document.getElementById("evolutionButton").innerHTML = "HIDE&nbsp;&nbsp;<i class='fas fa-angles-up'></i>";
          document.getElementById("evolutionButton").setAttribute('data-custom', '1');
        });
    } else {
      document.getElementById("evolutionButton").innerHTML = "SHOW&nbsp;&nbsp;<i class='fas fa-angles-down'></i>";
      document.getElementById("evolutionButton").setAttribute('data-custom', '0');
    }
  }

  return (
    <>
      <button id="evolutionButton" data-custom="0" className="btn btn-dark" type="button" data-mdb-toggle="collapse" data-mdb-target="#collapseExample2" aria-expanded="false" aria-controls="collapseExample2">
      {/* <button onClick={() => pokemon_evolution(props.evolution.url)} id="evolutionButton" data-custom="0" className="btn btn-dark" type="button" data-mdb-toggle="collapse" data-mdb-target="#collapseExample2" aria-expanded="false" aria-controls="collapseExample2"> */}
        Show&nbsp;&nbsp;<i className='fas fa-angles-down'></i>
      </button>
      <hr />
      <div className="collapse" id="collapseExample2">
        <div id="EvolutionChainSection"></div>
      </div>
    </>
  );
};

export default PokemonEvolutions;
