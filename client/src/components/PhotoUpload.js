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

export default class PhotoUpload extends React.Component {

	constructor() {
			super();
			this.state = {groups: []};
			this.removedfile = (file) => {
				// Axios.post('http://localhost:3001/delete_photo', {fileName: file.name})
				// .then( function (response) {
				// }).catch( function(err) {
				// 	console.log('error');
				// 	console.log(err);
				// })
				console.log(file)
			}
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
			document.getElementById('dropzone-container').className = '';
		}).catch( function(err) {
			console.log('error');
			console.log(err);
		})
	}

  render = () => {

		const componentConfig = {
		    iconFiletypes: ['.jpg', '.png', '.gif'],
		    showFiletypeIcon: true,
				postUrl: 'http://localhost:3001/upload_photos',
		};

		const djsConfig = {
			addRemoveLinks: true
		}

		const eventHandlers = {
			removedfile: this.removedfile
		}

    return (
				<div>
					<Navbar />
					<h2>Photo Upload</h2>
					<div id='dropdown-container'>
						<Dropdown options={this.state.groups} placeholder="Choose group name" onChange={this.handleChange} />
					</div>
					<div id="dropzone-container" className='loading'>
						<DropzoneComponent config={componentConfig} djsConfig={djsConfig} eventHandlers={eventHandlers} />
					</div>
				</div>
    );
  }
}
