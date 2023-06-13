var scrollButton = document.getElementById("scrollButton");

//109745
var loaderbackground = document.getElementById("preloader-background");


window.addEventListener("load", function(){
		loaderbackground.style.display = "none";
});


window.addEventListener("scroll", function() {
  if (window.pageYOffset > 100) {
    scrollButton.style.display = "block";
  } else {
    scrollButton.style.display = "none";
  }
});

scrollButton.addEventListener("click", function() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
});

function showLoader(){
  // preloader.style.display = "none";
  loaderbackground.classList.remove('animate__fadeOut');
  loaderbackground.classList.add('animate__fadeIn');
  loaderbackground.style.display = "block";
}

// function signin(){
//   swal.fire({
//     title: "Sign In",
//     html: `<div class="container"><div class="row">
//       <input type="email" id="email" placeholder="Email" class="form-control col-12 mb-1" required>
//       <input type="text" id="username" placeholder="Username" class="form-control col-12 mb-1" required>
//       <input type="password" id="password" placeholder="Password" class="form-control col-12 mb-1" required>
//       <input type="password" id="confirmPassword" placeholder="Confirm Password" class="form-control col-12 mb-1" required>
//     </div></div>`,
//     showCancelButton: true,
//     backdrop: false,
//     confirmButtonText: "Sign In",
//     cancelButtonText: "Cancel",
//     preConfirm: () => {
//       const email = document.getElementById('email').value;
//       const username = document.getElementById('username').value;
//       const password = document.getElementById('password').value;
//       const confirmPassword = document.getElementById('confirmPassword').value;
      
//       // Perform form validation

//       new Promise((resolve) => {

//         if (!email || !username || !password || !confirmPassword) {
//           swal.showValidationMessage("Please fill in all the required fields");
//           return false; // Prevent the dialog from closing
//         }
//         if (password !== confirmPassword) {
//           swal.showValidationMessage("Passwords do not match");
//           return false; // Prevent the dialog from closing
//         }
  
  
//         userAndIdChecker(username,email).then(value=>{
//           console.log(value);
  
//           if(!value){
//             swal.showValidationMessage("Email or Username already exist");
//             return false; // Prevent the dialog from closing
//           }
//         });

        
//         setTimeout(() => resolve(), 1000); // Delay execution by 3 seconds
//       }).then(() => {
//         return { email, username, password };

//       });


     


//       // if(userAndIdChecker(username,email).then(value=>{return value}) == false){
//       //   
//       // }

//       // if(valid){
//       // } 
//     }
//   }).then((result) => {
//     if (result.isConfirmed) {
//       // Access the entered values
//       const { email, username, password } = result.value;
//       // Perform further actions with the values
//       console.log(email, username, password);
      
//     }
//   });
// }

function userAndIdChecker(username,email){
  return axios.get('/signincheck?username='+encodeURIComponent(username)+'&email='+encodeURIComponent(email))
  .then(response => {

    // console.log(response.data.success);

    return response.data.success;



    // console.log(response.data.success);

    // if(response.data.success){
    //   axios.get('/signin?username='+encodeURIComponent(username)+'&password='+encodeURIComponent(password)+'&email='+encodeURIComponent(email))
    //   .then(response => {

    //     console.log(response.data);

    //   return { email, username, password };

    //   })
    //   .catch(error => console.error('On get one pokemon error', error))
    //   .then(() => { 
    //   })
    // }
    // else{
    //   swal.showValidationMessage("Email or Username already exist");
    //   return false; // Prevent the dialog from closing
    // }
  })
  .catch(error => console.error('On get one pokemon error', error))
}

function login(){
  swal.fire({
    title: "Log In",
    html: `
      <input type="text" id="username" placeholder="Username" class="swal2-input" required>
      <input type="password" id="password" placeholder="Password" class="swal2-input" required>
    `,
    showCancelButton: true,
    backdrop: false,
    confirmButtonText: "Log In",
    cancelButtonText: "Cancel",
    showLoaderOnConfirm: true,
    inputAttributes: {
      autocapitalize: 'off'
    },
    preConfirm: () => {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      // const image = document.getElementById('image').files[0];
      
      // Perform form validation
      if (!username || !password ) {
        swal.showValidationMessage("Please fill in all the required fields");
        return false; // Prevent the dialog from closing
      }
      if (password !== confirmPassword) {
        swal.showValidationMessage("Passwords do not match");
        return false; // Prevent the dialog from closing
      }
      // Return an object with the entered values
      return { email, username };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // Access the entered values
      const { email, username, password } = result.value;
      // Perform further actions with the values
      console.log(email, username, password);

      
    }
  });
}

function signin(){
  Swal.fire({
    title: 'Submit your Github username',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Look up',
    showLoaderOnConfirm: true,
    preConfirm: (username) => {
      return fetch('/signincheck?username='+encodeURIComponent(username))
      // return fetch('/signincheck?username='+encodeURIComponent(username)+'&email='+encodeURIComponent(email))
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText)
          }
          return response.json()
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
        title: `${result.value.username}'s avatar`,
        // imageUrl: result.value.avatar_url
      })
    }
  })
}

  