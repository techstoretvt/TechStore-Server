import express from "express";
require('dotenv').config();
import bodyParser from "body-parser";
const cors = require('cors');
const { Server } = require('socket.io')
const http = require('http');
const { ApolloServer } = require('apollo-server-express')

import configViewEngine from "./config/viewEngine";
import initWebRoute from "./route/web";
const typeDefs = require('./GraphQL/schema/schema')
const resolvers = require('./GraphQL/resolver/resolver')

const app = express();



const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: `${process.env.LINK_FONTEND}`,
        methods: ["GET", "POST"]
    }
});


//View engine
configViewEngine(app);

app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

initWebRoute(app);

//web socket
io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('send-email-verify', function (from, msg) {
        console.log('MSG', from, ' saying ', msg);

        io.emit(`email-verify-${from}`, {
            message: 'success',
            linkFe: process.env.LINK_FONTEND
        })
    });
})

//graphql
const serverQL = new ApolloServer({
    typeDefs,
    resolvers
})


//run server
serverQL.start().then(res => {
    serverQL.applyMiddleware({ app });

    const port = process.env.PORT
    server.listen(port, () => {
        console.log('Runing server succeed!');
        console.log(`Server RestFull API at http://localhost:${port}/api`);
        console.log(`Server GraphQL at http://localhost:${port}${serverQL.graphqlPath}`);
    })
})



