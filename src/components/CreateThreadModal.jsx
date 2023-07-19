import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import eventBus from '../eventBus';
import { useNavigate } from 'react-router-dom';

let redirectToThread = false;


const CreateThreadModal = () => {
	const [user] = useAuthState(firebase.auth());
	const navigate = useNavigate();
	const [categories, setCategories] = useState([]);
	let [editFunction, setEditFunction] = useState(false);
	let [postFunction, setPostFunction] = useState(true);
	let [threadIDToBeEdit, setthreadIDToBeEdit] = useState('');

	useEffect(() => {
		const fetchCategories = async () => {
		try {
			const snapshot = await firebase.database().ref('categories').once('value');
			const categoriesData = snapshot.val();
			if (categoriesData) {
			const categoriesArray = Object.entries(categoriesData).map(([key, value]) => ({
				id: key,
				name: value.name,
			}));
			setCategories(categoriesArray);
			}
		} catch (error) {
			// Handle error here
			console.error('Error fetching categories:', error);
		}
		};
	
		fetchCategories();
	}, []);

	useEffect(()=>{

		tinymce.init({
			selector: 'textarea#summernote',
			height: 350,
			toolbar: 'undo redo | blocks | ' +
			'bold italic backcolor | alignleft aligncenter ' +
			'alignright alignjustify | bullist numlist outdent indent | ' +
			'removeformat | help',
			content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
			image_class_list: [
			{ title: 'Small', value: 'custom-small' },
			{ title: 'Medium', value: 'custom-medium' },
			{ title: 'Large', value: 'custom-large' }
			],
			image_dimensions: true,
		});


		eventBus.subscribe('pokeforumCreateThread', pokeforumCreateThread);
		eventBus.subscribe('pokedexCreateThread', pokedexCreateThread);
		eventBus.subscribe('pokecardCreateThread', pokecardCreateThread);
		eventBus.subscribe('editThread', editThread);

		return () => {
			eventBus.unsubscribe('pokeforumCreateThread', pokeforumCreateThread);
			eventBus.unsubscribe('pokedexCreateThread', pokedexCreateThread);
			eventBus.unsubscribe('pokecardCreateThread', pokecardCreateThread);
			eventBus.unsubscribe('editThread', editThread);
		};	

	}, [])

	const pokedexCreateThread = (data) => {
		document.getElementById('category').value = '-NY09vnKnlq-rP_dYN7L';
		document.getElementById('title').value = data.name.toUpperCase();
		document.getElementById('category').setAttribute('disabled', '');

		let descriptionForThreadPokedex;

		redirectToThread = true;

		setPostFunction(true);
		setEditFunction(false);
		let editor = tinymce.get('summernote');
		editor.setContent('');

		axios
		.get(data.url)
		.then((response) => {
			response.data.flavor_text_entries.forEach((description) => {
			if (description.language.name === 'en') {
				descriptionForThreadPokedex = description.flavor_text;
			}
			});

			tinymce.execCommand('mceInsertContent', false, `<img  class="rounded cardForThread" src="https://img.pokemondb.net/artwork/avif/`+data.name.toLowerCase()+`.avif">
                                                        <h4>
                                                        `+
                                                        data.name.toUpperCase()
                                                        +` 
                                                        </h4>
														<p>
                                                        `+
                                                        descriptionForThreadPokedex
                                                        +` 
                                                        </p>
                                                    `);

		})
		.catch((error) => console.error('Error fetching Pokemon data', error));
	}

	const pokeforumCreateThread = () => {
		document.getElementById('category').value = '';
		document.getElementById('title').value = '';


		redirectToThread = true;

		setPostFunction(true);
		setEditFunction(false);
		let editor = tinymce.get('summernote');
		editor.setContent('');

		
	}

	const pokecardCreateThread = (data) => {
		document.getElementById('category').value = '-NY09qsAZhynFQBPXtMI';
		document.getElementById('category').setAttribute('disabled', '');
		document.getElementById('title').value = '';


		redirectToThread = true;
		setEditFunction(false);
		setPostFunction(true);
		let editor = tinymce.get('summernote');
		editor.setContent('');


		tinymce.execCommand('mceInsertContent', false, `<img  class="rounded cardForThread" src="`+data[1]+`">
                                                        <h6>
                                                        `+
                                                        data[0]
                                                        +` 
                                                        </h6>
                                                    `);
	}

	const editThread = (data) => {
		document.getElementById('category').value = data.categoryId;
		document.getElementById('category').setAttribute('disabled', '');
		document.getElementById('title').value = data.title;
		let editor = tinymce.get('summernote');
		editor.setContent('');
		redirectToThread = true;
		tinymce.execCommand('mceInsertContent', false, data.content);
		setthreadIDToBeEdit(data.threadId);

		// functionToDo = 'edit';
		setPostFunction(false);
		setEditFunction(true);
	}

	function slugify(str) {
		str = str.toString().replace(/^\s+|\s+$/g, ''); // Trim leading/trailing white spaces
		str = str.toLowerCase(); // Convert to lowercase
		str = str.replace(/[^a-z0-9-]/g, '-'); // Replace non-alphanumeric characters with dashes
		str = str.replace(/-+/g, '-'); // Replace multiple consecutive dashes with a single dash
		return str;
	}

	// if(firebase.auth().currentUser){

	// 	let currentUser = firebase.auth().currentUser;
	// 	let bearerToken = localStorage.getItem('bearerToken');

	// 	axios.get('http://127.0.0.1:8000/api/threads', {
	// 	headers: {
	// 		'X-User-Uid': currentUser.uid,
	// 		'Authorization': `Bearer ${bearerToken}`,
	// 	},
	// 	})
	// 	.then(response => {
	// 		console.log(response.data);
	// 	})
	// 	.catch(error => {
	// 		// Handle errors
	// 	});
	// }

	const randomTitleGenerator = () => {
		const pokemon = ['Pikachu', 'Charizard', 'Mewtwo', 'Eevee', 'Gyarados'];
		const actions = ['Adventure', 'Battles', 'Quest', 'Journey', 'Challenges'];
		const uniqueId = Date.now().toString(36); // Unique identifier based on the current timestamp
		
		const randomPokemon = pokemon[Math.floor(Math.random() * pokemon.length)];
		const randomAction = actions[Math.floor(Math.random() * actions.length)];
		
		return `${randomPokemon} ${randomAction} ${uniqueId}`;
	};

	const randomContentGenerator = () => {
		const phrases = [
		'Pokémon are creatures with unique abilities.',
		'Trainers catch and train Pokémon for battles.',
		'Pikachu is one of the most famous Pokémon.',
		'Eevee can evolve into multiple different forms.',
		'Charizard is a powerful Fire and Flying type Pokémon.',
		'The goal is to become a Pokémon Master.',
		'Team Rocket is a notorious group of Pokémon thieves.',
		'Legendary Pokémon possess extraordinary powers.',
		'Gotta catch \'em all!',
		'Pokémon battles take place in Pokémon Gyms.',
		'The Pokémon League is the ultimate challenge for trainers.',
		'Pokémon trainers use Poké Balls to catch wild Pokémon.',
		'Pokédex is a digital encyclopedia of Pokémon species.',
		'Ash Ketchum is the protagonist of the Pokémon anime.',
		'Pokémon TCG is a popular trading card game.',
		'Pokémon Go is a mobile game that uses augmented reality.',
		'Jigglypuff is known for its lullaby that puts others to sleep.',
		'Mewtwo is a genetically engineered Pokémon.',
		'Gyarados is a powerful Water and Flying type Pokémon.',
		'Bulbasaur is a Grass and Poison type starter Pokémon.',
		'The world of Pokémon is filled with excitement and adventure.',
		'Pokémon trainers form deep bonds with their Pokémon partners.',
		];
	
		const contentLength = Math.floor(Math.random() * (50 - 20 + 1) + 20); // Random length between 20 and 50 words
		const selectedPhrases = [];
	
		while (selectedPhrases.join(' ').split(' ').length < contentLength) {
		const randomIndex = Math.floor(Math.random() * phrases.length);
		const selectedPhrase = phrases[randomIndex];
		if (!selectedPhrases.includes(selectedPhrase)) {
			selectedPhrases.push(selectedPhrase);
		}
		}
	
		return selectedPhrases.join(' ');
	};

	const randomUidGenerator = () => {
		
	};
	

	function createThread() {

		const threadRef = firebase.database().ref('threads');
		const date = new Date('July 18, 2023 13:31:43');
		const timestamp = date.getTime();
		let categoriespick = ['-NY09qsAZhynFQBPXtMI', '-NY09vnKnlq-rP_dYN7L'];
		let randomCategory = categoriespick[Math.floor(Math.random() * categoriespick.length)];
		let randomTitle = randomTitleGenerator();
		let randomSlug = slugify(randomTitle);
		let randomContent = randomContentGenerator();

		const userRef = firebase.database().ref('users');
		userRef.once('value')
		.then(snapshot => {
			const uids = Object.keys(snapshot.val()); // Convert user UIDs into an array
			const randomIndex = Math.floor(Math.random() * uids.length); // Generate a random index
			const randomUserUid =  uids[randomIndex]; // Get the random user UID

			const formData = {
				categoryId: randomCategory,
				title: randomTitle,
				slug: randomSlug,
				content: randomContent,
				userId: randomUserUid,
				createdAt: timestamp,
				updatedAt: timestamp,
			};

			threadRef.push(formData)

		})
		.catch(error => {
			console.error(error);
		});
	}

	function createThreadLaravel() {

		const category = document.getElementById('category').value;
		const title = document.getElementById('title').value;
		const content = tinymce.activeEditor.getContent();
		let currentUser = firebase.auth().currentUser;
		let bearerToken = localStorage.getItem('bearerToken');

		if (title === '' || content === '') {
			Swal.fire({
			icon: 'error',
			title: 'All fields are required!',
			});
			return;
		}

		const formData = {
			categoryId: category,
			title: title,
			slug: slugify(title),
			content: content,
			userId: user.uid,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};

		// const url = 'http://127.0.0.1:8000/api/thread';
		const url = 'https://pok3mon.online/api/thread';

		axios
		.post(url, formData, {
			headers: {
				'X-User-Uid': currentUser.uid,
				'Authorization': `Bearer ${bearerToken}`,
			},
		})
		.then((response) => {
		// Handle successful response
			// console.log(response.data);
			$('#postThread').modal('hide');
			Swal.fire({
				icon: 'success',
				title: 'Thread created successfully',
			});
		})
		.catch((error) => {
			// Handle error
			Swal.fire({
				icon: 'error',
				title: 'Error creating thread',
				text: error.message,
			});
		})
		.finally(() => {
			category.value = '';
			title.value = '';
			tinymce.activeEditor.setContent('');
			document.getElementById('category').removeAttribute('disabled');
			if(redirectToThread){
				navigate('pokeforum/'+slug);
			}
		});

	}

	function editedThread(id) {
		const category = document.getElementById('category');
		const title = document.getElementById('title');
		const slug = slugify(title.value);

		if(title.value == '' || tinymce.activeEditor.getContent() == ''){
			Swal.fire({
				icon: 'error',
				title: 'All fields are required!',
			});
			return
		}
	
		const threadRef = firebase.database().ref('threads/' + id); // Update the reference to include the thread ID
	
		// Check if the updated title already exists
		threadRef
			.orderByChild('title')
			.equalTo(title.value)
			.once('value')
			.then((snapshot) => {
				if (snapshot.exists() && snapshot.key !== id) { // Exclude the current thread from the check
					Swal.fire({
						icon: 'error',
						title: 'Title already exists!',
					});
					return;
				}
	
				// Check if the updated slug already exists
				return threadRef
					.orderByChild('slug')
					.equalTo(slug)
					.once('value');
			})
			.then((slugSnapshot) => {
				if (slugSnapshot.exists() && slugSnapshot.key !== id) { // Exclude the current thread from the check
					Swal.fire({
						icon: 'error',
						title: 'Slug already exists!',
					});
					return;
				}
	
				const formData = {
					categoryId: category.value,
					title: title.value,
					slug: slug,
					content: tinymce.activeEditor.getContent(),
					updatedAt: firebase.database.ServerValue.TIMESTAMP,
				};
	
				// Update the thread data
				threadRef
					.update(formData)
					.then(() => {
						$('#postThread').modal('hide');
	
						Swal.fire({
							icon: 'success',
							title: 'Thread Updated successfully!',
						});
					})
					.catch((error) => {
						console.error(error);
						Swal.fire({
							icon: 'error',
							title: 'Something went wrong!',
						});
					})
					.finally(() => {
						category.value = '';
						title.value = '';
						tinymce.activeEditor.setContent('');
	
						document.getElementById('category').removeAttribute('disabled');
	
						if (redirectToThread) {
							navigate('pokeforum/' + slug);
						}
					});
			})
			.catch((error) => {
				console.error(error);
				Swal.fire({
					icon: 'error',
					title: 'Something went wrong!',
				});
			});
	}

	function editedThreadLaravel(id) {
		const category = document.getElementById('category');
		const title = document.getElementById('title');
		const slug = slugify(title.value);
		let currentUser = firebase.auth().currentUser;
		let bearerToken = localStorage.getItem('bearerToken');
	
		if (title.value == '' || tinymce.activeEditor.getContent() == '') {
			Swal.fire({
				icon: 'error',
				title: 'All fields are required!',
			});
			return;
		}
	
		// const url = 'http://127.0.0.1:8000/api/thread/'+id;
		const url = 'https://pok3mon.online/api/thread/'+id;
	
		const formData = {
			id: id, // Include the thread ID in the form data
			categoryId: category.value,
			title: title.value,
			slug: slug,
			content: tinymce.activeEditor.getContent(),
			updatedAt: firebase.database.ServerValue.TIMESTAMP,
			userId: user.uid,
		};
	
		axios.put(url, formData, {
			headers: {
				'X-User-Uid': currentUser.uid,
				'Authorization': `Bearer ${bearerToken}`,
			},
		})
		.then(response => {
			$('#postThread').modal('hide');

			Swal.fire({
				icon: 'success',
				title: 'Thread Updated successfully!',
			});
		})
		.catch(error => {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Something went wrong!',
			});
		})
		.finally(() => {
			category.value = '';
			title.value = '';
			tinymce.activeEditor.setContent('');

			document.getElementById('category').removeAttribute('disabled');

			if (redirectToThread) {
				navigate('pokeforum/' + slug);
			}
		});
	}
	
	return (
		<div className="modal fade modal-lg" id="postThread" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						{editFunction &&(<h5 className="modal-title" id="exampleModalLabel">Edit a Thread</h5>)}
						{postFunction &&(<h5 className="modal-title" id="exampleModalLabel">Create a Thread</h5>)}
					</div>

					<div className="modal-body">

						<div id="categoryError" className="text-danger text-sm"></div>
						<select name="category" type="text" id="category" className="form-control mb-4">
							<option value="">--Select a Category--</option>
							{/* <option value="-NY09vnKnlq-rP_dYN7L">Pokedex</option>
							<option value="-NY09qsAZhynFQBPXtMI">Pokecard</option> */}
							{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
							))}
						</select>

						<div id="titleError" className="text-danger text-sm"></div>
						<input name="title" type="text" id="title" className="form-control mb-4" placeholder='Title'/>

						<div id="contentError" className="text-danger text-sm"></div>
						<div className="form-outline mb-4">
							<textarea id="summernote" name="editordata" className="rounded"></textarea>
						</div>
					</div>
					<div className="modal-footer">
						{postFunction &&(<button type="submit" className="btn btn-dark" onClick={()=>createThreadLaravel()}>Post</button>)}
						{/* {postFunction &&(<button type="submit" className="btn btn-dark" onClick={()=>createThread()}>Random Post</button>)} */}
						{editFunction &&(<button type="submit" className="btn btn-dark" onClick={()=>editedThreadLaravel(threadIDToBeEdit)}>Edit</button>)}
						<button type="button" className="btn btn-dark" data-mdb-dismiss="modal">Cancel</button>
					</div>

				</div>
			</div>
		</div>
	)
}

export default CreateThreadModal