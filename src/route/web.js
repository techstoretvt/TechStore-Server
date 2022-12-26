import express from 'express'
import userController from '../controllers/userController'

let router = express.Router();

const initWebRoute = (app) => {
    router.get('/', (req, res, next) => { res.send('Hello backend') })
    router.get('/account', userController.accountVerifyPage)
    router.get('/verify-email', userController.verifyEmail)

    //user api
    router.post('/api/create-user', userController.CreateUser)
    router.post('/api/verify-create-user', userController.verifyCreateUser)
    router.post('/api/user-login', userController.userLogin)
    router.post('/api/refresh-token', userController.refreshToken)
    router.get('/api/get-user-login', userController.getUserLogin);
    router.post('/api/login-google', userController.loginGoogle)
    router.post('/api/login-facebook', userController.loginFacebook)

    return app.use('/', router);
}

export default initWebRoute;