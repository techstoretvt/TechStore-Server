import express from 'express'
import userController from '../controllers/userController'

let router = express.Router();

const initWebRoute = (app) => {
    router.get('/', (req, res) => {
        res.send('Hello backend')
    })

    router.post('/api/create-user', userController.CreateUser)
    router.post('/api/verify-create-user', userController.verifyCreateUser)
    router.post('/api/user-login', userController.userLogin)
    router.post('/api/refresh-token', userController.refreshToken)
    router.get('/api/get-user-login', userController.getUserLogin);

    return app.use('/', router);
}

export default initWebRoute;