const currentPath = window.location.pathname; // Get the current page path

const links = document.querySelectorAll('nav ul li a');

links.forEach((link) => {
  if (link.getAttribute('href') === currentPath) {
	  link.classList.add('active'); // Add active class to the current page link
  }
});



