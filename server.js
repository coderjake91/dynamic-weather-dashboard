const htmlRoute = require('./routes');
const express = require('express');
//use and environment variable to set the application PORT (HTTP = port 80, HTTPS = port 443)
const PORT = process.env.PORT || 3001;

//instantiate the server
const app = express();

//---------------Middleware----------------------------------------------------
//parse incoming JSON data
app.use(express.json());
//serve other static assets in the public folder
app.use(express.static('public'));
//if client navigates to <host>/, then serve index.html
app.use('/', htmlRoute);
//-----------------------------------------------------------------------------

//alow server to listen on port 3001
app.listen(PORT, () => {
    console.log(`Discharge Weather server now on ${PORT}!`);
});