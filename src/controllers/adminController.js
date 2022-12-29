import adminService from '../services/adminService'

const addTypeProduct = async (req, res) => {
    try {
        //call service data
        let data = await adminService.addTypeProduct(req.body)

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

const getAllTypeProduct = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getAllTypeProduct()

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

const deleteTypeProduct = async (req, res) => {
    try {
        //call service data
        let data = await adminService.deleteTypeProduct(req.body)

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

const updateTypeProductById = async (req, res) => {
    try {
        //call service data
        let data = await adminService.updateTypeProductById(req.body)

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

const addTrademark = async (req, res) => {
    try {
        //call service data
        let data = await adminService.addTrademark(req.body)

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

const getAllTrademark = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getAllTrademark()

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
    addTypeProduct,
    getAllTypeProduct,
    deleteTypeProduct,
    updateTypeProductById,
    addTrademark,
    getAllTrademark
}