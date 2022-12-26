import userService from '../services/userService'

const ContentController = async (res, inputData, callback) => {
    try {
        //call service data
        let data = await callback(data)

        return res.status(200).json(inputData)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

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


module.exports = {
    CreateUser,
    verifyCreateUser,
    userLogin,
    refreshToken,
    getUserLogin,
    verifyEmail,
    accountVerifyPage,
    loginGoogle,
    loginFacebook
}