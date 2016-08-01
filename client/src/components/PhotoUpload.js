require('normalize.css/normalize.css');
require('styles/PhotoUpload.scss');
require('../../node_modules/react-dropzone-component/styles/filepicker.css');
require('../../node_modules/dropzone/dist/min/dropzone.min.css');

import React from 'react';
import Axios from 'axios';
import DropzoneComponent from 'react-dropzone-component';
import Navbar from '../components/Navbar';

var componentConfig = {
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: true,
		postUrl: 'http://localhost:3001/upload_photos'
};

class PhotoUpload extends React.Component {

	componentDidMount = () => {
		Axios.get('http://localhost:3001/get_classnames')
			.then(function(response) {
				console.log(response);
			})
			.catch(function(err) {
				console.log(err);
			})
		}

	handleChange = () => {
		console.log("fuck");
	}

  render = () => {
    return (
				<div>
					<Navbar />
					<h2>Photo Upload</h2>
					{/*<select onChange={this.handleChange}>
					</select> */}

					<div id="dropzone-container">
						<DropzoneComponent config={componentConfig}/>
					</div>
				</div>
    );
  }
}

PhotoUpload.defaultProps = {
};

export default PhotoUpload;
