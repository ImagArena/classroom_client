require('normalize.css/normalize.css');
require('styles/Slideshow.scss')

import React from 'react';
import $ from 'jquery';

export default class Slideshow extends React.Component {

	constructor() {
			super();
			// Initial state of the component
			this.state = {photos: [], currentPhoto: null}
	}

	componentDidMount = () => {
		$.get('http://localhost:3001/download_photos', function (result) {
			this.setState({photos: result});
			this.changePhotos()
    }.bind(this));
	}

	changePhotos = () => {
		var i=0;
		this.setState({currentPhoto: this.state.photos[i]})
		setInterval(function(){
			i++;
			if (i > this.state.photos.length-1){
				i=0;
			}
			this.setState({currentPhoto: this.state.photos[i]})
		}.bind(this), 3000)
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
