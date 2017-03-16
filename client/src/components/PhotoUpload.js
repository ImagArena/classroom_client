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
			this.state = {
				groups: [],
				groupName: '',
				levelNumber: null,
				levels: [
					{value: 1, label: "Level 1"},
					{value: 2, label: "Level 2"},
					{value: 3, label: "Level 3"},
					{value: 4, label: "Level 4"},
					{value: 5, label: "Level 5"},
					{value: 6, label: "Level 6"}
				]
			};

			this.noDelete = false;
			this.removedfile = (file) => {
				if (!this.noDelete) {
					Axios.post('http://localhost:3001/delete_photo', {fileName: file.name})
					.then( function (response) {
					}).catch( function(err) {
						console.log('error');
						console.log(err);
					})
					console.log(file)
				}
			}

	}

	componentDidMount = () => {
		Axios.get('http://localhost:3001/get_groupinfo')
			.then(function(response) {
				this.setState({
					groups: response.data.groups,
					groupName: response.data.groupName,
					levelNumber: response.data.levelNumber.toString()
				})
			}.bind(this))
			.catch(function(err) {
				console.log(err);
			})
	}

	componentWillUnmount = () => {
		this.noDelete = true;
	}

	changeGroupName = (option) => {
		this.setState({groupName: option}, this.handleChange);
	}

	changelevelNumber = (option) => {
		this.setState({levelNumber: option.value}, this.handleChange);
	}

	handleChange = () => {
		Axios.post('http://localhost:3001/set_groupinfo', {groupName: this.state.groupName, levelNumber: this.state.levelNumber})
		.then(function (response) {
			var dropzone = document.getElementById('dropzone-container');
			if (dropzone.className)
				dropzone.className = '';

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

		var dropboy = (this.state.groupName && this.state.levelNumber) ? 	<div id="dropzone-container"><DropzoneComponent config={componentConfig} djsConfig={djsConfig} eventHandlers={eventHandlers} /></div> : null;

    return (
				<div>
					<Navbar />
					<h2>Photo Upload</h2>
					<div id='dropdown-container'>
						<Dropdown options={this.state.groups} placeholder="Choose Group" value={this.state.groupName} onChange={this.changeGroupName} />
						<Dropdown options={this.state.levels} placeholder="Select Level Number" value={this.state.levels[this.state.levelNumber - 1]} onChange={this.changelevelNumber} />
					</div>

					{dropboy}

				</div>
    );
  }
}
