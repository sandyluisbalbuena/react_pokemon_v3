//ILOVEXUXA

var loaderbackground = document.getElementById("preloader-background");
var preloader = document.getElementById("preloader");
getpokemondata(0,20)

// initiate splide
if (window.innerWidth <= 768) {
    var splide = new Splide( '.splide', {
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
    var splide = new Splide( '.splide', {
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


// window.addEventListener("load", function(){
    
// });


// fetch pokemon data
function getpokemondata(pokemonStart,pokemonEnd)
{
    let RAPIDAPI_API_URL = 'https://pokeapi.co/api/v2/pokemon?limit='+pokemonEnd+'&offset='+pokemonStart;

    axios.get(`${RAPIDAPI_API_URL}`)
    .then(response => {

        console.log(response.data.results);

        const pokemons = response.data.results;

        // https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/1x/'+pokemons[pokemonsname2d].name+'-s.png

        pokemons.forEach((pokemon) => {

            let newImg = document.createElement('img');
            // newImg.classList.add('col-xs-1'); 
            newImg.setAttribute('src', 'https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/1x/'+pokemon.name+'.png');
            // newImg.setAttribute('data-mdb-toggle', 'tooltip');
            newImg.setAttribute('title', pokemon.name);
            newImg.setAttribute('onclick', "showLoader()");

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
        // $(document).ready(function(){
            
            // setTimeout(resolve, 3000);  
        // });
        new Promise((resolve) => {
            loaderbackground.classList.add('animate__animated'); 
            loaderbackground.classList.add('animate__fadeOut');
            setTimeout(() => resolve(), 1000); // Delay execution by 3 seconds
        }).then(() => {
            loaderbackground.style.display = "none";
        });

    })
}

function dipatapos(){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Coming Soon!',
        footer: '<a href="">Why do I have this issue?</a>'
    })
}

