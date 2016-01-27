import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';

const ASSETS = '../assets/style';

require('../assets/style/normalize.css');
require('../assets/style/skeleton.css');
require('../assets/style/style.css');

ReactDOM.render(
  <App />,
  document.querySelector('.app')
);
