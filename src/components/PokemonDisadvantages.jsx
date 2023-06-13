import React, { useEffect, useState } from 'react'

const PokemonDisadvantages = (props) => {

	let [adv,setadv] = useState([]);

	useEffect(() => {
		setadv([]);
		props.pokemonTyping.forEach(type => {
			axios.get(type.type.url)
			.then(response => {
				response.data.damage_relations.double_damage_from.forEach(advantage => {
					setadv((prevAdv) => Array.from(new Set([...prevAdv, advantage.name])));
				});
			})
			.catch(error => console.error('On get one pokemon error', error))
			.then(() => { 
			})
		});
	}, [props.pokemonTyping]);

	return (
		<div>
			{adv.map(type=>(
				<img key={type} className="m-1" height="25px" src={`../assets/images/pokemonTypes/${type}text.png`} alt="Pokemon Types"/>
			))}
		</div>
	)
}

export default PokemonDisadvantages