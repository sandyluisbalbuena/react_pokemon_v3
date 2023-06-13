import React, { useState } from 'react'

const PokemonAbilities = (props) => {

	let abilities = props.abilities;

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

	return (
		<>
		{
			abilities.map(ability=>(
				<button onClick={() => get_ablities_description(ability.ability.url)} style={{width:'100%'}} key={ability.ability.name} className="btn btn-dark m-1" type="button">{ability.ability.name}{(ability.is_hidden==true)?<span className='badge badge-secondary ms-2'>Hidden</span>:''}</button>
			))
		}
		</>
	)
}

export default PokemonAbilities