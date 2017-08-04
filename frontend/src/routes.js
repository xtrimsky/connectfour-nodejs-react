import React from 'react';
import { Router, Route } from 'react-router';

//import App from './components/App';
import Welcome from './components/Welcome/Welcome';
import Play from './components/Play/Play';
import NotFound from './components/NotFound/NotFound';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={Welcome} />
    <Route path="/play" component={Play} />
    <Route path="*" component={NotFound} />
  </Router>
);

export default Routes;