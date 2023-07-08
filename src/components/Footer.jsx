import React from 'react'

const Footer = () => {
	return (
		<footer className="bg-dark text-center text-white">
			<div className="container p-4 pb-0">
				<section className="my-4">
					<div>
						<a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"
						><i className="fab fa-facebook-f"></i></a>
						<a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"
						><i className="fab fa-twitter"></i></a>
						<a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"
						><i className="fab fa-google"></i></a>
						<a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"
						><i className="fab fa-instagram"></i></a>
						<a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"
						><i className="fab fa-linkedin-in"></i></a>
						<a className="btn btn-outline-light btn-floating m-1" href="#!" role="button"
						><i className="fab fa-github"></i></a>
					</div>
				</section>
			</div>
			<div className="text-center p-3 footer-end">© 2023 Copyright:
				<a className="text-white" href="https://sandy-luis-balbuena.epizy.com/">sandy-luis-balbuena.epizy.com</a>
			</div>
		</footer>
	)
}

export default Footer