import adminService from '../services/adminService'

const addTypeProduct = async (req, res, next) => {
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
        next(createError.InternalServerError())
    }
}

const getAllTypeProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getAllTypeProduct()

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const deleteTypeProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.deleteTypeProduct(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const updateTypeProductById = async (req, res, next) => {
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
        next(createError.InternalServerError())
    }
}

const addTrademark = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.addTrademark(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getAllTrademark = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getAllTrademark(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const deleteTrademarkById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.deleteTrademarkById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}
const updateTrademarkById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.updateTrademarkById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const createNewProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.createNewProduct(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const cloudinaryUpload = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.cloudinaryUpload({
            files: req.files,
            query: req.query
        })

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListProductByPage = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListProductByPage(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const blockProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.blockProduct(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const editProductById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.editProductById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const editImageProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.editImageProduct({
            file: req.file,
            query: req.query
        })

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const swapImageProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.swapImageProduct(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getProductBySwapAndPage = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getProductBySwapAndPage(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const addPromotionByIdProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.addPromotionByIdProduct(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const testApi = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.testApi()

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const deleteErrorProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.deleteErrorProduct(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const confirmBillById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.confirmBillById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const cancelBillById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.cancelBillById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const createNewKeyWord = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.createNewKeyWord(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const createNotify_noimage = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.createNotify_noimage(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const createNotify_image = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.createNotify_image({
            file: req.file,
            query: req.query
        })

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const CheckLoginAdminAccessToken = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.CheckLoginAdminAccessToken(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const createNewUserAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.createNewUserAdmin(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListUserAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListUserAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const lockUserAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.lockUserAdmin(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}
const createEventPromotion = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.createEventPromotion(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const upLoadImageCoverPromotion = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.upLoadImageCoverPromotion({ file: req.file, query: req.query })

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListEventPromotion = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListEventPromotion()

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const editEventPromotion = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.editEventPromotion(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListBillByTypeAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListBillByTypeAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const updateStatusBillAdminWeb = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.updateStatusBillAdminWeb(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListVideoAdminByPage = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListVideoAdminByPage(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const deleteShortVideoAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.deleteShortVideoAdmin(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListReportAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListReportAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const skipReportVideoAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.skipReportVideoAdmin(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListBlogAdminByPage = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListBlogAdminByPage(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const deleteBlogAdminById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.deleteBlogAdminById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListReportBlogAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListReportBlogAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const skipReportBlogAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.skipReportBlogAdmin(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getStatisticalAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getStatisticalAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const StatisticalEvaluateAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.StatisticalEvaluateAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getStatisticalSale = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getStatisticalSale(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListKeyWordAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListKeyWordAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const editKeyWordSearchAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.editKeyWordSearchAdmin(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const deleteKeyWordAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.deleteKeyWordAdmin(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListUserTypeAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListUserTypeAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const deleteEventPromotionAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.deleteEventPromotionAdmin(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getCountBillOfMonth = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getCountBillOfMonth(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getMoneyOfMonth = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getMoneyOfMonth(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getDetailBillByIdAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getDetailBillByIdAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getInventoryByTypeProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getInventoryByTypeProduct(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}




//winform
const getListBillNoConfirm = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListBillNoConfirm()

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getDetailBillAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getDetailBillAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListImageProductAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListImageProductAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getInfoProductAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getInfoProductAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getClassifyProductAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getClassifyProductAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getAddressBillAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getAddressBillAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const confirmBillAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.confirmBillAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const updateStatusBillAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.updateStatusBillAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListStatusBillAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListStatusBillAdmin(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
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
    getStatisticalAdmin,
    StatisticalEvaluateAdmin,
    getStatisticalSale,
    getListKeyWordAdmin,
    editKeyWordSearchAdmin,
    deleteKeyWordAdmin,
    getListUserTypeAdmin,
    deleteEventPromotionAdmin,
    getCountBillOfMonth,
    getMoneyOfMonth,
    getDetailBillByIdAdmin,
    getInventoryByTypeProduct,


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