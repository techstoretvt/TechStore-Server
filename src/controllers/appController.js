import appService from '../services/appService'

const checkStartServer = async (req, res) => {
    try {
        return res.status(200).json({
            errCode: 0
        })
    }
    catch (e) {
        console.log('Get all code error: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getProductPromotionHome = async (req, res) => {
    try {
        //call service data
        let data = await appService.getProductPromotionHome()

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

const getTopSellProduct = async (req, res) => {
    try {
        //call service data
        let data = await appService.getTopSellProduct()

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

const getNewCollectionProduct = async (req, res) => {
    try {
        //call service data
        let data = await appService.getNewCollectionProduct(req.query)

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

const getProductFlycam = async (req, res) => {
    try {
        //call service data
        let data = await appService.getProductFlycam(req.query)

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

const getListProductMayLike = async (req, res) => {
    try {
        //call service data
        let data = await appService.getListProductMayLike(req.query)

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

const getEvaluateByIdProduct = async (req, res) => {
    try {
        //call service data
        let data = await appService.getEvaluateByIdProduct(req.query)

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

const searchProduct = async (req, res) => {
    try {
        //call service data
        let data = await appService.searchProduct(req.query)

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
//test
const GetListProduct = async (req, res) => {
    try {
        //call service data
        let data = await appService.GetListProduct(req.query)

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

const createProduct = async (req, res) => {
    try {
        //call service data
        let data = await appService.createProduct()

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
//end test

const getListBlog = async (req, res) => {
    try {
        //call service data
        let data = await appService.getListBlog(req.query)

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

const getListHashTag = async (req, res) => {
    try {
        //call service data
        let data = await appService.getListHashTag()

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


const getBlogShareProduct = async (req, res) => {
    try {
        let data = await appService.getBlogShareProduct(req.query)

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

const getBlogShareDefault = async (req, res) => {
    try {
        let data = await appService.getBlogShareDefault(req.query)

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
        let data = await appService.getBlogById(req.query)

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

const getCommentBlogByIdBlog = async (req, res) => {
    try {
        let data = await appService.getCommentBlogByIdBlog(req.query)

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

const increaseViewBlogById = async (req, res) => {
    try {
        let data = await appService.increaseViewBlogById(req.body)

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

const getListShortVideo = async (req, res) => {
    try {
        let data = await appService.getListShortVideo(req.query)

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

const getListCommentShortVideoById = async (req, res) => {
    try {
        let data = await appService.getListCommentShortVideoById(req.query)

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

const getListProductHashTagByIdVideo = async (req, res) => {
    try {
        let data = await appService.getListProductHashTagByIdVideo(req.query)

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

const getProductById = async (req, res) => {
    try {
        let data = await appService.getProductById(req.query)
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

const getListBlogHome = async (req, res) => {
    try {
        let data = await appService.getListBlogHome()
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

const getEventPromotionById = async (req, res) => {
    try {
        let data = await appService.getEventPromotionById(req.query)
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
    getEventPromotionById
}