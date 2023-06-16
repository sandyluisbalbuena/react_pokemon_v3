import React, { useEffect } from 'react'

const CreateThreadModal = () => {

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

	

	return (
		<>
		<div className="modal fade modal-lg" id="postThread" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="exampleModalLabel">Create a Thread</h5>
					</div>
					<form id="formPostThread">
						<div className="modal-body">

							<div id="categoryError" className="text-danger text-sm"></div>
							<select name="category" type="text" id="category" className="form-control mb-4">
								<option value="">--Select a Category--</option>
								<option value="1">Pokemon</option>
								<option value="2">Pokecard</option>
							</select>

							<div id="titleError" className="text-danger text-sm"></div>
							<div className="form-outline mb-4">
								<input name="title" type="text" id="title" className="form-control"/>
								<label className="form-label" htmlFor="title">Title</label>
							</div>


							<div id="contentError" className="text-danger text-sm"></div>
							<div className="form-outline mb-4">
								<textarea id="summernote" name="editordata" className="rounded"></textarea>
							</div>
						</div>
						<div className="modal-footer">
							<button type="submit" className="btn btn-dark">Post</button>
							<button type="button" className="btn btn-dark" data-mdb-dismiss="modal">Cancel</button>
						</div>
					</form>
				</div>
			</div>
		</div>

		

		</>
	)
}

export default CreateThreadModal