import express from 'express'
import userController from '../controllers/userController'
import adminController from '../controllers/adminController'

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
    router.post('/api/login-github', userController.loginGithub)

    //admin api
    router.post('/api/add-type-product', adminController.addTypeProduct)
    router.get('/api/get-all-type-product', adminController.getAllTypeProduct)
    router.delete('/api/delete-type-product-by-id', adminController.deleteTypeProduct)
    router.put('/api/update-type-produt-by-id', adminController.updateTypeProductById)
    router.post('/api/add-trademark', adminController.addTrademark)
    router.get('/api/get-all-trademark', adminController.getAllTrademark)



    return app.use('/', router);
}

export default initWebRoute;