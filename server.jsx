import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RoutingContext, match } from 'react-router';
import createLocation from 'history/lib/createLocation';
import routes from 'routes';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import * as reducers from 'reducers';

const app = express();

app.use((req, res) => {

    /* Constants */
    const location = createLocation(req.url);
    const reducer = combineReducers(reducers);
    const store = createStore(reducer);

    match( {routes, location }, (err, redirectLocation, renderProps) => {
        /* Set up server responses and routing */
        if (err) {
            console.error(err);
            return res.status(500).end('Internal server error');
        }

        if (!renderProps) {
            return res.status(404).end('Page not found');
        }

        const InitialComponent = (
            <Provider store={store}>
                <RoutingContext {...renderProps} />
            </Provider>
        );

        const initialState = store.getState();

        const componentHTML = renderToString(InitialComponent);

        /* Set up app DOM architecture */
        const HTML = `
            <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="utf8">
                        <title>To Do List</title>
                        <script type="application/javascript">
                            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
                        </script>
                        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous">
                    </head>
                    <body>
                        <div id="react-view">${componentHTML}</div>
                        <script type="application/javascript" src="/bundle.js"></script>
                    </body>
                </html>
            `;

        res.end(HTML);
    });
});

export default app;
