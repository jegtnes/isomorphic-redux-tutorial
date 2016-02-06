import express                 from 'express';
import React                   from 'react';
import {renderToString}        from 'react-dom/server';
import {RoutingContext, match} from 'react-router';
import createLocation          from 'history/lib/createLocation';
import routes                  from './shared/routes';

import {createStore, combineReducers} from 'redux';
import { Provider }                   from 'react-redux';
import * as reducers                  from './shared/reducers'

const app = express();

app.use((req, res) => {
  const location = createLocation(req.url);
  const reducer  = combineReducers(reducers);
  const store    = createStore(reducer);

  match({routes, location}, (err, redirectLocation, renderProps) => {
    if (err) {
      console.error(err);
      return res.status(500).end('Internal server error. Shit.');
    }

    if (!renderProps) {
      return res.status(404).end('Not found. Fuck.');
    }

    const initialComponent = (
      <Provider store={store}>
        <RoutingContext {...renderProps} />
      </Provider>
    );

    const initialState = store.getState();

    const componentHTML = renderToString(initialComponent)

    const HTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Isomorphic Redux Demo</title>
      </head>
      <body>
        <div id="react-view">${componentHTML}</div>

        <!-- Send initial Redux state over the wire-->
        <script type="application/javascript">
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script type="application/javascript" src="/bundle.js"></script>
      </body>
    </html>
    `

    res.end(HTML);
  });
});

export default app;
