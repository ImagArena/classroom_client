import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

import Main from './components/Main';
import PhotoUpload from './components/PhotoUpload';
import Slideshow from './components/Slideshow';

// Render the main component into the dom
ReactDOM.render((
<Router history={browserHistory}>

	<Route path='/'>
		<IndexRoute component={PhotoUpload} />
		<Route path='slideshow(/:timeframe)' component={Slideshow}/>
	</Route>

</Router>
), document.getElementById('app'));
