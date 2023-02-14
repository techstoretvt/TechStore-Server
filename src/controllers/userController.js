import userService from '../services/userService'

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
    hasReceivedProduct
}