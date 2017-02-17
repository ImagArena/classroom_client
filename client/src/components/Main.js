require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import {Link} from 'react-router';
import Navbar from '../components/Navbar';

class Main extends React.Component {
  render() {

    return (
      <div className="index">
				<Navbar />
				<div id="home-container">
					<h1 id="heads-up">Want to upload photos? Click here:</h1>
					<Link id="big-ass-button" to="/photo_upload">Upload Photos</Link>
				</div>
      </div>
    );
  }
}

Main.defaultProps = {
};

export default Main;
