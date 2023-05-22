import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer'
require('dotenv').config();
import jwt from 'jsonwebtoken'


var salt = bcrypt.genSaltSync(10);


const hashPassword = (password) => {
    return bcrypt.hashSync(password, salt);
}

const comparePassword = (pass, passHash) => {
    return bcrypt.compareSync(pass, passHash);
}

const randomString = () => {
    return uuidv4();
}

const sendEmail = async (toEmail, title, contentHTML) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS_EMAIL,
        },
        tls: {
            rejectUnauthorized: false,
            // minVersion: "TLSv1.2"
        }
    });


    let info = await transporter.sendMail({
        from: `"TechStoreTvT ⚔ ⚓ 👻" <${process.env.EMAIL}>`,
        to: toEmail,
        subject: title,
        html: contentHTML,
    });
}

const decodeToken = (token, primaryKey) => {
    try {
        var decoded = jwt.verify(token, primaryKey);
        return decoded
    } catch (e) {
        return null;
    }
}


const routes = {
    //app
    getProductPromotionHome: '/api/v1/get-product-promotion-home',
    getTopSellProduct: '/api/vi/get-top-sell-product',
    getNewCollectionProduct: '/api/vi/get-new-collection-product',
    getProductFlycam: '/api/v1/get-product-type-flycam',
    getListProductMayLike: '/api/v1/get-list-product-may-like',
    getEvaluateByIdProduct: '/api/v1/get-evaluate-by-id-product',
    searchProduct: '/api/v1/search-product',
    getListBlog: '/api/v1/get-list-blog',
    getListHashTag: '/api/v1/get-list-hashtag',
    getBlogShareProduct: '/api/v1/get-blog-share-product',
    getBlogShareDefault: '/api/v1/get-blog-share-default',
    getBlogById: '/api/v1/get-blog-by-id',
    getCommentBlogByIdBlog: '/api/v1/get-comment-blog-by-id-blog',
    increaseViewBlogById: '/api/v1/increase-view-blog-by-id',
    getListShortVideo: '/api/v1/get-list-short-video',
    getListCommentShortVideoById: '/api/v1/get-list-comment-short-video-by-id',
    getListProductHashTagByIdVideo: '/api/v1/get-list-product-hashtag-by-id-video',
    getProductById: '/api/v1/get-product-by-id',
    getListBlogHome: '/api/v1/get-list-blog-home',
    getEventPromotionById: '/api/v1/get-event-promotion-by-id',
    upLoadImageCoverPromotion: '/api/v1/upload-image-cover-promotion',
    getListEventPromotionHome: '/api/v1/get-list-event-promotion-home',



    //admin
    getAllTypeProduct: '/api/get-all-type-product',
    getAllTrademark: '/api/get-all-trademark',
    getListProductByPage: '/api/get-list-product-by-page',
    getProductBySwapAndPage: '/api/get-list-product-by-swap-and-page',
    addTrademark: '/api/add-trademark',
    addTypeProduct: '/api/add-type-product',
    cloudinaryUpload: '/cloudinary-upload',
    createNewProduct: '/api/create-new-product',
    addPromotionByIdProduct: '/api/add-promotion-by-idproduct',
    swapImageProduct: '/api/swap-image-product',
    createNewKeyWord: '/api/v1/create-new-keyword',
    confirmBillById: '/api/v1/confirm-bill-by-id',
    cancelBillById: '/api/v1/cancel-bill-by-id',
    updateTypeProductById: '/api/update-type-produt-by-id',
    updateTrademarkById: '/api/update-trademark-by-id',
    editProductById: '/api/edit-product-by-id',
    blockProduct: '/api/block-product',
    editImageProduct: '/api/edit-image-product',
    deleteTypeProduct: '/api/delete-type-product-by-id',
    deleteTrademarkById: '/api/delete-trademark-by-id',
    deleteErrorProduct: '/api/v1/delete-error-product',
    createNotify_noimage: '/api/v1/create-notify-noimage',
    createNotify_image: '/api/v1/create-notify-image',
    CheckLoginAdminAccessToken: '/api/v1/check-login-admin-access-token',
    createNewUserAdmin: '/api/v1/create-new-user-admin',
    getListUserAdmin: '/api/v1/get-list-user',
    lockUserAdmin: '/api/v1/lock-user',
    createEventPromotion: '/api/v1/create-event-promotion',
    getListEventPromotion: '/api/v1/get-list-event-promotion',
    editEventPromotion: '/api/v1/edit-event-promotion',
    //winform
    getListBillNoConfirm: '/api/v1/get-list-bill-no-confirm',
    getDetailBillAdmin: '/api/v1/get-detail-bill-admin',
    getListImageProductAdmin: '/api/v1/get-list-image-admin',
    getInfoProductAdmin: '/api/v1/get-info-product-admin',
    getClassifyProductAdmin: '/api/v1/get-classify-product-admin',
    getAddressBillAdmin: '/api/v1/get-address-bill-admin',
    confirmBillAdmin: '/api/v1/confirm-bill-admin',
    updateStatusBillAdmin: '/api/v1/update-status-bill-admin',
    getListStatusBillAdmin: '/api/v1/get-list-status-bill-admin',
    //end winform



    //user
    getUserLogin: '/api/get-user-login',
    getAddressUser: '/api/v1/get-address-user',
    getListCartUser: '/api/v1/get-list-cart-user',
    getUserLoginRefreshToken: '/api/v1/get-user-login-refresh-token',
    getListBillByType: '/api/v1/get-list-bill-by-type',
    getBlogEditById: '/api/v1/get-blog-edit-by-id',
    getListBlogUserByPage: '/api/v1/get-list-blog-user-by-page',
    getShortVideoById: '/api/v1/get-short-video-by-id',
    buyProductByCardSucess: '/api/v1/buy-product-by-card/success',
    CreateUser: '/api/create-user',
    verifyCreateUser: '/api/verify-create-user',
    userLogin: '/api/user-login',
    refreshToken: '/api/refresh-token',
    loginGoogle: '/api/login-google',
    loginFacebook: '/api/login-facebook',
    loginGithub: '/api/login-github',
    addProductToCart: '/api/v1/add-product-to-cart',
    addCartOrMoveCart: '/api/v1/add-cart-or-move-cart',
    addNewAddressUser: '/api/v1/add-new-address-user',
    createNewBill: '/api/v1/create-new-bill',
    userRepurchaseBill: '/api/v1/user-repurchase-bill',
    checkKeyVerify: '/api/v1/check-key-verify',
    buyProductByCard: '/api/v1/buy-product-by-card',
    createNewEvaluateProduct: '/api/v1/create-new-evaluate-product',
    uploadImagesEvaluateProduct: '/apit/v1/upload-images-evaluate-product',
    updateVideoEvaluate: '/api/v1/update-video-evaluate',
    createNewBlog: '/api/v1/create-new-blog',
    createNewImageBlog: '/api/v1/create-new-image-blog',
    uploadVideoNewBlog: '/api/v1/upload-new-video-blog',
    uploadVideoEvaluateProduct: '/apit/v1/upload-video-evaluate-product',
    shareProduct: '/api/v1/share-product',
    shareBlog: '/api/v1/share-blog',
    toggleLikeBlog: '/api/v1/toggle-like-blog',
    createNewCommentBlog: '/api/v1/create-new-comment-blog',
    createNewShortVideo: '/api/v1/create-new-short-video',
    uploadCoverImageShortVideo: '/api/v1/upload-cover-image-short-video',
    uploadVideoForShortVideo: '/api/v1/upload-video-for-short-video',
    setDefaultAddress: '/api/v1/set-default-address',
    editAddressUser: '/api/v1/edit-address-user',
    editAmountCartUser: '/api/v1/edit-amount-cart-user',
    chooseProductInCart: '/api/v1/choose-product-in-cart',
    updateClassifyProductInCart: '/api/v1/update-classify-product-in-cart',
    chooseAllProductInCart: '/api/v1/choose-all-product-in-cart',
    userCancelBill: '/api/v1/user-cancel-bill',
    getCodeVeridyForgetPass: '/apt/v1/get-code-verify-forget-pass',
    changePassForget: '/api/v1/change-pass-forget',
    hasReceivedProduct: '/api/v1/has-received-product',
    updataEvaluateProduct: '/api/v1/update-evaluate-product',
    updateProfileUser: '/api/v1/update-profile-user',
    updateAvatarUser: '/api/v1/update-avatar-user',
    getConfirmCodeChangePass: '/api/v1/get-confirm-code-change-pass',
    confirmCodeChangePass: '/api/v1/confirm-code-change-pass',
    updateBlog: '/api/v1/update-blog',
    updateShortVideoById: '/api/v1/update-short-video-by-id',
    editContentBlogUserById: '/api/v1/edit-content-blog-user-by-id',
    updateCommentBlogById: '/api/v1/updete-comment-blog-by-id',
    deleteAddressUser: '/api/v1/delete-address-user',
    deleteVideoEvaluate: '/api/v2/delete-video-evaluate',
    deleteProductInCart: '/api/v1/delete-product-in-cart',
    createNewEvaluateProductFailed: '/api/v2/create-new-evaluate-product-failed',
    deleteBlogUserById: '/api/v1/delete-blog-user-by-id',
    deleteCommentBlogById: '/api/v1/delete-comment-blog-by-id',
    getListBlogByIdUser: '/api/v1/get-list-blog-by-id-user',
    saveBlogCollection: '/api/v1/save-blog-collection',
    getListCollectionBlogUserByPage: '/api/v1/get-list-collection-blog-user-by-page',
    deleteCollectBlogById: '/api/v1/delete-collect-blog-by-id',
    createCommentShortVideo: '/api/v1/create-comment-short-video',
    deleteCommentShortVideoById: '/api/v1/delete-comment-shortvideo-by-id',
    editCommentShortVideoById: '/api/v1/edit-comment-shortvideo-by-id',
    toggleLikeShortVideo: '/api/v1/toggle-like-shortvideo',
    checkUserLikeShortVideo: '/api/v1/check-user-like-shortvideo',
    saveCollectionShortVideo: '/api/v1/save-collection-short-video',
    CheckSaveCollectionShortVideo: '/api/v1/check-save-collection-short-video',
    getListVideoByIdUser: '/api/v1/get-list-video-by-id-user',
    getUserById: '/api/v1/get-user-by-id',
    deleteShortVideoById: '/api/v1/delete-short-video-by-id',
    checkLikeBlogById: '/api/v1/check-like-blog-by-id',
    checkSaveBlogById: '/api/v1/check-save-blog-by-id',
    getListNotifyAll: '/api/v1/get-list-notify-all',
    getListNotifyByType: '/api/v1/get-list-notify-by-type',
    seenNotifyOfUser: '/api/v1/seen-notify-of-user',
    sendEmailFromContact: '/api/v1/send-email-from-contact'


}


module.exports = {
    hashPassword,
    randomString,
    sendEmail,
    comparePassword,
    decodeToken,
    routes
}