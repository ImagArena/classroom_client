require('normalize.css/normalize.css');
require('styles/Slideshow.scss')

import React from 'react';
import Axios from 'axios';
// import Clear from '../audio/Clear.mp3';

const seconds = 3;

export default class Slideshow extends React.Component {

	constructor() {
			super();
			// Initial state of the component
			this.state = {photos: [],
				currentPhoto: null,
				video: "http://localhost:3001/video/out.webm"
			};
	}

	componentDidMount = () => {

		if (this.props.params.timeframe == 'past'){
			this.setState({video: "http://localhost:3001/video/past.webm"})
		}

		var url = 'http://localhost:3001/download_photos?timeframe=' + this.props.params.timeframe;

		Axios.get(url)
			.then(function (response) {
				this.setState({photos: response.data});
				this.changePhotos();
	    }.bind(this))
		.catch(function (error) {
			console.log(error);
		})

		// initialize redirect
		var number = this.props.params.redirect;
		if (number) {
			window.onkeydown = function(){
				checkKey(event);
			};

			/// NEXT SLIDE
			function checkKey(event) {
				var key = event.keyCode;
					if (key == 38){
						console.log('nice')
						window.location.href =  "http://localhost:3001/sequences/lvl3/Slides/" + number + ".html";
					}
			}
		}

	}

	componentWillUnmount = () => {
		this.interval = false;
	}

	changePhotos = () => {
		var i=0;

		// initial photo waits for overlay
		setTimeout(function(){
			this.setState({currentPhoto: this.state.photos[i]});
		}.bind(this), 300)

		this.interval = setInterval(function(){
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
						<video id="overlay" autoPlay="true" src={this.state.video} type="video/webm"></video>
						<img id="current-image" src={this.state.currentPhoto} />
					</div>
				</div>
    );
  }
}
