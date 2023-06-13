let category = document.getElementById('category');
let title = document.getElementById('title');
let summernote = document.getElementById('summernote');
let trendingTopics = document.getElementById('trendingTopics');
let forumLatest = document.getElementById('forumLatest');
let categories = document.getElementById('categories');
let myThreads = document.getElementById('myThreads');
let isAdmin;

getTrendingTopics();
getForumLatest();
getCategories();
getMyThreads();

setTimeout(() => {
	// Find all anchor tags with hash href
	const anchorLinks = document.querySelectorAll('a[href^="#"]');

	// Iterate over the anchor links and add click event listeners
	anchorLinks.forEach(anchor => {
	anchor.addEventListener('click', function (event) {
		event.preventDefault(); // Prevent the default jump-to-anchor behavior

		// Get the target element based on the href attribute
		const targetId = this.getAttribute('href');
		const targetElement = document.querySelector(targetId);

		// Scroll smoothly to the target section
		targetElement.scrollIntoView({
		behavior: 'smooth',
		block: 'center'
		});
	});
	});

}, 1000);

function adminChecker(userRoleId){
	isAdmin = userRoleId.role;
}

formPostThread.addEventListener('submit', (e)=>{
	e.preventDefault();
	
	let formData = {
		'category' : category.value,
		'title' : title.value,
		'content' : tinymce.activeEditor.getContent(),
		// 'content' : summernote.value,
	};


	axios.post('/pokeforum', formData)
    .then(response => {

		if(response.data.success){

			$('#postThread').modal('hide');

			Swal.fire({
				icon: 'success',
				title: 'Post Created successfully!',
			})
		
		}else{
			document.getElementById('categoryError').textContent = response.data.message.category;
			document.getElementById('titleError').innerHTML = response.data.message.title;													
			document.getElementById('contentError').innerHTML = response.data.message.content;
			Swal.fire({
				icon: 'error',
				title: 'Something went wrong!',
			})
		}
    })
    .catch(function (error){
		console.error(error);
	})
    .then(() => { 
		getForumLatest();
    })
})

function getForumLatest(){

	forumLatest.innerHTML = "";
	axios.get('/pokeforum/getforumlatest')
    .then(response => {


		response.data.forEach(data => {
			forumLatest.innerHTML+=`<div class="card my-4 px-1 animate__animated animate__fadeInUp" style="border-radius: 5px;" id="`+data.name+`">
										<div class="card-body container">
											<div class="row">
												<h2>`+data.name+` Discussions</h2>
												<div class="list-group list-group-light" id="category_`+data.id+`" style="height:400px; overflow-y:auto;">
												</div>
											</div>
										</div>
									</div>`

			data.threads.reverse().forEach(thread => {
				document.getElementById('category_'+data.id).innerHTML += `<a data-slug="`+thread.slug+`" href="/pokeforum/`+thread.slug+`" class="forumItems list-group-item list-group-item-action px-3 border-0">
				<div class="row">
					<div class="col-12 col-lg-3 d-flex">
						<i class="fas fa-comments mx-3"></i>
						<p>`+thread.title+`</p>
					</div>
					<div class="d-none d-lg-block col-lg-2">
						${(thread.messages.length>1)?`<span class="badge badge-secondary pill-rounded">`+thread.messages.length+`&nbsp;Messages</span>`:(thread.messages.length>0)?`<span class="badge badge-secondary pill-rounded">`+thread.messages.length+`&nbsp;Message</span>`:``}
					</div>
					<div class="d-none d-lg-block col-lg-3 d-lg-flex">
						<img width="35px" height="35px" src="`+thread.user.image+`"/>
						<p class="ms-3">`+thread.user.name.toUpperCase()+`</p>
					</div>
					<div class="d-none d-lg-block col-lg-3">
						<span class="badge badge-secondary pill-rounded">`+new Date(thread.created_at).toLocaleString()+`</span>
					</div>
					<div class="d-none d-lg-block col-lg-1">
						${(isAdmin == 1)?'<span onclick="return deleteThread('+thread.id+')" class="badge badge-sm badge-danger"><i class="fas fa-trash"></i></span>':''}
					</div>
				</div>
				</a>`
			});
			
		});

    })
    .catch(function (error){
		console.error(error);
	})
    .then(() => { 

    })
}

function getForumLatestUpdate(){

	// let forumItems = document.getElementsByClassName('forumItems');
	// console.log(forumItems[0]);
	let category_1 = document.getElementById('category_1');
	let category_2 = document.getElementById('category_2');


	// forumItems.forEach(forumItem => {
	// 	console.log(forumItem.getAttribute('custom-forum-data'));
	// });

	// for (let i = 0; i < forumItems.length; i++) {
	// 	const element = forumItems[i];
	// 	const dataIdValue = element.getAttribute('data-slug');
	// 	console.log(dataIdValue);
	// }

	axios.get('/pokeforum/getforumlatestupdate')
    .then(response => {

		response.data.forEach(latestthread => {

		});

    })
    .catch(function (error){
		console.error(error);
	})
    .then(() => { 

    })
}

function getTrendingTopics(){
	axios.get('/pokeforum/gettrendingtopics')
    .then(response => {

		response.data.forEach(thread => {
			trendingTopics.innerHTML += '<a  href="/pokeforum/'+thread.slug+'"><li class="px-2 py-1 rounded list-group-item threads-latest my-2" style="font-size:12px; text-decoration:none; color:black;">'+thread.title+'</li></a>';
			// trendingTopics.innerHTML += '<li href="/pokeforum/'+thread.slug+'" class="list-group-item threads-latest" style="font-size:12px;">'+thread.title+'</li>';
		});

    })
    .catch(function (error){
		console.error(error);
	})
    .then(() => { 

    })
}

function getCategories(){


	axios.get('/pokeforum/getcategories')
    .then(response => {

		// console.log(response.data);

		response.data.forEach(category => {
			categories.innerHTML += '<a id="'+category.name+'Id" href="#'+category.name+'"><li class="px-2 py-1 rounded list-group-item threads-latest my-2" style="font-size:12px; text-decoration:none; color:black;">'+category.name+'</li></a>';
		});

    })
    .catch(function (error){
		console.error(error);
	})
    .then(() => { 

    })
}

function getMyThreads(){
	axios.get('/pokeforum/getmythreads')
    .then(response => {


		// console.log(response.data[0]);

		response.data[0].threads.reverse().forEach(thread => {
			myThreads.innerHTML += '<a href="/pokeforum/'+thread.slug+'"><li class="px-2 py-1 rounded list-group-item threads-latest my-2" style="font-size:12px; text-decoration:none; color:black;">'+thread.title+'</li></a>';
		});

    })
    .catch(function (error){
		console.error(error);
	})
    .then(() => { 

    })
}

function deleteThread(deleteThreadId){
	Swal.fire({
		title: 'Confirm Delete',
		text: 'Are you sure you want to delete this record?',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Delete',
		showLoaderOnConfirm: true,
		preConfirm: () => {
		// Make an AJAX request to delete the record
		return axios.delete(`/pokeforum/delete/thread/`+deleteThreadId)
			.then(response => {
				if (!response.data.success) {
					throw new Error(response.data.message)
				}
				return response.data
			})
			.catch(error => {
				Swal.showValidationMessage(
					`Request failed: ${error}`
				)
			})
		},
		allowOutsideClick: () => !Swal.isLoading()
	}).then((result) => {
		if (result.isConfirmed) {
		Swal.fire({
			title: 'Record Deleted',
			text: result.message,
			icon: 'success'
		}).then(() => {
			getForumLatest();
		});
		}
	});

	return false;
}