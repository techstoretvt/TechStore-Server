import adminService from '../services/adminService'

const addTypeProduct = async (req, res) => {
    try {
        //call service data
        // let data = await adminService.addTypeProduct(req.body)
        let data = await adminService.addTypeProduct({
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
        // let data = await adminService.updateTypeProductById(req.query)
        let data = await adminService.updateTypeProductById({
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

const deleteTrademarkById = async (req, res) => {
    try {
        //call service data
        let data = await adminService.deleteTrademarkById(req.body)

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
const updateTrademarkById = async (req, res) => {
    try {
        //call service data
        let data = await adminService.updateTrademarkById(req.body)

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

const createNewProduct = async (req, res) => {
    try {
        //call service data
        let data = await adminService.createNewProduct(req.body)

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

const cloudinaryUpload = async (req, res) => {
    // if (!req.file) {
    //     next(new Error('No file uploaded!'));
    //     return;
    // }

    // res.json({ secure_url: req.file.path, num: req.query.num });
    try {
        //call service data
        let data = await adminService.cloudinaryUpload({
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

const getListProductByPage = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getListProductByPage(req.query)

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

const blockProduct = async (req, res) => {
    try {
        //call service data
        let data = await adminService.blockProduct(req.body)

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

const editProductById = async (req, res) => {
    try {
        //call service data
        let data = await adminService.editProductById(req.body)

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

const editImageProduct = async (req, res) => {
    try {
        //call service data
        let data = await adminService.editImageProduct({
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

const swapImageProduct = async (req, res) => {
    try {
        //call service data
        let data = await adminService.swapImageProduct(req.body)

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

const getProductBySwapAndPage = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getProductBySwapAndPage(req.query)

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

const addPromotionByIdProduct = async (req, res) => {
    try {
        //call service data
        let data = await adminService.addPromotionByIdProduct(req.body)

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

const testApi = async (req, res) => {
    try {
        //call service data
        let data = await adminService.testApi()

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

const deleteErrorProduct = async (req, res) => {
    try {
        //call service data
        let data = await adminService.deleteErrorProduct(req.body)

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

const confirmBillById = async (req, res) => {
    try {
        //call service data
        let data = await adminService.confirmBillById(req.body)

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

const cancelBillById = async (req, res) => {
    try {
        //call service data
        let data = await adminService.cancelBillById(req.body)

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
    getAllTrademark,
    deleteTrademarkById,
    updateTrademarkById,
    createNewProduct,
    cloudinaryUpload,
    getListProductByPage,
    blockProduct,
    editProductById,
    editImageProduct,
    swapImageProduct,
    getProductBySwapAndPage,
    addPromotionByIdProduct,
    testApi,
    deleteErrorProduct,
    confirmBillById,
    cancelBillById
}