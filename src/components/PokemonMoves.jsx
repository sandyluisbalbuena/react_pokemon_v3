import React, { useEffect, useState } from 'react';

const PokemonMoves = (props) => {
	const [tableData, setTableData] = useState([]);


	const myTable = $('#myTable');


	function reinitializeDataTable() {
		if ($.fn.DataTable.isDataTable(myTable)) {
			$(myTable).DataTable().destroy();
		}

		console.log(myTable);
	}
	// reinitializeDataTable();

	if(tableData.length !== 125){
		reinitializeDataTable();
	}

	useEffect(() => {

		const initDataTable = () => {
	
		if ($.fn.DataTable.isDataTable(myTable)) {
			myTable.DataTable().destroy();
			}

		
			myTable.DataTable({
				language: {
				searchPlaceholder: 'Search Move',
				},
				responsive: true,
			});
		};
	
		if (tableData.length > 0) {
			console.log(tableData);
			initDataTable();
		}
	}, [tableData]);

	useEffect(() => {
		const fetchMovesData = async () => {

			try {
				const movesData = await Promise.all(
					props.moves.map((move) =>
						axios.get(`https://pokeapi.co/api/v2/move/${move.move.name}`)
					)
				);

				const updatedTableData = movesData.map((response) => {
					const moveData = response.data;
					const moveDescription = moveData.flavor_text_entries.find(
						(entry) => entry.language.name === 'en'
					);
					const newRowData = [
						moveData.name,
						moveData.accuracy,
						moveData.damage_class.name,
						moveData.power,
						moveData.pp,
						moveData.type.name,
						moveDescription?.flavor_text || '' 
					];
					return newRowData;
				});

				setTableData(updatedTableData);
			} catch (error) {
				console.error('Error fetching move data:', error);
			}
		};

		fetchMovesData();
	}, [props.moves]);

	function moveDescription(moveDescriptionData)
	{
		Swal.fire(moveDescriptionData)
	}

	return (
		<table id="myTable" className="display nowrap mb-3 pokedexTable">
			<thead>
				<tr>
				<th>Name</th>
				<th>Accuracy</th>
				<th>Power</th>
				<th>PP</th>
				<th>Type</th>
				</tr>
			</thead>
			<tbody>
				{tableData.map((row, index) => (
				<tr key={index}>
					<td>
					<button
						className="btn"
						style={{ width: '100%' }}
						onClick={() => moveDescription(row[6])}
					>
						{row[0].toUpperCase()}
					</button>
					</td>
					<td>{row[1]}</td>
					<td>{row[3]}</td>
					<td>{row[4]}</td>
					<td>
					<img
						src={`/assets/images/pokemonTypes/${row[5]}text.png`}
						alt="Pokemon Types"
						className='pokemonTypes'
					/>
					</td>
				</tr>
				))}
			</tbody>
		</table>
	);
};

export default PokemonMoves;
