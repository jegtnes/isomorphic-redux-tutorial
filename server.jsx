import express                 from 'express';
import React                   from 'react';
import {renderToString}        from 'react-dom/server';
import {RoutingContext, match} from 'react-router';
import createLocation          from 'history/lib/createLocation';
import routes                  from './shared/routes';

const app = express();

app.use((req, res) => {
  const location = createLocation(req.url);
  match({routes, location}, (err, redirectLocation, renderProps) => {
    if (err) {
      console.error(err);
      return res.status(500).end('Internal server error. Shit.');
    }

    if (!renderProps) {
      return res.status(404).end('Not found. Fuck.');
    }

    const initialComponent = (
      <RoutingContext {...renderProps} />
    );

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
        <script type="application/javascript" src="/bundle.js"></script>
      </body>
    </html>
    `

    res.end(HTML);
  });
});

export default app;
