import appService from '../services/appService'


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


module.exports = {
    getProductPromotionHome,
    getTopSellProduct,
    getNewCollectionProduct
}