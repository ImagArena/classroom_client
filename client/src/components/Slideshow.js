require('normalize.css/normalize.css');
require('styles/Slideshow.scss')

import React from 'react';
import Axios from 'axios'

const seconds = 3;

export default class Slideshow extends React.Component {

	constructor() {
			super();
			// Initial state of the component
			this.state = {photos: [], currentPhoto: null}
	}

	componentDidMount = () => {
		Axios.get('http://localhost:3001/download_photos')
			.then(function (response) {
				this.setState({photos: response.data});
				this.changePhotos();
	    }.bind(this))
		.catch(function (error) {
			console.log(error);
		})

	}

	changePhotos = () => {
		console.log(this.state.photos)
		var i=0;
		this.setState({currentPhoto: this.state.photos[i]})
		setInterval(function(){
			i++;
			if (i > this.state.photos.length-1){
				i=0;
			}
			this.setState({currentPhoto: this.state.photos[i]})
		}.bind(this), seconds*1000)
	}

  render () {
    return (
				<div>
					<div id="slideshow">
						<video id="overlay" autoPlay="true" src="http://localhost:3001/video/out.webm" type="video/webm"></video>
						<img id="current-image" src={this.state.currentPhoto} />
					</div>
				</div>
    );
  }
}
