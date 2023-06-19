import React, { useEffect } from 'react'
import eventBus from '../eventBus';
import queryString from 'query-string';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

let dataForCardThread = [];

const CardInfo = () => {

	useEffect(()=>{
		const parsed = queryString.parse(window.location.search);
		var cardTobeSearchFromUrl = parsed.cardId;


		if(cardTobeSearchFromUrl == undefined && cardTobeSearchFromUrl == null){
			getDataOneCard('swsh45sv-SV107');
		}
		else{
			getDataOneCard(cardTobeSearchFromUrl);
		}
		
	}, []);

	useEffect(() => {
		eventBus.subscribe('getDataOneCard', getDataOneCard);

		return () => {
			eventBus.unsubscribe('getDataOneCard', getDataOneCard);
		};
	}, []);

	const getDataOneCard = (Id) => {
		axios.get(`https://api.pokemontcg.io/v1/cards?id=`+Id)
		.then(response => {
			// console.log(response.data.cards);
			forCardView(response.data.cards[0]);
		})
		.catch(error => console.error('On get one pokemon card error', error))
		.then(() => { 
	
		})
	}

	// var table2 = $('#myTable2').DataTable({
	// 	searching:false,
	// 	paging:false,
	// 	info: false
	// });

	const [user] = useAuthState(firebase.auth());
	var table2;

	function getAttackDescription(attackName) {

		if(!attackName){
			return "No info";
		}

		return attackName;
	}

	function forCardView(cardData){

		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});

		if(table2){
			table2.destroy();
		}
	
		let myTable2 = document.getElementById("myTable2");
		let tbody2 = myTable2.getElementsByTagName("tbody")[0];
		tbody2.innerHTML = "";
	
		table2 = $('#myTable2').DataTable( {
			responsive: true,
			searching:false,
			paging:false,
			info: false,
			columns: [
				{
				title: 'Name',
				width: '30%',
				render: function (data) {
					return data;
				},
				},
				{ 
					title: 'Damage', 
					width: '30%', 
					render: function (data) {
					return data;
				}, },
				{ 
					title: 'Cost', 
					width: '40%', 
					render: function (data) {
						return data;
					},	
				},
			],
		} );

		$('#myTable2 tbody').on('click', 'button', function () {
			const attackName = $(this).data('attack-description');
			const attackDesc = getAttackDescription(attackName);
			Swal.fire({
				icon: 'info',
				html: `<p>${attackDesc}</p>`,
			});
		});
	
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

		dataForCardThread[0] = cardData.name;
		dataForCardThread[1] = cardData.imageUrlHiRes;
	
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
			cardType.innerHTML = '<img class="rounded cardIconTypes" width="40px" src="./assets/images/pokemonCardTypes/'+cardData.types[0].toLowerCase()+'.png" />';
		}
	
		if('weaknesses' in cardData){
			cardData.weaknesses.forEach(weakness => {
				cardWeakness.innerHTML += '<span class="d-flex"><img class="rounded cardIconTypes" width="40px" src="./assets/images/pokemonCardTypes/'+weakness.type.toLowerCase()+'.png" /><p>&nbsp;&nbsp;'+weakness.value+'</p></span><br/>';
			});
		}
	
		if('retreatCost' in cardData){
			cardData.retreatCost.forEach(retreat => {
				cardRetreatCost.innerHTML += '<img class="rounded cardIconTypes" width="40px" src="./assets/images/pokemonCardTypes/'+retreat.toLowerCase()+'.png" />';
			});
		}
	
		if('resistances' in cardData){
			cardData.resistances.forEach(resistance => {
				cardResistance.innerHTML += '<span class="d-flex"><img class="rounded cardIconTypes" width="40px" src="./assets/images/pokemonCardTypes/'+resistance.type.toLowerCase()+'.png" /><p>&nbsp;&nbsp;'+resistance.value+'</p></span><br/>';
			});
		}
	
		if('hp' in cardData){
			cardHp.innerHTML = cardData.hp+ " HP";
		}
	
		if ('attacks' in cardData) {
			cardData.attacks.forEach(attack => {
				let cost = "";
				attack.cost.forEach(ct => {
					if (ct != "Free") {
					cost += '<img class="me-1 cardIconTypes" src="./assets/images/pokemonCardTypes/' + ct.toLowerCase() + '.png"/>';
					}
				});
				attackName = `<button style="width:100%;" data-attack-description="`+attack.text+`" class="btn btn-dark bg-dark">${attack.name}</button>`;
				let newRowData = [attackName, attack.damage, cost];
				table2.row.add(newRowData).draw().node();
			});
		}
	
		
	
		setTimeout(function() {
			imageZoom("tobeZoom", "myresult");
		}, 100);
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
		document.getElementById('myresult').style.setProperty('visibility', 'visible', 'important');
	}
	
	function hideResult() {
		// console.log('wewwew');
		// document.getElementById('myresult').setAttribute("visible", "false");
		document.getElementById('myresult').style.visibility = "hidden";
	}

	const handleCreateThreadPokecard = () => {
		eventBus.publish('pokecardCreateThread',dataForCardThread);
	}

	return (
		<>
		<div className="navbar navbar-dark bg-dark rounded cardNav">
			<h6 id="cardName" className="ms-3 text-white"></h6>
			<div className="me-3 d-flex leftNavCard">
				<h6 id="cardHp" className="me-3 text-white"></h6>
				<div id="cardType" className="me-3"></div>
			</div>
		</div>	

		<div className="row my-4 px-4">
			<div className="col-12 col-lg-3">

				<div id="cardImage"  onMouseOver={()=>showResult()} onMouseOut={()=>hideResult()}  className="img-zoom-container">
				</div>

				{user ? (
				<button style={{width:'100%'}} onClick={handleCreateThreadPokecard} className="mt-3 btn btn-dark" data-mdb-toggle="modal" data-mdb-target="#postThread">
					<i className="far fa-pen-to-square me-1"></i>
					Create a thread
				</button>
				) : (
				''
				)}

			</div>

			<div className="col-12 col-lg-9">
				
				<div className="row">
					<div id="myresult" className="img-zoom-result rounded"></div>
					<div id="cardTyping">
						<h6>Attack(s)</h6>
						<table id="myTable2" className="display nowrap mb-3 table-sm">
							<thead>
								<tr>
									<th>Name</th>
									<th>Damage</th>
									<th>Cost</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div className="row">
					<h6 id="abilityName"></h6>
					<p id="abilityDescription"></p>
				</div>

				<div className="row">
					<p id="textInfo"></p>
				</div>

				<div className="cardFooter mt-5">
					<div className="row mt-5">
						<div className="col-12 col-lg-4">
							<h6>Weakness</h6>
							<div id="cardWeakness"></div>
						</div>
						<div className="col-12 col-lg-4">
							<h6>Resistance</h6>
							<div id="cardResistance"></div>
						</div>
						<div className="col-12 col-lg-4">
							<h6>Retreat Cost</h6>
							<div id="cardRetreatCost"></div>
						</div>
					</div>
				</div>

			</div>
		</div>
		</>

	)
}

export default CardInfo