/* tslint:disable:no-console */
import 'reflect-metadata';
import 'zone.js/dist/zone-node';

import {enableProdMode} from '@angular/core';
import {ngExpressEngine} from '@nguniversal/express-engine';
import * as express from 'express';
import {join} from 'path';

enableProdMode();

const app = express();
const PORT = process.env.PORT || 3333;
const DIST_FOLDER = join(process.cwd(), 'dist');
const DEMO_FOLDER = join(DIST_FOLDER, 'demo', 'browser');
const {AppServerModuleNgFactory} = require('../server/main');

app.engine(
    'html',
    ngExpressEngine({
        bootstrap: AppServerModuleNgFactory,
    }),
);

app.set('view engine', 'html');
app.set('views', DEMO_FOLDER);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });

// Server static files from /browser
app.get(
    '*.*',
    express.static(DEMO_FOLDER, {
        maxAge: '1y',
    }),
);

// All regular routes use the Universal engine
app.get('*', (req, res) => {
    // Add information on current browser and location
    addToGlobal(
        'location',
        new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`),
    );
    addToGlobal('navigator', {userAgent: req.get('user-agent')});

    res.render('index', {req});
});

// Start up the Node server
app.listen(PORT, () => {
    console.log(`Node Express server listening on http://localhost:${PORT}`);
});

function addToGlobal(key: string, value: any) {
    (global as any)[key] = value;
}
