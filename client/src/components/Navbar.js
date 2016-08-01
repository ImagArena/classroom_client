import React from 'react';
import {Link} from 'react-router';

class Navbar extends React.Component {
  render() {
    return (
      <div className="index">
				<div id="navbar">
					<h1>Imagarena Classroom Client (Demo)</h1>
					<div id="nav-links">
						<Link to="/photo_upload"><b>Upload Photos</b></Link>
						<Link to="/slideshow">Watch Slideshow</Link>
					</div>
				</div>
      </div>
    );
  }
}

Navbar.defaultProps = {
};

export default Navbar;
