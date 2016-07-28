require('normalize.css/normalize.css');
require('styles/PhotoUpload.scss')

import React from 'react';
import DropzoneComponent from 'react-dropzone-component';

var componentConfig = {
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: true,
		postUrl: 'http://localhost:3001/upload_photos'
    // Notice how there's no postUrl set here
};

class PhotoUpload extends React.Component {

	handleChange () {

	}

  render () {
    return (
				<div>
					<h2>Photo Upload</h2>
					{/*<input onChange={this.handleChange} id="class-name" type="text" placeholder="Class Name" />*/}
					<div id="dropzone-container">
						<DropzoneComponent config={componentConfig}/>
					</div>
				</div>
    );
  }
}

PhotoUpload.defaultProps = {
};

export default PhotoUpload;
