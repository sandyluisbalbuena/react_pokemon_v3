let category = document.getElementById('category');
let title = document.getElementById('title');
let summernote = document.getElementById('summernote');
let trendingTopics = document.getElementById('trendingTopics');
let forumLatest = document.getElementById('forumLatest');
let secondCard = document.getElementById('secondCard');
let summernoteContent = document.getElementById('summernoteContent');
let replies = document.getElementById('replies');
let commentForm = document.getElementById('commentForm');
let commentArea = document.getElementById('commentArea');
let threadData;
let threadSlug;

getTrendingTopics();
getCategories();
getMyThreads();

function getTrendingTopics(){
	axios.get('/pokeforum/gettrendingtopics')
    .then(response => {

		response.data.forEach(thread => {
			trendingTopics.innerHTML += '<a  href="/pokeforum/'+thread.slug+'"><li class="px-2 py-1 rounded list-group-item threads-latest my-2" style="font-size:12px; text-decoration:none; color:black;">'+thread.title+'</li></a>';
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

		response.data.forEach(category => {
			categories.innerHTML += '<a id="'+category.name+'Id" href="/pokeforum#'+category.name+'"><li class="px-2 py-1 rounded list-group-item threads-latest my-2" style="font-size:12px; text-decoration:none; color:black;">'+category.name+'</li></a>';
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


		console.log(response.data[0]);

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

function summernote_content(content){

	threadSlug = content.slug;
	threadData = content;

	summernoteContent.innerHTML = content.content;
}


function replies_content(repliesContent){

	repliesContent.messages.reverse().forEach(comment => {
			replies.innerHTML += `<div class="rounded my-3">
									<div class="d-flex">
										<div class="me-3">
											<img src='`+comment.user.image+`' style="width:25px;"/>
										</div>
										<div>
											<span class="d-flex">
												<div style="font-size:12px; font-weight:bolder;">
												`+comment.user.name.toUpperCase()+`
												</div>&nbsp;&nbsp;
												<div style="font-size:10px;">
												`+getCommentAge(comment.created_at)+`
												</div>
											</span>
											<div style="font-size:11px;">
											`+comment.content+`
											</div>
											<div class="mt-2 d-flex">
												<i class="fas fa-thumbs-up ms-2 style="width:15px; height:15px;"></i>
												<i class="fas fa-thumbs-down ms-2 style="width:15px; height:15px;"></i>
												<i class="fas fa-reply ms-2 style="width:15px; height:15px;"  data-mdb-toggle="collapse" href="#repliesToThreadInput`+comment.id+`" role="button" aria-expanded="false" aria-controls="repliesToThreadInput`+comment.id+`"></i>
											</div>
											<div class="collapse mt-1" id="repliesToThreadInput`+comment.id+`">
												<div class="d-flex">
													<div id="replyCommentError`+comment.id+`" class="text-danger text-sm"></div>
													<input type="text" id="replyToComment`+comment.id+`" name="replyToComment`+comment.id+`" class="form-control" />
													<form class="formReplyToComment">
														<div class="btn-group ms-1 btn-dark" role="group" aria-label="Basic example">
															<button type="submit" onclick="sendFormReplyToComment('`+comment.id+`')" class="btn btn-dark"><i class="fas fa-paper-plane"></i></button>
															<button type="button" class="btn btn-dark" data-mdb-toggle="collapse" data-mdb-target="#repliesToThreadInput`+comment.id+`" aria-expanded="false" aria-controls="repliesToThreadInput`+comment.id+`"><i class="fas fa-xmark"></i></button>
														</div>
													</form>
												</div>
											</div>
											${(comment.replies.length > 1)?`
											<div class="mt-2">
												<span type="button" class="badge badge-dark" data-mdb-toggle="collapse" href="#repliesToThread`+comment.id+`" role="button" aria-expanded="false" aria-controls="repliesToThread`+comment.id+`"><i class="fas fa-caret-down"></i>&nbspReplies&nbsp`+comment.replies.length+`</span>
												<div class="collapse mt-1" id="repliesToThread`+comment.id+`">
												</div>
											</div>`:
											(comment.replies.length > 0)?`
											<div class="mt-2">
												<span class="badge badge-dark" data-mdb-toggle="collapse" href="#repliesToThread`+comment.id+`" role="button" aria-expanded="false" aria-controls="repliesToThread`+comment.id+`"><i class="fas fa-caret-down"></i>&nbspReply&nbsp`+comment.replies.length+`</span>
												<div class="collapse mt-1" id="repliesToThread`+comment.id+`">
												</div>
											</div>`:``
											}
										</div>
									</div>
								</div>`;

		comment.replies.reverse().forEach(reply => {
			document.getElementById('repliesToThread'+comment.id).innerHTML += `<div class="d-flex">
																					<div class="me-3">
																						<img class="ms-2" src='`+reply.user.image+`' style="width:20px;"/>
																					</div>
																					<div>
																						<span class="d-flex">
																							<div style="font-size:12px; font-weight:bolder;">
																							`+reply.user.name.toUpperCase()+`
																							</div>&nbsp;&nbsp;
																							<div style="font-size:10px;">
																							`+getCommentAge(reply.created_at)+`
																							</div>
																						</span>
																						<div style="font-size:11px;">
																						`+reply.content+`
																						</div>
																						<div class="mt-2 d-flex">
																							<i class="fas fa-thumbs-up ms-2 style="width:15px; height:15px;"></i>
																							<i class="fas fa-thumbs-down ms-2 style="width:15px; height:15px;"></i>
																						</div>
																					</div>
																				</div>`
		})								

	});


	
	let formReplyToComment = $('.formReplyToComment');
	console.log(formReplyToComment.length);

	for (let index = 0; index < formReplyToComment.length; index++) {
		formReplyToComment[index].addEventListener('submit', (e)=>{
			e.preventDefault();
		})
	}

}

function sendFormReplyToComment(messageId) {

	console.log(messageId);

	let replyToComment = document.getElementById('replyToComment'+messageId);

	let formData = {
		'comment' : replyToComment.value,
		'messageId' : messageId,
	};


	axios.post('/pokeforum/'+threadSlug+'/postcommentreplies', formData)
	.then(response => {

		if(response.data.success){
			Swal.fire({
				icon: 'success',
				title: 'Reply Created successfully!',
			})
		
		}else{
			document.getElementById('replyCommentError'+messageId).textContent = response.data.message.comment;
		
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
		commentForm.reset();
		replies_contentUpdate();
	})
}

function getCommentAge(commentDate) {
	const now = new Date(); // current date and time
	const postedDate = new Date(commentDate); // convert comment date to Date object
	const timeDiff = now - postedDate; // get the time difference in milliseconds

	const seconds = Math.floor(timeDiff / 1000); // convert milliseconds to seconds
	const minutes = Math.floor(seconds / 60); // convert seconds to minutes
	const hours = Math.floor(minutes / 60); // convert minutes to hours
	const days = Math.floor(hours / 24); // convert hours to days
	const years = Math.floor(days / 365); // convert days to years

	if (seconds < 60) {
		if (seconds > 1) {
			return `${seconds} seconds ago`;
		} else {
			return `${seconds} second ago`;
		}
	} else if (minutes < 60) {
		if (minutes > 1) {
			return `${minutes} minutes ago`;
		} else {
			return `${minutes} minute ago`;
		}
	} else if (hours < 24) {
		if (hours > 1) {
			return `${hours} hours ago`;
		} else {
			return `${hours} hour ago`;
		}
	} else if (days < 365) {
		if (days > 1) {
			return `${days} days ago`;
		} else {
			return `${days} day ago`;
		}
	} else {
		if (years > 1) {
			return `${years} years ago`;
		} else {
			return `${years} year ago`;
		}
	}
}

commentForm.addEventListener('submit', (e)=>{
	e.preventDefault();

	let formData = {
		'comment' : commentArea.value,
	};


	axios.post('/pokeforum/'+threadSlug, formData)
    .then(response => {

		if(response.data.success){

			Swal.fire({
				icon: 'success',
				title: 'Post Created successfully!',
			})
		
		}else{
			document.getElementById('commentError').textContent = response.data.message.comment;
		
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
		commentForm.reset();
		replies_contentUpdate();
    })

});

function replies_contentUpdate(){

	replies.innerHTML="";

	axios.get('/pokeforum/'+threadSlug+'/getrepliesupdate')
    .then(response => {

		response.data[0].messages.reverse().forEach(comment => {
			replies.innerHTML += `<div class="rounded my-3">
			<div class="d-flex">
				<div class="me-3">
					<img src='`+comment.user.image+`' style="width:25px;"/>
				</div>
				<div>
					<span class="d-flex">
						<div style="font-size:12px; font-weight:bolder;">
						`+comment.user.name.toUpperCase()+`
						</div>&nbsp;&nbsp;
						<div style="font-size:10px;">
						`+getCommentAge(comment.created_at)+`
						</div>
					</span>
					<div style="font-size:11px;">
					`+comment.content+`
					</div>
					<div class="mt-2 d-flex">
						<i class="fas fa-thumbs-up ms-2 style="width:15px; height:15px;"></i>
						<i class="fas fa-thumbs-down ms-2 style="width:15px; height:15px;"></i>
						<i class="fas fa-reply ms-2 style="width:15px; height:15px;"  data-mdb-toggle="collapse" href="#repliesToThreadInput`+comment.id+`" role="button" aria-expanded="false" aria-controls="repliesToThreadInput`+comment.id+`"></i>
					</div>
					<div class="collapse mt-1" id="repliesToThreadInput`+comment.id+`">
						<div class="d-flex">
							<div id="replyCommentError`+comment.id+`" class="text-danger text-sm"></div>
							<input type="text" id="replyToComment`+comment.id+`" name="replyToComment`+comment.id+`" class="form-control" />
							<form class="formReplyToComment">
								<div class="btn-group ms-1 btn-dark" role="group" aria-label="Basic example">
									<button type="submit" onclick="sendFormReplyToComment('`+comment.id+`')" class="btn btn-dark"><i class="fas fa-paper-plane"></i></button>
									<button type="button" class="btn btn-dark" data-mdb-toggle="collapse" data-mdb-target="#repliesToThreadInput`+comment.id+`" aria-expanded="false" aria-controls="repliesToThreadInput`+comment.id+`"><i class="fas fa-xmark"></i></button>
								</div>
							</form>
						</div>
					</div>
					${(comment.replies.length > 1)?`
					<div class="mt-2">
						<span type="button" class="badge badge-dark" data-mdb-toggle="collapse" href="#repliesToThread`+comment.id+`" role="button" aria-expanded="false" aria-controls="repliesToThread`+comment.id+`"><i class="fas fa-caret-down"></i>&nbspReplies&nbsp`+comment.replies.length+`</span>
						<div class="collapse mt-1" id="repliesToThread`+comment.id+`">
						</div>
					</div>`:
					(comment.replies.length > 0)?`
					<div class="mt-2">
						<span class="badge badge-dark" data-mdb-toggle="collapse" href="#repliesToThread`+comment.id+`" role="button" aria-expanded="false" aria-controls="repliesToThread`+comment.id+`"><i class="fas fa-caret-down"></i>&nbspReply&nbsp`+comment.replies.length+`</span>
						<div class="collapse mt-1" id="repliesToThread`+comment.id+`">
						</div>
					</div>`:``
					}
				</div>
			</div>
		</div>`;

			comment.replies.reverse().forEach(reply => {
			document.getElementById('repliesToThread'+comment.id).innerHTML += `<div class="d-flex">
					<div class="me-3">
						<img class="ms-2" src='`+reply.user.image+`' style="width:20px;"/>
					</div>
					<div>
						<span class="d-flex">
							<div style="font-size:12px; font-weight:bolder;">
							`+reply.user.name.toUpperCase()+`
							</div>&nbsp;&nbsp;
							<div style="font-size:10px;">
							`+getCommentAge(reply.created_at)+`
							</div>
						</span>
						<div style="font-size:11px;">
						`+reply.content+`
						</div>
						<div class="mt-2 d-flex">
							<i class="fas fa-thumbs-up ms-2 style="width:15px; height:15px;"></i>
							<i class="fas fa-thumbs-down ms-2 style="width:15px; height:15px;"></i>
						</div>
					</div>
				</div>`
			})		
		});

    })
    .catch(function (error){
		console.error(error);
	})
    .then(() => { 
    })

}

