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

		eventBus.subscribe('pokedexCreateThread', pokedexCreateThread);
		eventBus.subscribe('pokecardCreateThread', pokecardCreateThread);

		return () => {
			eventBus.unsubscribe('pokedexCreateThread', pokedexCreateThread);
			eventBus.unsubscribe('pokecardCreateThread', pokecardCreateThread);
		};	

	}, [])

	const pokedexCreateThread = (data) => {
		document.getElementById('category').value = '-NY09vnKnlq-rP_dYN7L';
		document.getElementById('title').value = data.name.toUpperCase();
		document.getElementById('category').setAttribute('disabled', '');

		let descriptionForThreadPokedex;

		redirectToThread = true;

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

	const pokecardCreateThread = (data) => {
		document.getElementById('category').value = '-NY09qsAZhynFQBPXtMI';
		document.getElementById('category').setAttribute('disabled', '');

		redirectToThread = true;

		console.log('cardthread', data);

		tinymce.execCommand('mceInsertContent', false, `<img  class="rounded cardForThread" src="`+data[1]+`">
                                                        <h6>
                                                        `+
                                                        data[0]
                                                        +` 
                                                        </h6>
                                                    `);
	}


	// let formPostThread = document.getElementById('formPostThread');
	// let category = document.getElementById('category');
	// let title = document.getElementById('title');

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

	return (
		<div className="modal fade modal-lg" id="postThread" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="exampleModalLabel">Create a Thread</h5>
					</div>
					{/* <form id="formPostThread"> */}
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
							<button type="submit" className="btn btn-dark" onClick={()=>createThread()}>Post</button>
							<button type="button" className="btn btn-dark" data-mdb-dismiss="modal">Cancel</button>
						</div>
					{/* </form> */}
				</div>
			</div>
		</div>
	)
}

export default CreateThreadModal