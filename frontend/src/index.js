import React from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router';
import { BrowserRouter, Switch } from 'react-router-dom'

import Welcome from './components/Welcome/Welcome';
import Games from './components/Games/Games';
import NotFound from './components/NotFound/NotFound';

import './index.css';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Welcome} />
            <Route path='/games/:number' component={Games} />
            <Route path='*' component={NotFound} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);