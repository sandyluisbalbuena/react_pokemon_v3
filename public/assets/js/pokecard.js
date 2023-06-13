var loaderbackground = document.getElementById("preloader-background");
var table = $('#myTable').DataTable();
var table2 = $('#myTable2').DataTable({
    searching:false,
    paging:false,
    info: false
});

let pokemonName;
let forThread;

var cardId;


var urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('id')) {
    cardId = urlParams.get('id');

    getDataOneCard(cardId);
}

function getDataOneCard(Id){
    axios.get(`https://api.pokemontcg.io/v1/cards?id=`+Id)
    .then(response => {
        // console.log(response.data.cards);
        forCardView(response.data.cards[0]);
    })
    .catch(error => console.error('On get one pokemon card error', error))
    .then(() => { 

    })
}



var iso = $('.grid').isotope({
	itemSelector: '.grid-item',
	layoutMode: 'fitRows'
});

var myGrid = document.getElementById("myGrid");

function handleKeyPress(event) {
    if (event.keyCode === 13) {
        getonecard();
    }
}

let filterbtns = document.getElementById('filterbtns');

if(cardId == undefined){
    getonecard();
    getDataOneCard('swsh45sv-SV107');
}

function getonecard(){

    pokemonName = document.getElementById('pokemonName').value;

    iso.isotope('destroy');
    myGrid.innerHTML = "";


    iso = $('.grid').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows'
    });

	table.destroy();

    let myTable = document.getElementById("myTable");
    let tbody = myTable.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";

	table = $('#myTable').DataTable( {
		// rowReorder: {
		//     selector: 'td:nth-child(2)'
		// },
		responsive: true,
        // searching:false
        language: {
			searchPlaceholder: 'Filter'
		},
	} );

	axios.get(`https://api.pokemontcg.io/v1/cards?name=`+pokemonName)
    .then(response => {

        // forCardView(response.data.cards[0]);


        pokemonName.value="";

        let filterbuttons = [];

        filterbtns.innerHTML = `<button type="button" class="btn btn-dark text-sm" onclick="multiFilter('*')">ALL</button>`;

        response.data.cards.forEach(function(pokecard){


            // console.log(pokecard);




            if(pokecard.rarity != undefined){

                // let cardData = JSON.parse(jsonString.replace(/'/g, ''));


                let $newItems = $(`<div class="grid-item `+pokecard.rarity.toUpperCase().trim().replace(/\s/g, '').replace(/[\s~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\]/g, '')+`"><img onclick='forCardView(`+JSON.stringify(pokecard).replace(/'/g, '')+`)' src="`+pokecard.imageUrlHiRes+`" width="100%"/></div>`); // Replace with your desired HTML for the new item
                iso.append($newItems).isotope('appended', $newItems);
    
                if(!filterbuttons.includes(pokecard.rarity.toUpperCase().trim().replace(/\s/g, '').replace(/[\s~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\]/g, '')) && pokecard.rarity.toUpperCase().trim().replace(/\s/g, '').replace(/[\s~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\]/g, '') != '' && pokecard.rarity.toUpperCase().trim().replace(/\s/g, '').replace(/[\s~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\]/g, '') != undefined){
    
                    filterbtns.innerHTML += `<button type="button" class="btn btn-dark text-sm" onclick="multiFilter('.`+pokecard.rarity.toUpperCase().trim().replace(/\s/g, '').replace(/[\s~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\]/g, '')+`')">`+pokecard.rarity+`</button>`;
                    filterbuttons.push(pokecard.rarity.toUpperCase().trim().replace(/\s/g, '').replace(/[\s~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\]/g, ''));
                    
                }
            }



            // let newImg = document.createElement('img');
            // newImg.setAttribute('src', pokecard.imageUrlHiRes);
            // newImg.setAttribute('width', '90%');
            // // newImg.setAttribute('style', 'opacity:0;');
            // newImg.className = 'cardloader';

            // // newImg.setAttribute('id', pokecard.id);
            // // newImg.setAttribute('onclick', 'getonepokemondata("'+response.data.name+'")');
            // newImg.setAttribute('onclick', 'forCards("'+pokecard.imageUrlHiRes+'")');
            // // newImg.className = 'hvr-grow';

            // let newSlide = document.createElement('li');
            // newSlide.className = 'splide__slide';
            // newSlide.className = 'text-center';

            // newSlide.appendChild(newImg);
            // splideCards.add(newSlide);





			var newRowData = [pokecard.id, pokecard.imageUrlHiRes, pokecard.name, pokecard.rarity?pokecard.rarity:"", pokecard.set?pokecard.set:""];
			// var newRowData = [pokecard.id, pokecard.ImageUrlHiRes, pokecard.name, pokecard.set, pokecard.types];
            var newRow = table.row.add(newRowData).draw().node();

            // let moveDescriptiontobeuse = "";

            // response.data.flavor_text_entries.forEach(function(move){
            //     if(move.language.name=='en')
            //     {
            //         moveDescriptiontobeuse = move.flavor_text;
            //     }
            // })


            // $(newRow).find('td:eq(0)').html('<a class="btn" onclick="moveDescription(`'+moveDescriptiontobeuse+'`)" style="width:100%;">' + newRowData[0] + '</a>');
            $(newRow).find('td:eq(1)').html(`<img onclick='forCardView(`+JSON.stringify(pokecard).replace(/'/g, '')+`)' src="`+newRowData[1]+`" style="width:20%; cursor:pointer" >`);


        })


        // images = document.getElementsByClassName("pokecard");

        


    })
    .catch(error => console.error('On get one pokemon card error', error))
    .then(() => { 

        // function multiFilter(filter){
            // iso.isotope({ filter: '*' })
        // }

        setTimeout(function() {
            iso.isotope({ filter: '*' })
            // console.log(filterbuttons);

        }, 500);

        // console.log(images);
        // Array.from(images).forEach(function(image) {
        //     image.addEventListener("load", function() {
        //       this.style.display = "block";
        //     });
        // });

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

function multiFilter(filter){
	iso.isotope({ filter: filter })
}

let tablerow = document.getElementById('tablerow');
let gridrow = document.getElementById('gridrow');
let filterbtnrow = document.getElementById('filterbtnrow');
let listbtn = document.getElementById('listbtn');
let gridbtn = document.getElementById('gridbtn');


function tableshow(){
    getonecard();
    tablerow.classList.remove('d-none');
    gridrow.classList.add('d-none');
    filterbtnrow.classList.add('d-none');
    gridbtn.removeAttribute('disabled');
    listbtn.setAttribute('disabled', '');
}

function gridshow(){
    getonecard();
    tablerow.classList.add('d-none');
    gridrow.classList.remove('d-none');
    filterbtnrow.classList.remove('d-none');
    gridbtn.setAttribute('disabled', '');
    listbtn.removeAttribute('disabled');
}

function forCardView(cardData){
	table2.destroy();

    console.log(cardData);

    forThread = cardData;


    let myTable2 = document.getElementById("myTable2");
    let tbody2 = myTable2.getElementsByTagName("tbody")[0];
    tbody2.innerHTML = "";

	table2 = $('#myTable2').DataTable( {
		responsive: true,
        searching:false,
        paging:false,
        info: false
	} );

    let cardName = document.getElementById('cardName');
    let cardImage = document.getElementById('cardImage');
    let cardType = document.getElementById('cardType');
    let cardWeakness = document.getElementById('cardWeakness');
    let cardRetreatCost = document.getElementById('cardRetreatCost');
    let cardResistance = document.getElementById('cardResistance');
    let cardHp = document.getElementById('cardHp');
    let abilityDescription = document.getElementById('abilityDescription');
    let abilityName = document.getElementById('abilityName');
    let textInfo = document.getElementById('textInfo');
    let attackName="";

    cardName.innerHTML = cardData.name;

    cardImage.innerHTML = '<img id="tobeZoom" class="rounded" width="100%" src="'+cardData.imageUrlHiRes+'" />';
    // cardImage.setAttribute('onmouseover','showResult()');
    // cardImage.setAttribute('onmouseout','hideResult()');
    
    cardType.innerHTML = "";
    cardWeakness.innerHTML = "";
    cardRetreatCost.innerHTML = "";
    cardResistance.innerHTML = "";
    cardHp.innerHTML = "";
    abilityName.innerHTML = "";
    abilityDescription.innerHTML = "";
    textInfo.innerHTML = "";

    // document.getElementById('tobeZoom').addEventListener("mouseenter", showResult);
    // document.getElementById('tobeZoom').addEventListener("mouseleave", hideResult);

    if('text' in cardData){
        textInfo.innerHTML = cardData.text;
    }

    if('ability' in cardData){
        abilityName.innerHTML = cardData.ability.name;
        abilityDescription.innerHTML = cardData.ability.text;
    }

    if('types' in cardData){
        cardType.innerHTML = '<img class="rounded" width="40px" src="/assets/images/pokemonCardTypes/'+cardData.types[0]+'.png" />';
    }

    if('weaknesses' in cardData){
        cardData.weaknesses.forEach(weakness => {
            cardWeakness.innerHTML += '<span class="d-flex"><img class="rounded" width="40px" src="/assets/images/pokemonCardTypes/'+weakness.type+'.png" /><p>&nbsp;&nbsp;'+weakness.value+'</p></span><br/>';
        });
    }

    if('retreatCost' in cardData){
        cardData.retreatCost.forEach(retreat => {
            cardRetreatCost.innerHTML += '<img class="rounded" width="40px" src="/assets/images/pokemonCardTypes/'+retreat+'.png" />';
        });
    }

    if('resistances' in cardData){
        cardData.resistances.forEach(resistance => {
            cardResistance.innerHTML += '<span class="d-flex"><img class="rounded" width="40px" src="/assets/images/pokemonCardTypes/'+resistance.type+'.png" /><p>&nbsp;&nbsp;'+resistance.value+'</p></span><br/>';
        });
    }

    if('hp' in cardData){
        cardHp.innerHTML = cardData.hp+ " HP";
    }

    if('attacks' in cardData){
        cardData.attacks.forEach(attack => {
            let cost="";
            attack.cost.forEach(ct => {
                if(ct != "Free"){
                    cost += '<img width="35px" class="me-1" src="/assets/images/pokemonCardTypes/'+ct+'.png"/>';
                }
            });
            attackName = '<button style="width:100%;" onclick="attackDescription(`'+attack.text+'`)" class="btn btn-dark bg-dark">'+attack.name+'</button>';
            let newRowData = [attackName, cost, attack.damage];
            table2.row.add(newRowData).draw().node();
        });
    }

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    setTimeout(function() {
        imageZoom("tobeZoom", "myresult");
    }, 100);
}


function attackDescription(attackDesc){

    if(attackDesc == "" || attackDesc == undefined){
        attackDesc = "No description.";
    }

    Swal.fire({
        icon:'info',
        html: '<p>'+attackDesc+'</p>',
    })

}

function imageZoom(imgID, resultID) {
    let img, lens, result, cx, cy;
    img = document.getElementById(imgID);
    result = document.getElementById(resultID);
    /*create lens:*/
    lens = document.createElement("DIV");
    lens.setAttribute("class", "img-zoom-lens");
    /*insert lens:*/

    let lensSize = 75;

    lens.style.width = lensSize + "px";
    lens.style.height = lensSize + "px";


    img.parentElement.insertBefore(lens, img);
    /*calculate the ratio between result DIV and lens:*/
    // cx = result.offsetWidth / lens.offsetWidth;
    // cy = result.offsetHeight / lens.offsetHeight;
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    /*set background properties for the result DIV:*/
    result.style.backgroundImage = "url('" + img.src + "')";

    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";

    // result.style.display = "none";

    /*execute a function when someone moves the cursor over the image, or the lens:*/
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /*and also for touch screens:*/
    // lens.addEventListener("touchmove", moveLens);
    // img.addEventListener("touchmove", moveLens);

    /* Show the result DIV on hover */
    // window.addEventListener("scroll", resizeLens);
    


    function moveLens(e) {
    // result.style.display = "block";
        // e.preventDefault();
        var pos, x, y;
        /*prevent any other actions that may occur when moving over the image:*/
        e.preventDefault();
        /*get the cursor's x and y positions:*/
        pos = getCursorPos(e);
        /*calculate the position of the lens:*/
        x = pos.x - (lens.offsetWidth / 2);
        y = pos.y - (lens.offsetHeight / 2);
        /*prevent the lens from being positioned outside the image:*/
        if (x > img.width - lens.offsetWidth) {
            x = img.width - lens.offsetWidth;
        }
        if (x < 0) {
            x = 0;
        }
        if (y > img.height - lens.offsetHeight) {
            y = img.height - lens.offsetHeight;
        }
        if (y < 0) {
            y = 0;
        }
        /*set the position of the lens:*/
        lens.style.left = x + "px";
        lens.style.top = y + "px";
        /*display what the lens "sees":*/
        result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    }

    function getCursorPos(e) {
        var a, x = 0,
            y = 0;
        e = e || window.event;
        /*get the x and y positions of the image:*/
        a = img.getBoundingClientRect();
        /*calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /*consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return {
            x: x,
            y: y
        };
    }

    // function resizeLens(e) {
    //     e.preventDefault();

    //     var lensSizeOnScroll = calculateLensSizeOnScroll();
    //     lens.style.width = lensSizeOnScroll + "px";
    //     lens.style.height = lensSizeOnScroll + "px";
    // }
    
    // function calculateLensSizeOnScroll() {

    //     console.log('wew');
    //     // Adjust the lens size based on your desired logic for scrolling
    //     // For example, you can reduce the lens size by a fixed value when scrolling occurs
    //     var scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
    //     var newLensSize = lensSize - scrollOffset * 1; // Adjust the factor as needed
    //     return Math.max(newLensSize, 0); // Ensure the lens size is never negative
    // }

    
}

function showResult() {
    // document.getElementById('myresult').setAttribute("visible", "true");
    document.getElementById('myresult').style.visibility = "";
    // document.getElementById('myresult').classList.add("showZoom");
}

function hideResult() {
    // document.getElementById('myresult').setAttribute("visible", "false");
    document.getElementById('myresult').style.visibility = "hidden";
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

function createThreadCard(){

    document.getElementById('category').value = 2;
    document.getElementById('category').setAttribute('disabled', '');

    // console.log(forThread);
    // tinymce.setContent('');
    tinymce.execCommand('setContent', false, ``);

    

    tinymce.execCommand('mceInsertContent', false, `<img  class="rounded cardForThread" src="`+forThread.imageUrlHiRes+`">
                                                        <h6>
                                                        `+
                                                        forThread.name
                                                        +` 
                                                        </h6>
                                                    `);
}

