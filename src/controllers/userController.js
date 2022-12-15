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

module.exports = {
    CreateUser
}