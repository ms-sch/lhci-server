/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const express = require('express');
const {createApp} = require('@lhci/server');
const basicAuth = require('express-basic-auth');

console.log('Starting server...');
(async () => {
    const app = express();
    const {app: lhciApp} = await createApp({
        psiCollectCron: {
            psiApiKey: process.env.PSI_API_KEY,
            sites: [
                /*
                  {
                  label: 'Production',
                  projectSlug: 'the-project',
                  schedule: '0 * * * *', // at the top of the hour, every hour
                  numberOfRuns: 5,
                  urls: ['http://example.com', 'http://example.com/pricing'],
                },

                 */
                {
                    label: 'Sweship Development',
                    branch: 'develop',
                    projectSlug: 'sweship-web',
                    schedule: '0 */4 * * *', // every 10 minutes
                    numberOfRuns: 3,
                    urls: [
                        'https://sweship.seals.schibsted.pl',
                        'https://sweship.seals.schibsted.pl/about-sweship'
                    ],
                },
            ],
        },
        storage: {
            storageMethod: 'sql',
            sqlDialect: 'postgres',
            ...(process.env.DATABSE_SSL === "false" ? {} : {
                sqlConnectionSsl: true,
                sqlDialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                },
            }),
            sqlConnectionUrl: process.env.DATABASE_URL,
        },
    });

    app.use(basicAuth({
        challenge: true,
        users: {'admin': process.env.ADMIN_PASS}
    }))
    app.use(lhciApp);
    app.listen(process.env.PORT || 3000, () => {
        console.log('Listening on port', process.env.PORT || 3000)
    });
})();
