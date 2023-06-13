import React, { useEffect, useRef } from 'react';

const PokemonRelated = (props) => {
  const splideRef = useRef(null);
  let splider = document.getElementById('splide1');

  if(splider!=null){
    splider.innerHTML = '';
  }

  function pokemonSearch(name){
    props.searchFunction(name);
  }

  useEffect(() => {
    if (props.related.length !== 0) {
      let newtyping = [];
      newtyping = props.related.map((type) => type.type.name);

      const pokemonrelatedtobutton = document.getElementById('pokemonrelatedtobutton');


      const handleClick = () => {
        get_pokemon_related(newtyping);
      };

      pokemonrelatedtobutton.addEventListener('click', handleClick);

      return () => {
        pokemonrelatedtobutton.removeEventListener('click', handleClick);
      };

    }
  }, [props.related]);

  function get_pokemon_related(pokemonTypes) {


    if (document.getElementById('pokemonrelatedtobutton').getAttribute('data-custom') === '0') {
      splider.innerHTML = `<div class="spinner-border spinner-border-sm mt-2" role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>`;
      document.getElementById('pokemonrelatedtobutton').innerHTML = 'HIDE';

      let perPage = 6;
      if (window.innerWidth <= 768) {
        perPage = 2;
      }

      if (splideRef.current && splideRef.current.Components.Elements.slides.length > 0) {
        splideRef.current.destroy();
        splider.innerHTML = '';
      }

      const splide = new Splide('.splide', {
        type: 'loop',
        perPage: perPage,
        focus: 'center',
        arrows: false,
        pagination: false,
        rewind: true,
        drag: 'free',
      }).mount();

      axios
        .get('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0')
        .then((response) => {
          let pokemons = response.data.results;

          pokemons.forEach((pokemon) => {
            axios
              .get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
              .then((response) => {
                let array1 = response.data.types.map((type) => type.type.name);
                let array2 = pokemonTypes;

                if (array1.some((item) => array2.includes(item))) {
                  let commonType = array1.filter((item) => array2.includes(item));

                  let newImg = document.createElement('img');
                  newImg.setAttribute('src', `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${response.data.id.toString().padStart(3, '0')}.png`);
                  newImg.setAttribute('width', '100px');
                  newImg.setAttribute('height', '100px');
                  newImg.addEventListener('click', ()=>{pokemonSearch(pokemon.name)});
                  newImg.className = 'hvr-float';

                  let newSlide = document.createElement('li');
                  newSlide.className = 'splide__slide';
                  newSlide.appendChild(newImg);
                  splide.add(newSlide);
                }

                document.getElementById('pokemonrelatedtobutton').setAttribute('data-custom', '1');
                document.getElementById('pokemonrelatedtobutton').innerHTML = 'HIDE';


              })
              .catch((error) => console.error('Error getting one pokemon:', error));
          });
        })
        .catch((error) => console.error('Error getting pokemon list:', error))
        .then(() => {
          document.getElementById('pokemonrelatedtobutton').setAttribute('data-custom', '1');
        });
    } else {
      document.getElementById('pokemonrelatedtobutton').setAttribute('data-custom', '0');
      document.getElementById('pokemonrelatedtobutton').innerHTML = 'SHOW';
      splider.innerHTML = '';
    }
  }

  return (
    <>
			<h6 className="card-title" id="relatedTo">Pokemon related to {props.pokemonName}</h6>
      <button id="pokemonrelatedtobutton" data-custom="0" className="btn btn-dark" type="button" data-mdb-toggle="collapse" data-mdb-target="#collapseExample1" aria-expanded="false" aria-controls="collapseExample1">
        Show
      </button>
      <hr/>
      <div className="collapse" id="collapseExample1">
        <div className="splide" id="splideRelated">
          <div className="splide__track">
            <ul className="splide__list" id="splide1">
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default PokemonRelated;
