import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { useAuthState } from 'react-firebase-hooks/auth';

const CreateThreadModal = () => {
	// let [userData,setuserdata] = useState([]);
	const [user] = useAuthState(firebase.auth());


	// useEffect(() => {
	// 	if (user) {
	// 	const userRef = firebase.database().ref(`users/${user.uid}`);
	// 	userRef.on('value', (snapshot) => {
	// 		const userData = snapshot.val();

	// console.log(userData);
			
	// 		// if (userData) {
	// 		// 	setUsername(userData.username || '');
	// 		// 	setUserimage(userData.image || 'pikachu');
	// 		// 	setuserdata(userData);
	// 		// }
	// 	});
	// 	}
	// }, [user]);
		if (user) {

	console.log(user.uid);
}
	useEffect(()=>{
		tinymce.init({
			selector: 'textarea#summernote',
			height: 350,
			// plugins: [
			//     'advlist', 'autolink', 'lists', 'link',  'charmap', 'preview',
			//     'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
			//     'insertdatetime', 'media', 'table', 'help', 'wordcount'
			// ],
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
	}, [])

	

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
		let category = document.getElementById('category');
		let title = document.getElementById('title');


		let formData = {
			categoryId: category.value,
			title: title.value,
			slug: slugify(title),
			content: tinymce.activeEditor.getContent(),
			userId:user.uid,
			createdAt: firebase.database.ServerValue.TIMESTAMP,
			updatedAt: firebase.database.ServerValue.TIMESTAMP,
		};
	
		// Simple validation to check if any field is empty
		if (!formData.categoryId || !formData.title || !formData.content) {
		Swal.fire({
			icon: 'error',
			title: 'All fields are required!',
		});
		return; // Exit the function if any field is empty
		}
	
		const threadRef = firebase.database().ref('threads');
	
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
		});
	}
	

	

	return (
		<>
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
								<option value="-NY09vnKnlq-rP_dYN7L">Pokemon</option>
								<option value="-NY09qsAZhynFQBPXtMI">Pokecard</option>
							</select>

							<div id="titleError" className="text-danger text-sm"></div>
							<div className="form-outline mb-4">
								<input name="title" type="text" id="title" className="form-control" placeholder='Title' style={{border:"gray 1px solid"}}/>
							</div>

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

		

		</>
	)
}

export default CreateThreadModal