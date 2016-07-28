require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import {Link} from 'react-router';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
				<div id="navbar">
					<h1>Imagarena Classroom Client (Demo)</h1>
					<div id="nav-links">
						<Link to="/photo_upload">Upload Photos</Link>
						<Link to="/slideshow">Watch Slideshow</Link>
					</div>
				</div>
				{this.props.children}
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
