function dipatapos(){
	Swal.fire({
		icon: 'error',
		title: 'Oops...',
		text: 'Coming Soon!',
		footer: '<a href="">Why do I have this issue?</a>'
	})
}

var scrollButton = document.getElementById("scrollButton");

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
  