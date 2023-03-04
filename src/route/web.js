import express from 'express'
import userController from '../controllers/userController'
import adminController from '../controllers/adminController'
import appController from '../controllers/appController'
const fileUploader = require('../config/cloudinary.config');
import multer from 'multer';
import path from 'path'

let router = express.Router();

let appRoot = require('app-root-path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + '/src/public/videoTam/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

let upload = multer({ storage })


const initWebRoute = (app) => {
    router.get('/', (req, res, next) => {
        res.send('Hello backend -- Link frontend: <a href="techstoretvt.vercel.app">go to the website</a>')
    })
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
    router.get('/api/v1/get-list-bill-by-type', userController.getListBillByType)
    router.put('/api/v1/user-cancel-bill', userController.userCancelBill)
    router.post('/api/v1/user-repurchase-bill', userController.userRepurchaseBill)
    router.put('/apt/v1/get-code-verify-forget-pass', userController.getCodeVeridyForgetPass)
    router.put('/api/v1/change-pass-forget', userController.changePassForget)
    router.post('/api/v1/check-key-verify', userController.checkKeyVerify)
    router.put('/api/v1/has-received-product', userController.hasReceivedProduct)
    router.post('/api/v1/buy-product-by-card', userController.buyProductByCard)
    router.get('/api/v1/buy-product-by-card/success', userController.buyProductByCardSucess);
    router.get('/cancel', (req, res) => res.send('Cancelled (Đơn hàng đã hủy)'));
    router.post('/api/v1/create-new-evaluate-product', userController.createNewEvaluateProduct)
    router.post('/apit/v1/upload-video-evaluate-product', upload.single('video'), userController.uploadVideoEvaluateProduct)
    router.post('/apit/v1/upload-images-evaluate-product', fileUploader.array('file'), userController.uploadImagesEvaluateProduct)
    router.delete('/api/v2/create-new-evaluate-product-failed', userController.createNewEvaluateProductFailed)
    router.put('/api/v1/update-evaluate-product', userController.updataEvaluateProduct)
    router.delete('/api/v2/delete-video-evaluate', userController.deleteVideoEvaluate)
    router.post('/api/v1/update-video-evaluate', upload.single('video'), userController.updateVideoEvaluate)
    router.put('/api/v1/update-profile-user', userController.updateProfileUser)
    router.put('/api/v1/update-avatar-user', fileUploader.single('file'), userController.updateAvatarUser)
    router.put('/api/v1/get-confirm-code-change-pass', userController.getConfirmCodeChangePass)
    router.put('/api/v1/confirm-code-change-pass', userController.confirmCodeChangePass)
    router.post('/api/v1/create-new-blog', userController.createNewBlog)
    router.post('/api/v1/create-new-image-blog', fileUploader.array('file'), userController.createNewImageBlog)
    router.post('/api/v1/upload-new-video-blog', upload.single('video'), userController.uploadVideoNewBlog)
    router.get('/api/v1/get-blog-by-id', userController.getBlogById)

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
    router.post('/cloudinary-upload', fileUploader.array('file'), adminController.cloudinaryUpload);
    router.get('/api/get-list-product-by-page', adminController.getListProductByPage)
    router.put('/api/block-product', adminController.blockProduct)
    router.put('/api/edit-product-by-id', adminController.editProductById)
    router.put('/api/edit-image-product', fileUploader.single('file'), adminController.editImageProduct)
    router.post('/api/swap-image-product', adminController.swapImageProduct);
    router.get('/api/get-list-product-by-swap-and-page', adminController.getProductBySwapAndPage);
    router.post('/api/add-promotion-by-idproduct', adminController.addPromotionByIdProduct);
    router.delete('/api/v1/delete-error-product', adminController.deleteErrorProduct);

    router.put('/api/v1/confirm-bill-by-id', adminController.confirmBillById)
    router.put('/api/v1/cancel-bill-by-id', adminController.cancelBillById)

    router.post('/api/v1/create-new-keyword', adminController.createNewKeyWord)



    //app api
    router.get('/api/v1/get-product-promotion-home', appController.getProductPromotionHome)
    router.get('/api/vi/get-top-sell-product', appController.getTopSellProduct)
    router.get('/api/vi/get-new-collection-product', appController.getNewCollectionProduct)
    router.get('/api/v1/get-product-type-flycam', appController.getProductFlycam)
    router.get('/api/v1/get-list-product-may-like', appController.getListProductMayLike)
    router.get('/api/v1/get-evaluate-by-id-product', appController.getEvaluateByIdProduct)
    router.get('/api/v1/search-product', appController.searchProduct)




    //test
    router.get('/api/test-api', adminController.testApi)

    router.get('/api/v1/get-list-product', appController.GetListProduct)
    router.get('/api/v1/create-product', appController.createProduct)

    return app.use('/', router);
}

export default initWebRoute;