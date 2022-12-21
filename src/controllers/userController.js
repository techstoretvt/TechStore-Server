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

module.exports = {
    CreateUser,
    verifyCreateUser,
    userLogin,
    refreshToken,
    getUserLogin
}