import React from 'react';

const TermsAndAgreement = () => {
	return (
		<div className="container">

		<section className="row mt-5"></section>

		<section className="row mt-5">
			<div
			className="card mb-2 px-1 animate__animated animate__fadeIn animate__delay-1s"
			style={{ borderRadius: '5px', height: '100%' }}
			id="secondCard"
			>
			<div className="card-body container-fluid">
				<div className="d-flex justify-content-between">
				{/* <h4 className="ms-4">Terms and Agreements</h4> */}
				</div>
				<div className="mt-4">
				<h5>Terms and Agreements</h5>
				<p>Please read these terms and conditions carefully before registering on our website. By registering, you agree to be bound by the following terms and conditions:</p>

				<h6>User Data Rights:</h6>
				<ol>
					<li>
					By registering on our website, you grant us the right to collect, store, and process the data provided by you during the registration process.
					</li>
					<li>
					The data collected may include personal information such as name, email address, contact details, and any other information required for the registration process.
					</li>
					<li>
					We will use this data to provide you with access to our services, improve our website, and communicate with you regarding your account and our services.
					</li>
				</ol>

				<h6>Data Ownership:</h6>
				<ol>
					<li>
					You retain ownership and intellectual property rights over the content you submit or upload to our website.
					</li>
					<li>
					By submitting or uploading content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display the content for the purposes of providing our services and promoting our website.
					</li>
					<li>
					This license remains in effect even if you choose to delete or remove your content from our website.
					</li>
				</ol>

				<h6>Data Security:</h6>
				<ol>
					<li>
					We take data security seriously and implement reasonable measures to protect your data from unauthorized access, loss, or misuse.
					</li>
					<li>
					However, we cannot guarantee absolute security and are not liable for any unauthorized access, loss, or misuse of your data.
					</li>
				</ol>

				<h6>User Responsibilities:</h6>
				<ol>
					<li>
					You are responsible for maintaining the confidentiality of your account credentials and are solely responsible for any activities that occur under your account.
					</li>
					<li>
					You agree to provide accurate, complete, and up-to-date information during the registration process and to promptly update any changes to your information.
					</li>
				</ol>

				<h6>Termination:</h6>
				<ol>
					<li>
					We reserve the right to terminate or suspend your account at any time without prior notice for violations of these terms and conditions or for any other reason deemed necessary.
					</li>
					<li>
					Upon termination, your access to our services and the use of your data will be discontinued, except as otherwise required by law.
					</li>
				</ol>

				<h6>Amendments:</h6>
				<ol>
					<li>
					We reserve the right to modify, update, or change these terms and conditions at any time without prior notice.
					</li>
					<li>
					Any changes to these terms and conditions will be effective immediately upon posting on our website.
					</li>
				</ol>

				<h6>Governing Law:</h6>
				<ol>
					<li>
					These terms and conditions shall be governed by and construed in accordance with the laws of the Philippines.
					</li>
					<li>
					Any disputes arising from or relating to these terms and conditions shall be subject to the exclusive jurisdiction of the courts in the Philippines.
					</li>
				</ol>

				<p>
					By registering on our website, you acknowledge that you have read, understood, and agreed to these terms and conditions. If you do not agree with any part of these terms and conditions, please do not register on our website.
				</p>

				<p>
					These terms and conditions were last updated on 19/07/2023.
				</p>
				</div>
			</div>
			</div>
		</section>

		</div>
	);
};

export default TermsAndAgreement;
