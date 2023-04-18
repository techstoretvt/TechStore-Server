import express from "express";
require('dotenv').config();
import bodyParser from "body-parser";
const cors = require('cors');
const { Server } = require('socket.io')
const http = require('http');
const { ApolloServer } = require('apollo-server-express')

import configViewEngine from "./config/viewEngine";
import initAppRoute from "./route/appRoute";
import initUserRoute from './route/userRoute'
import initAdminRoute from './route/adminRoute'
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

app.use(cors({
    exposedHeaders: ['authorization']
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

initAppRoute(app);
initUserRoute(app);
initAdminRoute(app);

//web socket
io.on('connection', (socket) => {
    console.log('user connected', Math.floor(Math.random() * 10));

    socket.on('send-email-verify', function (from, msg) {
        console.log('MSG', from, ' saying ', msg);

        io.emit(`email-verify-${from}`, {
            message: 'success',
            linkFe: process.env.LINK_FONTEND
        })
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})
export const handleEmit = (nameEmit, contentEmit) => {
    io.emit(nameEmit, contentEmit)
}

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



