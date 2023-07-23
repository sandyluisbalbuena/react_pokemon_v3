import React, { useEffect } from 'react'
import  { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/compat/app';

const Profile = () => {

	const [user] = useAuthState(firebase.auth());

	let userIcons = [
		'abra',
		'bulbasaur',
		'caterpie',
		'charmander',
		'dratini',
		'eevee',
		'jigglypuff',
		'mankey',
		'mew',
		'pikachu',
		'psyduck',
		'snorlax',
		'squirtle',
		'weedle',
		'venonat',
		'rattata',
		'pidgey',
		'meowth',
		'bellsprout'
	];

	let newUserIcon;

	useEffect(() => {
		if (user) {
		let userIconsPickImage = document.getElementById('userIconsPickImage');
		userIconsPickImage.innerHTML = ''; // Clear the previous buttons
	
		const userRef = firebase.database().ref(`users/${user.uid}`);
		userRef.once('value')
			.then((snapshot) => {
			const userData = snapshot.val();
			if (userData) {
				newUserIcon = userData.image;
				document.getElementById('username').value = userData.username;
				document.getElementById('userimage').src = '../assets/images/userIcons/' + userData.image + '.png';
	
				userIcons.forEach(userIcon => {
				const button = document.createElement('button');
				button.className = 'btn mb-4';
				button.addEventListener('click', () => changeUserIcon(userIcon));
				const image = document.createElement('img');
				image.className = 'userImageIconButton mb-4';
				image.src = `../assets/images/userIcons/${userIcon}.png`;
				button.appendChild(image);
				userIconsPickImage.appendChild(button);
				});
			}
			})
			.catch((error) => {
			// Handle error if necessary
			console.error(error);
			});
		}
	}, [user, userIcons]);


	function changeUserIcon(Icon){
		document.getElementById('userimage').src = '../assets/images/userIcons/'+Icon+'.png';
		newUserIcon = Icon;
	}

	function editProfile(){

		let usernameToBeEdit = document.getElementById('username');

		let formData = {
			username: usernameToBeEdit.value,
			image: newUserIcon,
		};

		if (usernameToBeEdit.value == '') {

			console.log(formData);
			usernameToBeEdit.style.border = 'red 1px solid';
			Swal.fire({
				icon: 'error',
				title: 'All fields are required!',
			});
			return;
		}

		const currentUser = firebase.auth().currentUser;
		if (currentUser) {
			const userRef = firebase.database().ref(`users/${currentUser.uid}`);

			userRef.update(formData)
			.then(() => {
				$('#profile').modal('hide');

				Swal.fire({
					icon: 'success',
					title: 'User data updated successfully!',
				});
				usernameToBeEdit.style.border = 'gray 1px solid';
			})
			.catch(error => {
				console.log('Error updating user data:', error);
			});
		}
		usernameToBeEdit.style.border = 'gray 1px solid';
	}

	function editProfileLaravel(){

		let usernameToBeEdit = document.getElementById('username');

		let formData = {
			username: usernameToBeEdit.value,
			image: newUserIcon,
		};

		if (usernameToBeEdit.value == '') {

			console.log(formData);
			usernameToBeEdit.style.border = 'red 1px solid';
			Swal.fire({
				icon: 'error',
				title: 'All fields are required!',
			});
			return;
		}

		let currentUser = firebase.auth().currentUser;
		let bearerToken = localStorage.getItem('bearerToken');

		if (currentUser) {
			// axios.put(`http://127.0.0.1:8000/api/user/${currentUser.uid}`, formData, {
			axios.put(`https://pok3mon.online/api/user/${currentUser.uid}`, formData, {
				headers: {
					'X-User-Uid': currentUser.uid,
					'Authorization': `Bearer ${bearerToken}`,
				},
			})
			.then(() => {
			$('#profile').modal('hide');

			Swal.fire({
				icon: 'success',
				title: 'User data updated successfully!',
			});
			usernameToBeEdit.style.border = 'gray 1px solid';
			})
			.catch(error => {
			console.log('Error updating user data:', error);
			});
		}
		usernameToBeEdit.style.border = 'gray 1px solid';
	}


	return (
		<div className="modal fade modal-lg" id="profile" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-mdb-backdrop="static" data-mdb-keyboard="false">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="exampleModalLabel">Profile</h5>
					</div>
						<div className="modal-body">
							<div id="titleError" className="text-danger text-sm"></div>


							<div className="row">

								<div className="col-12 col-lg-4">
									<button className='btn mb-4' type="button" data-mdb-toggle="collapse" data-mdb-target="#userIconsPickImage" aria-expanded="false" aria-controls="userIconsPickImage"><img id="userimage" width='45px' height='45px' src=''/>&nbsp;&nbsp;&nbsp; Click to change</button>
								</div>
								
								<div className="col-12 col-lg-8">
									<input name="title" type="text" id="username" className="form-control mb-4" placeholder='Title'/>
								</div>

							</div>

							<div className="row">
								<div className="collapse mb-4" id="userIconsPickImage">
								</div>
							</div>

							
						</div>
						<div className="modal-footer">
							<button type="submit" className="btn btn-dark" onClick={()=>editProfileLaravel()}>Edit</button>
							<button type="button" className="btn btn-dark" data-mdb-dismiss="modal">Cancel</button>
						</div>
				</div>
			</div>
		</div>
	)
}

export default Profile