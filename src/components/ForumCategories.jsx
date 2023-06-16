import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const ForumCategories = () => {
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const categoriesRef = firebase.database().ref('categories');

		const categoriesListener = categoriesRef.on('value', (snapshot) => {
		const categoriesData = snapshot.val();

		if (categoriesData) {
			const mappedCategories = Object.entries(categoriesData).map(([key, category]) => ({
			id: key,
			name: category.name,
			}));
			setCategories(mappedCategories);
		}
		});

		return () => {
		categoriesRef.off('value', categoriesListener);
		};
	}, []);

	return (
		<div className="card my-1 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{ borderRadius: '5px', height: '100%' }} id="secondCard">
			<div className="card-body container-fluid">
				<div className="d-flex justify-content-between" type="button" data-mdb-toggle="collapse" data-mdb-target="#categories" aria-expanded="false" aria-controls="categories">
				<h6 className="ms-4">Categories</h6>
				<i className="fas fa-angles-down"></i>
				</div>
				<ul className="collapse mt-3" id="categories" style={{ listStyleType: 'none' }}>
				{categories.map((category) => (
					<a onClick={() => wew(category.name)} key={category.id} href={'#' + category.name}>
					<li className="px-2 py-1 rounded list-group-item threads-latest my-2" style={{ fontSize: '12px', textDecoration: 'none', color: 'black' }}>
						{category.name.toUpperCase()}
					</li>
					</a>
				))}
				</ul>
			</div>
		</div>
	);
};

export default ForumCategories;
