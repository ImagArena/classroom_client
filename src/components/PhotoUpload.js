require('normalize.css/normalize.css');
require('styles/App.scss');
require('styles/PhotoUpload.scss')

import React from 'react';
import Dropzone from 'react-dropzone';

// class DropzoneElement extends React.Component {
//     onDrop = (files) => {
//       console.log('Received files: ', files);
//     },
//
//     onDrop = () => {
//       return (
//           <div>
//             <Dropzone onDrop={this.onDrop}>
//               <div>Try dropping some files here, or click to select files to upload.</div>
//             </Dropzone>
//           </div>
//       );
//     }
// };

var DropzoneElement = React.createClass({
    onDrop: function (files) {
      console.log('Received files: ', files);
    },

    render: function () {
      return (
          <div>
            <Dropzone onDrop={this.onDrop}>
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
          </div>
      );
    }
});

class AppComponent extends React.Component {
  render() {
    return (
				<div>
					<h2>Photo Upload</h2>
					<div id="dropzone-container">
						<DropzoneElement />
					</div>
				</div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
