import express from "express";
require('dotenv').config();
import bodyParser from "body-parser";
const cors = require('cors');

import initWebRoute from "./Route/web";


const app = express();

app.use(cors());
// app.use(cors({ origin: true }))
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//     // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

initWebRoute(app);


const port = process.env.PORT
app.listen(port, () => {
    console.log('Runing server succeed!');
    console.log('Listen from port:', port);
})
