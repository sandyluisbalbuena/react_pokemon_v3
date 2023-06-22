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
	let [editFunction, setEditFunction] = useState(false);
	let [postFunction, setPostFunction] = useState(true);
	let [threadIDToBeEdit, setthreadIDToBeEdit] = useState('');
 

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


	function createThread() {

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

	
		const threadRef = firebase.database().ref('threads');
	
		threadRef
		.orderByChild('title')
		.equalTo(title.value)
		.once('value')
		.then((snapshot) => {
			if (snapshot.exists()) {
			Swal.fire({
				icon: 'error',
				title: 'Title already exists!',
			});
			return;
			}
	
			return threadRef
			.orderByChild('slug')
			.equalTo(slug)
			.once('value');
		})
		.then((slugSnapshot) => {
			if (slugSnapshot.exists()) {
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
			userId: user.uid,
			createdAt: firebase.database.ServerValue.TIMESTAMP,
			updatedAt: firebase.database.ServerValue.TIMESTAMP,
			};
	
			threadRef
			.push(formData)
			.then(() => {
				$('#postThread').modal('hide');
	
				Swal.fire({
				icon: 'success',
				title: 'Post Created successfully!',
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

				if(redirectToThread){
					navigate('pokeforum/'+slug);
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
							<option value="-NY09vnKnlq-rP_dYN7L">Pokedex</option>
							<option value="-NY09qsAZhynFQBPXtMI">Pokecard</option>
						</select>

						<div id="titleError" className="text-danger text-sm"></div>
						<input name="title" type="text" id="title" className="form-control mb-4" placeholder='Title'/>

						<div id="contentError" className="text-danger text-sm"></div>
						<div className="form-outline mb-4">
							<textarea id="summernote" name="editordata" className="rounded"></textarea>
						</div>
					</div>
					<div className="modal-footer">
						{postFunction &&(<button type="submit" className="btn btn-dark" onClick={()=>createThread()}>Post</button>)}
						{editFunction &&(<button type="submit" className="btn btn-dark" onClick={()=>editedThread(threadIDToBeEdit)}>Edit</button>)}
						<button type="button" className="btn btn-dark" data-mdb-dismiss="modal">Cancel</button>
					</div>

				</div>
			</div>
		</div>
	)
}

export default CreateThreadModal