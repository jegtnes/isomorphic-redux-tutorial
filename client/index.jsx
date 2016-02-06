import React                          from 'react';
import {render}                       from 'react-dom';
import {Router}                       from 'react-router';
import createBrowserHistory           from 'history/lib/createBrowserHistory';
import {routes}                       from 'routes';
import {createStore, combineReducers} from 'redux';
import {Provider}                     from 'react-redux';
import * as reducers                  from '../shared/reducers';
import {fromJS}                       from 'immutable';


const history = createBrowserHistory();

let initialState = window.__INITIAL_STATE__;

// Transform state into Immutable collections except for top level keys
Object.keys(initialState).forEach(key => {
  initialState[key] = fromJS(initialState[key]);
});

const reducer = combineReducers(reducers);
const store   = createStore(reducer, initialState);

render(
  <Provider store={store}>
    <Router children={routes} history={history} />
  </Provider>,
  document.getElementById('react-view')
);
