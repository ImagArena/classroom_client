require('normalize.css/normalize.css');
require('styles/PhotoUpload.scss');
require('../../node_modules/react-dropzone-component/styles/filepicker.css');
require('../../node_modules/dropzone/dist/min/dropzone.min.css');
require('../../node_modules/react-dropdown/style.css');

import React from 'react';
import Dropdown from 'react-dropdown'
import Axios from 'axios';
import DropzoneComponent from 'react-dropzone-component';
import Navbar from '../components/Navbar';

var componentConfig = {
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: true,
		postUrl: 'http://localhost:3001/upload_photos'
};

export default class PhotoUpload extends React.Component {

	constructor() {
			super();
			this.state = {groups: []}
	}

	componentDidMount = () => {
		Axios.get('http://localhost:3001/get_groupnames')
			.then(function(response) {
				this.setState({groups: response.data})
			}.bind(this))
			.catch(function(err) {
				console.log(err);
			})
	}

	handleChange = (option) => {
		Axios.post('http://localhost:3001/set_groupname', {group: option.value})
		.then( function (response) {
			console.log(response.status);
			document.getElementById('dropzone-container').className = '';
		}).catch( function(err) {
			console.log('error');
			console.log(err);
		})
	}

  render = () => {
    return (
				<div>
					<Navbar />
					<h2>Photo Upload</h2>
					<Dropdown options={this.state.groups} placeholder="Choose group name" onChange={this.handleChange}/>
					<div id="dropzone-container" className='loading'>
						<DropzoneComponent config={componentConfig}/>
					</div>
				</div>
    );
  }
}
