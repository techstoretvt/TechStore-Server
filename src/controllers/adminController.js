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
        let data = await adminService.getAllTrademark(req.query)

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
    try {
        //call service data
        let data = await adminService.cloudinaryUpload({
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

const createNewKeyWord = async (req, res) => {
    try {
        //call service data
        let data = await adminService.createNewKeyWord(req.body)

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

const createNotify_noimage = async (req, res) => {
    try {
        //call service data
        let data = await adminService.createNotify_noimage(req.body)

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

const createNotify_image = async (req, res) => {
    try {
        //call service data
        let data = await adminService.createNotify_image({
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

const CheckLoginAdminAccessToken = async (req, res) => {
    try {
        //call service data
        let data = await adminService.CheckLoginAdminAccessToken(req.body)

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

const createNewUserAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.createNewUserAdmin(req.body)

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

const getListUserAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getListUserAdmin(req.query)

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

const lockUserAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.lockUserAdmin(req.body)

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
const createEventPromotion = async (req, res) => {
    try {
        //call service data
        let data = await adminService.createEventPromotion(req.body)

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

const upLoadImageCoverPromotion = async (req, res) => {
    try {
        //call service data
        let data = await adminService.upLoadImageCoverPromotion({ file: req.file, query: req.query })

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

const getListEventPromotion = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getListEventPromotion()

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

const editEventPromotion = async (req, res) => {
    try {
        //call service data
        let data = await adminService.editEventPromotion(req.body)

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

const getListBillByTypeAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getListBillByTypeAdmin(req.query)

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

const updateStatusBillAdminWeb = async (req, res) => {
    try {
        //call service data
        let data = await adminService.updateStatusBillAdminWeb(req.body)

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

const getListVideoAdminByPage = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getListVideoAdminByPage(req.query)

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

const deleteShortVideoAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.deleteShortVideoAdmin(req.body)

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

const getListReportAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getListReportAdmin(req.query)

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

const skipReportVideoAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.skipReportVideoAdmin(req.body)

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

const getListBlogAdminByPage = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getListBlogAdminByPage(req.query)

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

const deleteBlogAdminById = async (req, res) => {
    try {
        //call service data
        let data = await adminService.deleteBlogAdminById(req.body)

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

const getListReportBlogAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getListReportBlogAdmin(req.query)

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

const skipReportBlogAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.skipReportBlogAdmin(req.body)

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

//winform
const getListBillNoConfirm = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getListBillNoConfirm()

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json([])
    }
}

const getDetailBillAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getDetailBillAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json([])
    }
}

const getListImageProductAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getListImageProductAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json([])
    }
}

const getInfoProductAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getInfoProductAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json([])
    }
}

const getClassifyProductAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getClassifyProductAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json([])
    }
}

const getAddressBillAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getAddressBillAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json([])
    }
}

const confirmBillAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.confirmBillAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json(false)
    }
}

const updateStatusBillAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.updateStatusBillAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json(false)
    }
}

const getListStatusBillAdmin = async (req, res) => {
    try {
        //call service data
        let data = await adminService.getListStatusBillAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json([])
    }
}

//end winform

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
    cancelBillById,
    createNewKeyWord,
    createNotify_noimage,
    createNotify_image,
    CheckLoginAdminAccessToken,
    createNewUserAdmin,
    getListUserAdmin,
    lockUserAdmin,
    createEventPromotion,
    upLoadImageCoverPromotion,
    getListEventPromotion,
    editEventPromotion,
    getListBillByTypeAdmin,
    updateStatusBillAdminWeb,
    getListVideoAdminByPage,
    deleteShortVideoAdmin,
    getListReportAdmin,
    skipReportVideoAdmin,
    getListBlogAdminByPage,
    deleteBlogAdminById,
    getListReportBlogAdmin,
    skipReportBlogAdmin,
    //winform
    getListBillNoConfirm,
    getDetailBillAdmin,
    getListImageProductAdmin,
    getInfoProductAdmin,
    getClassifyProductAdmin,
    getAddressBillAdmin,
    confirmBillAdmin,
    updateStatusBillAdmin,
    getListStatusBillAdmin
    //end winform
}