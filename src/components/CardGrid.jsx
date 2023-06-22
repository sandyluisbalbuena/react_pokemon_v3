import React, { useEffect } from "react";
import { Blurhash } from "react-blurhash";
import eventBus from "../eventBus";

const CardGrid = (props) => {
let iso;
const blurhash = "your-blurhash-goes-here";

useEffect(() => {
	iso = $(".grid").isotope({
	itemSelector: ".grid-item",
	layoutMode: "fitRows",
	});

	getOneCard(props.pokemonName);
}, []);

useEffect(() => {
	eventBus.subscribe("getonecard", getOneCard);

	return () => {
	eventBus.unsubscribe("getonecard", getOneCard);
	};
}, []);

const getOneCard = async (cardName) => {
	const myGrid = document.getElementById("myGrid");

	iso.isotope("destroy");
	myGrid.innerHTML = "";

	iso.isotope({
	itemSelector: ".grid-item",
	layoutMode: "fitRows",
	});

	try {
	const response = await axios.get(
		`https://api.pokemontcg.io/v1/cards?name=${cardName}`
	);

	const filterButtons = [];
	filterbtns.innerHTML = '';
	filterbtns.innerHTML = `<button id="All" type="button" class="btn btn-dark text-sm btn-filter-cards">ALL</button>`;

	response.data.cards.forEach((pokecard) => {
		if (pokecard.rarity) {
		const rarityClass = pokecard.rarity
			.toUpperCase()
			.trim()
			.replace(/\s/g, "")
			.replace(/[\s~`!@#$%^&*()\-_=+[\]{}|;:'",.<>/?\\]/g, "");

		const $newItems = $(`
			<div id="${pokecard.id}" class="grid-item card-img-forSearch ${rarityClass}">
			<Blurhash
				hash="${blurhash}"
				width={400}
				height={300}
				resolutionX={32}
				resolutionY={32}
				punch={1}
			/>
			<img
				class="lazyload"
				loading="lazy"
				src="${pokecard.imageUrlHiRes}"
				data-src="${pokecard.imageUrlHiRes}"
				width="100%"
				alt="${pokecard.id}"
			/>
			</div>
		`);

		iso.append($newItems).isotope("appended", $newItems);

		if (
			!filterButtons.includes(rarityClass) &&
			rarityClass !== "" &&
			rarityClass !== undefined
		) {
			filterbtns.innerHTML += `
			<button id="${rarityClass}" type="button" class="btn btn-dark text-sm btn-filter-cards">${pokecard.rarity}</button>
			`;
			filterButtons.push(rarityClass);
		}
		}
	});

	const buttonFilters = [...document.getElementsByClassName("btn-filter-cards")];
	buttonFilters.forEach((buttonFilter) => {
		buttonFilter.addEventListener("click", () => multiFilter(buttonFilter.id));
	});

	const cardImgForSearch = [...document.getElementsByClassName("card-img-forSearch")];
	cardImgForSearch.forEach((cardInfo) => {
		cardInfo.addEventListener("click", () => searchThisCard(cardInfo.id));
	});

	setTimeout(function() {
		iso.isotope({ filter: "*" });
	}, 1000);
	} catch (error) {
	console.error("Error fetching cards", error);
	}
};

function searchThisCard(cardId) {
	eventBus.publish("getDataOneCard", cardId);
}

function multiFilter(filter) {
	if (filter === "All") {
	iso.isotope({ filter: "*" });
	} else {
	iso.isotope({ filter: `.${filter}` });
	}
}

return (
	<>
	<div className="row my-4" id="filterbtnrow">
		<div className="btn-group bg-dark" role="group" aria-label="Basic example" id="filterbtns"></div>
	</div>

	<div className="row my-5" id="gridrow">
		<div className="grid" id="myGrid"></div>
	</div>
	</>
);
};

export default CardGrid;
