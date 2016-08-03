import React from 'react';
import {Link} from 'react-router';

class Navbar extends React.Component {
  render() {
    return (
      <div className="index">
				<div id="navbar">
					<h1>Imagarena Photo Client (Alpha)</h1>
					<div id="nav-links">
						<Link to="/"><b>Upload Photos</b></Link>
						<Link to="/slideshow/present">Preview Slideshow A (Real-Time)</Link>
						<Link to="/slideshow/past">Preview Slideshow B (Past)</Link>
					</div>
				</div>
      </div>
    );
  }
}

Navbar.defaultProps = {
};

export default Navbar;
