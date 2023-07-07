import appService from '../services/appService'

const checkStartServer = async (req, res, next) => {
    try {
        return res.status(200).json({
            errCode: 0
        })
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getProductPromotionHome = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getProductPromotionHome()

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getTopSellProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getTopSellProduct()

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getNewCollectionProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getNewCollectionProduct(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getProductFlycam = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getProductFlycam(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListProductMayLike = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getListProductMayLike(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getEvaluateByIdProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getEvaluateByIdProduct(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const searchProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.searchProduct(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}
//test
const GetListProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.GetListProduct(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const createProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.createProduct()

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}
//end test

const getListBlog = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getListBlog(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListHashTag = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getListHashTag()

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}


const getBlogShareProduct = async (req, res, next) => {
    try {
        let data = await appService.getBlogShareProduct(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getBlogShareDefault = async (req, res, next) => {
    try {
        let data = await appService.getBlogShareDefault(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getBlogById = async (req, res, next) => {
    try {
        let data = await appService.getBlogById(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getCommentBlogByIdBlog = async (req, res, next) => {
    try {
        let data = await appService.getCommentBlogByIdBlog(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const increaseViewBlogById = async (req, res, next) => {
    try {
        let data = await appService.increaseViewBlogById(req.body)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListShortVideo = async (req, res, next) => {
    try {
        let data = await appService.getListShortVideo(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListCommentShortVideoById = async (req, res, next) => {
    try {
        let data = await appService.getListCommentShortVideoById(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListProductHashTagByIdVideo = async (req, res, next) => {
    try {
        let data = await appService.getListProductHashTagByIdVideo(req.query)

        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getProductById = async (req, res, next) => {
    try {
        let data = await appService.getProductById(req.query)
        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListBlogHome = async (req, res, next) => {
    try {
        let data = await appService.getListBlogHome()
        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getEventPromotionById = async (req, res, next) => {
    try {
        let data = await appService.getEventPromotionById(req.query)
        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getListEventPromotionHome = async (req, res, next) => {
    try {
        let data = await appService.getListEventPromotionHome()
        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

const getContentEventPromotionById = async (req, res, next) => {
    try {
        let data = await appService.getContentEventPromotionById(req.query)
        return res.status(200).json(data)
    }
    catch (e) {
        next(createError.InternalServerError())
    }
}

module.exports = {
    checkStartServer,
    getProductPromotionHome,
    getTopSellProduct,
    getNewCollectionProduct,
    getProductFlycam,
    getListProductMayLike,
    getEvaluateByIdProduct,
    searchProduct,
    GetListProduct,
    createProduct,
    getListBlog,
    getListHashTag,
    getBlogShareProduct,
    getBlogShareDefault,
    getBlogById,
    getCommentBlogByIdBlog,
    increaseViewBlogById,
    getListShortVideo,
    getListCommentShortVideoById,
    getListProductHashTagByIdVideo,
    getProductById,
    getListBlogHome,
    getEventPromotionById,
    getListEventPromotionHome,
    getContentEventPromotionById
}