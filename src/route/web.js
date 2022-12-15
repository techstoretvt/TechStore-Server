import express from 'express'
import userController from '../controllers/userController'

let router = express.Router();

const initWebRoute = (app) => {

    router.get('/api/create-user', userController.CreateUser)

    return app.use('/', router);
}

export default initWebRoute;