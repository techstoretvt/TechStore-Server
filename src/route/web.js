import express from 'express'
import userController from '../controllers/userController'
import adminController from '../controllers/adminController'
import appController from '../controllers/appController'
import { runInContext } from 'lodash';

const fileUploader = require('../config/cloudinary.config');

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
    router.post('/api/add-type-product', fileUploader.single('file'), adminController.addTypeProduct)
    router.get('/api/get-all-type-product', adminController.getAllTypeProduct)
    router.delete('/api/delete-type-product-by-id', adminController.deleteTypeProduct)
    router.put('/api/update-type-produt-by-id', fileUploader.single('file'), adminController.updateTypeProductById)

    router.post('/api/add-trademark', adminController.addTrademark)
    router.get('/api/get-all-trademark', adminController.getAllTrademark)
    router.delete('/api/delete-trademark-by-id', adminController.deleteTrademarkById)
    router.put('/api/update-trademark-by-id', adminController.updateTrademarkById)

    router.post('/api/create-new-product', adminController.createNewProduct)
    router.post('/cloudinary-upload', fileUploader.single('file'), adminController.cloudinaryUpload);
    router.get('/api/get-list-product-by-page', adminController.getListProductByPage)
    router.put('/api/block-product', adminController.blockProduct)
    router.put('/api/edit-product-by-id', adminController.editProductById)
    router.put('/api/edit-image-product', fileUploader.single('file'), adminController.editImageProduct)
    router.post('/api/swap-image-product', adminController.swapImageProduct);
    router.get('/api/get-list-product-by-swap-and-page', adminController.getProductBySwapAndPage);
    router.post('/api/add-promotion-by-idproduct', adminController.addPromotionByIdProduct)


    //app api
    router.get('/api/v1/get-product-promotion-home', appController.getProductPromotionHome)
    router.get('/api/vi/get-top-sell-product', appController.getTopSellProduct)
    router.get('/api/vi/get-new-collection-product', appController.getNewCollectionProduct)


    return app.use('/', router);
}

export default initWebRoute;