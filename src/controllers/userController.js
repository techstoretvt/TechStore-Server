import multer from 'multer';
import userService from '../services/userService'
require('dotenv').config();

const upload = multer().single('video');


const CreateUser = async (req, res) => {
    try {
        //call service data
        let data = await userService.CreateUser(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const verifyCreateUser = async (req, res) => {
    try {
        //call service data
        let data = await userService.verifyCreateUser(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const userLogin = async (req, res) => {
    try {
        //call service data
        let data = await userService.userLogin(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        //call service data
        let data = await userService.refreshToken(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getUserLogin = async (req, res) => {
    try {
        //call service data
        let data = await userService.getUserLogin(req.query)
        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const verifyEmail = (req, res) => {
    res.render('verifyEmailPage.ejs')
}

const accountVerifyPage = (req, res) => {
    res.render('accountVerifyPage.ejs')
}

const loginGoogle = async (req, res) => {
    try {
        //call service data
        let data = await userService.loginGoogle(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const loginFacebook = async (req, res) => {
    try {
        //call service data
        let data = await userService.loginFacebook(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const loginGithub = async (req, res) => {
    try {
        //call service data
        let data = await userService.loginGithub(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const addProductToCart = async (req, res) => {
    try {
        //call service data
        let data = await userService.addProductToCart(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const addCartOrMoveCart = async (req, res) => {
    try {
        //call service data
        let data = await userService.addCartOrMoveCart(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const addNewAddressUser = async (req, res) => {
    try {
        //call service data
        let data = await userService.addNewAddressUser(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getAddressUser = async (req, res) => {
    try {
        //call service data
        let data = await userService.getAddressUser(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const setDefaultAddress = async (req, res) => {
    try {
        //call service data
        let data = await userService.setDefaultAddress(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const deleteAddressUser = async (req, res) => {
    try {
        //call service data
        let data = await userService.deleteAddressUser(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const editAddressUser = async (req, res) => {
    try {
        //call service data
        let data = await userService.editAddressUser(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getListCartUser = async (req, res) => {
    try {
        //call service data
        let data = await userService.getListCartUser(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const editAmountCartUser = async (req, res) => {
    try {
        //call service data
        let data = await userService.editAmountCartUser(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const chooseProductInCart = async (req, res) => {
    try {
        //call service data
        let data = await userService.chooseProductInCart(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const deleteProductInCart = async (req, res) => {
    try {
        //call service data
        let data = await userService.deleteProductInCart(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const updateClassifyProductInCart = async (req, res) => {
    try {
        //call service data
        let data = await userService.updateClassifyProductInCart(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const createNewBill = async (req, res) => {
    try {
        //call service data
        let data = await userService.createNewBill(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const chooseAllProductInCart = async (req, res) => {
    try {
        //call service data
        let data = await userService.chooseAllProductInCart(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getUserLoginRefreshToken = async (req, res) => {
    try {
        //call service data
        let data = await userService.getUserLoginRefreshToken(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getListBillByType = async (req, res) => {
    try {
        //call service data
        let data = await userService.getListBillByType(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const userCancelBill = async (req, res) => {
    try {
        //call service data
        let data = await userService.userCancelBill(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const userRepurchaseBill = async (req, res) => {
    try {
        //call service data
        let data = await userService.userRepurchaseBill(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getCodeVeridyForgetPass = async (req, res) => {
    try {
        //call service data
        let data = await userService.getCodeVeridyForgetPass(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const changePassForget = async (req, res) => {
    try {
        //call service data
        let data = await userService.changePassForget(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const checkKeyVerify = async (req, res) => {
    try {
        //call service data
        let data = await userService.checkKeyVerify(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const hasReceivedProduct = async (req, res) => {
    try {
        //call service data
        let data = await userService.hasReceivedProduct(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const buyProductByCard = async (req, res) => {
    try {
        //call service data
        let data = await userService.buyProductByCard(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const buyProductByCardSucess = async (req, res) => {
    try {
        //call service data
        let data = await userService.buyProductByCardSucess(req.query)

        if (data.errCode === 0) {
            res.redirect(`${process.env.LINK_FONTEND}/cart/notifycation`);
        }
        else {
            return res.status(200).json(data)
        }

    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const createNewEvaluateProduct = async (req, res) => {
    try {
        //call service data
        let data = await userService.createNewEvaluateProduct(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const uploadVideoEvaluateProduct = async (req, res) => {
    try {
        upload(req, res, function (err) {
            if (req.fileValidationError) {
                return res.send(req.fileValidationError)
            }
            else if (!req.file) {
                return res.send('aaaaaaa')
            }
            else if (err instanceof multer.MulterError) {
                return res.send(err);
            }
        })
        let data = await userService.uploadVideoEvaluateProduct(req.query.id, req.file.filename)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const uploadImagesEvaluateProduct = async (req, res) => {
    try {
        let data = await userService.uploadImagesEvaluateProduct({
            files: req.files,
            query: req.query,
        })

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const createNewEvaluateProductFailed = async (req, res) => {
    try {
        let data = await userService.createNewEvaluateProductFailed(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const updataEvaluateProduct = async (req, res) => {
    try {
        let data = await userService.updataEvaluateProduct(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
const deleteVideoEvaluate = async (req, res) => {
    try {
        let data = await userService.deleteVideoEvaluate(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
const updateVideoEvaluate = async (req, res) => {
    try {
        let data = await userService.updateVideoEvaluate(req.query.id, req.file.filename)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const updateProfileUser = async (req, res) => {
    try {
        let data = await userService.updateProfileUser(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const updateAvatarUser = async (req, res) => {
    try {
        let data = await userService.updateAvatarUser({
            file: req.file,
            query: req.query,
        })

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getConfirmCodeChangePass = async (req, res) => {
    try {
        let data = await userService.getConfirmCodeChangePass(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const confirmCodeChangePass = async (req, res) => {
    try {
        let data = await userService.confirmCodeChangePass(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}


const createNewBlog = async (req, res) => {
    try {
        let data = await userService.createNewBlog(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const createNewImageBlog = async (req, res) => {
    try {
        let data = await userService.createNewImageBlog({
            files: req.files,
            query: req.query
        })

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}


const uploadVideoNewBlog = async (req, res) => {
    try {
        let data = await userService.uploadVideoNewBlog(req.query.idBlog, req.file.filename)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getBlogById = async (req, res) => {
    try {
        let data = await userService.getBlogById(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const updateBlog = async (req, res) => {
    try {
        let data = await userService.updateBlog(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
const shareProduct = async (req, res) => {
    try {
        let data = await userService.shareProduct(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const shareBlog = async (req, res) => {
    try {
        let data = await userService.shareBlog(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const toggleLikeBlog = async (req, res) => {
    try {
        let data = await userService.toggleLikeBlog(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const createNewCommentBlog = async (req, res) => {
    try {
        let data = await userService.createNewCommentBlog(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const createNewShortVideo = async (req, res) => {
    try {
        let data = await userService.createNewShortVideo(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const uploadCoverImageShortVideo = async (req, res) => {
    try {
        let data = await userService.uploadCoverImageShortVideo({
            file: req.file,
            query: req.query
        })

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const uploadVideoForShortVideo = async (req, res) => {
    try {
        let data = await userService.uploadVideoForShortVideo(req.query.idShortVideo, req.file.filename)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getShortVideoById = async (req, res) => {
    try {
        let data = await userService.getShortVideoById(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const updateShortVideoById = async (req, res) => {
    try {
        let data = await userService.updateShortVideoById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getListBlogUserByPage = async (req, res) => {
    try {
        let data = await userService.getListBlogUserByPage(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const deleteBlogUserById = async (req, res) => {
    try {
        let data = await userService.deleteBlogUserById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const editContentBlogUserById = async (req, res) => {
    try {
        let data = await userService.editContentBlogUserById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}


const deleteCommentBlogById = async (req, res) => {
    try {
        let data = await userService.deleteCommentBlogById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const updateCommentBlogById = async (req, res) => {
    try {
        let data = await userService.updateCommentBlogById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getListBlogByIdUser = async (req, res) => {
    try {
        let data = await userService.getListBlogByIdUser(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const saveBlogCollection = async (req, res) => {
    try {
        let data = await userService.saveBlogCollection(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getListCollectionBlogUserByPage = async (req, res) => {
    try {
        let data = await userService.getListCollectionBlogUserByPage(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const deleteCollectBlogById = async (req, res) => {
    try {
        let data = await userService.deleteCollectBlogById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const createCommentShortVideo = async (req, res) => {
    try {
        let data = await userService.createCommentShortVideo(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const deleteCommentShortVideoById = async (req, res) => {
    try {
        let data = await userService.deleteCommentShortVideoById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const editCommentShortVideoById = async (req, res) => {
    try {
        let data = await userService.editCommentShortVideoById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const toggleLikeShortVideo = async (req, res) => {
    try {
        let data = await userService.toggleLikeShortVideo(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}


const checkUserLikeShortVideo = async (req, res) => {
    try {
        let data = await userService.checkUserLikeShortVideo(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const saveCollectionShortVideo = async (req, res) => {
    try {
        let data = await userService.saveCollectionShortVideo(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const CheckSaveCollectionShortVideo = async (req, res) => {
    try {
        let data = await userService.CheckSaveCollectionShortVideo(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getListVideoByIdUser = async (req, res) => {
    try {
        let data = await userService.getListVideoByIdUser(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getUserById = async (req, res) => {
    try {
        let data = await userService.getUserById(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const deleteShortVideoById = async (req, res) => {
    try {
        let data = await userService.deleteShortVideoById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    CreateUser,
    verifyCreateUser,
    userLogin,
    refreshToken,
    getUserLogin,
    verifyEmail,
    accountVerifyPage,
    loginGoogle,
    loginFacebook,
    loginGithub,
    addProductToCart,
    addCartOrMoveCart,
    addNewAddressUser,
    getAddressUser,
    setDefaultAddress,
    deleteAddressUser,
    editAddressUser,
    getListCartUser,
    editAmountCartUser,
    chooseProductInCart,
    deleteProductInCart,
    updateClassifyProductInCart,
    createNewBill,
    chooseAllProductInCart,
    getUserLoginRefreshToken,
    getListBillByType,
    userCancelBill,
    userRepurchaseBill,
    getCodeVeridyForgetPass,
    changePassForget,
    checkKeyVerify,
    hasReceivedProduct,
    buyProductByCard,
    buyProductByCardSucess,
    createNewEvaluateProduct,
    uploadVideoEvaluateProduct,
    uploadImagesEvaluateProduct,
    createNewEvaluateProductFailed,
    updataEvaluateProduct,
    deleteVideoEvaluate,
    updateVideoEvaluate,
    updateProfileUser,
    updateAvatarUser,
    getConfirmCodeChangePass,
    confirmCodeChangePass,
    createNewBlog,
    createNewImageBlog,
    uploadVideoNewBlog,
    getBlogById,
    updateBlog,
    shareProduct,
    shareBlog,
    toggleLikeBlog,
    createNewCommentBlog,
    createNewShortVideo,
    uploadCoverImageShortVideo,
    uploadVideoForShortVideo,
    getShortVideoById,
    updateShortVideoById,
    getListBlogUserByPage,
    deleteBlogUserById,
    editContentBlogUserById,
    deleteCommentBlogById,
    updateCommentBlogById,
    getListBlogByIdUser,
    saveBlogCollection,
    getListCollectionBlogUserByPage,
    deleteCollectBlogById,
    createCommentShortVideo,
    deleteCommentShortVideoById,
    editCommentShortVideoById,
    toggleLikeShortVideo,
    checkUserLikeShortVideo,
    saveCollectionShortVideo,
    CheckSaveCollectionShortVideo,
    getListVideoByIdUser,
    getUserById,
    deleteShortVideoById
}