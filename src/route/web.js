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
    router.post('/api/v1/add-product-to-cart', userController.addProductToCart)
    router.post('/api/v1/add-cart-or-move-cart', userController.addCartOrMoveCart)
    router.post('/api/v1/add-new-address-user', userController.addNewAddressUser)
    router.get('/api/v1/get-address-user', userController.getAddressUser)
    router.put('/api/v1/set-default-address', userController.setDefaultAddress)
    router.delete('/api/v1/delete-address-user', userController.deleteAddressUser)
    router.put('/api/v1/edit-address-user', userController.editAddressUser)
    router.get('/api/v1/get-list-cart-user', userController.getListCartUser)
    router.put('/api/v1/edit-amount-cart-user', userController.editAmountCartUser)
    router.put('/api/v1/choose-product-in-cart', userController.chooseProductInCart)
    router.delete('/api/v1/delete-product-in-cart', userController.deleteProductInCart)
    router.put('/api/v1/update-classify-product-in-cart', userController.updateClassifyProductInCart)
    router.post('/api/v1/create-new-bill', userController.createNewBill)
    router.put('/api/v1/choose-all-product-in-cart', userController.chooseAllProductInCart)
    router.get('/api/v1/get-user-login-refresh-token', userController.getUserLoginRefreshToken)

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
    router.post('/api/add-promotion-by-idproduct', adminController.addPromotionByIdProduct);
    router.delete('/api/v1/delete-error-product', adminController.deleteErrorProduct)


    //app api
    router.get('/api/v1/get-product-promotion-home', appController.getProductPromotionHome)
    router.get('/api/vi/get-top-sell-product', appController.getTopSellProduct)
    router.get('/api/vi/get-new-collection-product', appController.getNewCollectionProduct)
    router.get('/api/v1/get-product-type-flycam', appController.getProductFlycam)
    router.get('/api/v1/get-list-product-may-like', appController.getListProductMayLike)


    //test
    router.get('/api/test-api', adminController.testApi)

    return app.use('/', router);
}

export default initWebRoute;