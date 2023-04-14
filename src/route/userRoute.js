import express from 'express'
import userController from '../controllers/userController'
const fileUploader = require('../config/cloudinary.config');
import multer from 'multer';
import path from 'path'
import { routes } from '../services/commont'

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

let upload = multer({
    storage,
    limits: { fileSize: 104857600 }
})


const initUserRoute = (app) => {

    //user api
    router.get('/cancel', (req, res) => res.send('Cancelled (Đơn hàng đã hủy)'));

    router.get(routes.getUserLogin, userController.getUserLogin);
    router.get(routes.getAddressUser, userController.getAddressUser)
    router.get(routes.getListCartUser, userController.getListCartUser)
    router.get(routes.getUserLoginRefreshToken, userController.getUserLoginRefreshToken)
    router.get(routes.getListBillByType, userController.getListBillByType)
    router.get(routes.getBlogEditById, userController.getBlogById)
    router.get(routes.getListBlogUserByPage, userController.getListBlogUserByPage)
    router.get(routes.getShortVideoById, userController.getShortVideoById)
    router.get(routes.buyProductByCardSucess, userController.buyProductByCardSucess);
    router.get(routes.getListBlogByIdUser, userController.getListBlogByIdUser)
    router.get(routes.getListCollectionBlogUserByPage, userController.getListCollectionBlogUserByPage)
    router.get(routes.checkUserLikeShortVideo, userController.checkUserLikeShortVideo)
    router.get(routes.CheckSaveCollectionShortVideo, userController.CheckSaveCollectionShortVideo)
    router.get(routes.getListVideoByIdUser, userController.getListVideoByIdUser)
    router.get(routes.getUserById, userController.getUserById)
    router.get(routes.checkLikeBlogById, userController.checkLikeBlogById)
    router.get(routes.checkSaveBlogById, userController.checkSaveBlogById)


    router.post(routes.CreateUser, userController.CreateUser)
    router.post(routes.verifyCreateUser, userController.verifyCreateUser)
    router.post(routes.userLogin, userController.userLogin)
    router.post(routes.refreshToken, userController.refreshToken)
    router.post(routes.loginGoogle, userController.loginGoogle)
    router.post(routes.loginFacebook, userController.loginFacebook)
    router.post(routes.loginGithub, userController.loginGithub)
    router.post(routes.addProductToCart, userController.addProductToCart)
    router.post(routes.addCartOrMoveCart, userController.addCartOrMoveCart)
    router.post(routes.addNewAddressUser, userController.addNewAddressUser)
    router.post(routes.createNewBill, userController.createNewBill)
    router.post(routes.userRepurchaseBill, userController.userRepurchaseBill)
    router.post(routes.checkKeyVerify, userController.checkKeyVerify)
    router.post(routes.buyProductByCard, userController.buyProductByCard)
    router.post(routes.createNewEvaluateProduct, userController.createNewEvaluateProduct)
    router.post(routes.uploadImagesEvaluateProduct, fileUploader.array('file'), userController.uploadImagesEvaluateProduct)
    router.post(routes.updateVideoEvaluate, upload.single('video'), userController.updateVideoEvaluate)
    router.post(routes.createNewBlog, userController.createNewBlog)
    router.post(routes.createNewImageBlog, fileUploader.array('file'), userController.createNewImageBlog)
    router.post(routes.uploadVideoNewBlog, upload.single('video'), userController.uploadVideoNewBlog)
    router.post(routes.uploadVideoEvaluateProduct, upload.single('video'), userController.uploadVideoEvaluateProduct)
    router.post(routes.shareProduct, userController.shareProduct)
    router.post(routes.shareBlog, userController.shareBlog)
    router.post(routes.toggleLikeBlog, userController.toggleLikeBlog)
    router.post(routes.createNewCommentBlog, userController.createNewCommentBlog)
    router.post(routes.createNewShortVideo, userController.createNewShortVideo)
    router.post(routes.uploadCoverImageShortVideo, fileUploader.single('file'), userController.uploadCoverImageShortVideo)
    router.post(routes.uploadVideoForShortVideo, upload.single('video'), userController.uploadVideoForShortVideo)
    router.post(routes.saveBlogCollection, userController.saveBlogCollection)
    router.post(routes.createCommentShortVideo, userController.createCommentShortVideo)
    router.post(routes.toggleLikeShortVideo, userController.toggleLikeShortVideo)
    router.post(routes.saveCollectionShortVideo, userController.saveCollectionShortVideo)



    router.put(routes.setDefaultAddress, userController.setDefaultAddress)
    router.put(routes.editAddressUser, userController.editAddressUser)
    router.put(routes.editAmountCartUser, userController.editAmountCartUser)
    router.put(routes.chooseProductInCart, userController.chooseProductInCart)
    router.put(routes.updateClassifyProductInCart, userController.updateClassifyProductInCart)
    router.put(routes.chooseAllProductInCart, userController.chooseAllProductInCart)
    router.put(routes.userCancelBill, userController.userCancelBill)
    router.put(routes.getCodeVeridyForgetPass, userController.getCodeVeridyForgetPass)
    router.put(routes.changePassForget, userController.changePassForget)
    router.put(routes.hasReceivedProduct, userController.hasReceivedProduct)
    router.put(routes.updataEvaluateProduct, userController.updataEvaluateProduct)
    router.put(routes.updateProfileUser, userController.updateProfileUser)
    router.put(routes.updateAvatarUser, fileUploader.single('file'), userController.updateAvatarUser)
    router.put(routes.getConfirmCodeChangePass, userController.getConfirmCodeChangePass)
    router.put(routes.confirmCodeChangePass, userController.confirmCodeChangePass)
    router.put(routes.updateBlog, userController.updateBlog)
    router.put(routes.updateShortVideoById, userController.updateShortVideoById)
    router.put(routes.editContentBlogUserById, userController.editContentBlogUserById)
    router.put(routes.updateCommentBlogById, userController.updateCommentBlogById)
    router.put(routes.editCommentShortVideoById, userController.editCommentShortVideoById)



    router.delete(routes.deleteAddressUser, userController.deleteAddressUser)
    router.delete(routes.deleteVideoEvaluate, userController.deleteVideoEvaluate)
    router.delete(routes.deleteProductInCart, userController.deleteProductInCart)
    router.delete(routes.createNewEvaluateProductFailed, userController.createNewEvaluateProductFailed)
    router.delete(routes.deleteBlogUserById, userController.deleteBlogUserById)
    router.delete(routes.deleteCommentBlogById, userController.deleteCommentBlogById)
    router.delete(routes.deleteCollectBlogById, userController.deleteCollectBlogById)
    router.delete(routes.deleteCommentShortVideoById, userController.deleteCommentShortVideoById)
    router.delete(routes.deleteShortVideoById, userController.deleteShortVideoById)


    return app.use('/', router);
}

export default initUserRoute;