require('normalize.css/normalize.css');
require('styles/Slideshow.scss')

import React from 'react';
import Axios from 'axios';

const seconds = 3;

export default class Slideshow extends React.Component {

	constructor() {
			super();
			// Initial state of the component
			this.state = {photos: [],
				currentPhoto: {file: null},
				video: "http://localhost:3001/video/out.webm"
			};
	}

	componentDidMount = () => {

		if (this.props.params.timeframe == 'past'){
			this.setState({video: "http://localhost:3001/video/past.webm"})
		}

		var url = 'http://localhost:3001/download_photos?timeframe=' + this.props.params.timeframe + '&groupname=' + this.props.params.groupname + '&levelnumber=' + this.props.params.levelnumber;

		Axios.get(url)
			.then(function (response) {
				let photos = response.data;
				for (let i=4; i < photos.length; i++) {
					if (!((i-1) % 5 )) {
						photos.splice(i, 0, 'http://localhost:3001/ClearReminder.gif');
					}
				}

				this.setState({photos: response.data});
				this.changePhotos();
	    }.bind(this))
		.catch(function (error) {
			console.log(error);
		})

		setTimeout(function() {
			document.getElementById('photo-label').className = '';
		}, 6000)

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
						<img id="current-image" src={this.state.currentPhoto.file} />
						{ this.props.params.timeframe == 'past' ? <div id="photo-label" className="hidden"><h2>{this.state.currentPhoto.groupName}</h2><span id="level">Level {this.state.currentPhoto.levelNumber}</span></div> : null}
					</div>
				</div>
    );
  }
}
