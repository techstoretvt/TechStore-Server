import db from '../../models'

const ListTypeProducts = async () => {
    let data = await db.typeProduct.findAll();
    return data
}

const ListTrademarks = async () => {
    let data = await db.trademark.findAll();
    return data
}

const ListProducts = async () => {
    let data = await db.product.findAll();
    return data
}

const ListImageProducts = async () => {
    let data = await db.imageProduct.findAll();
    return data
}

const ListClassify = async () => {
    let data = await db.classifyProduct.findAll({
        order: [['STTImg', 'ASC']]
    });
    return data
}

const ListPromotions = async () => {
    let data = await db.promotionProduct.findAll();
    return data
}




module.exports = {
    ListTypeProducts,
    ListTrademarks,
    ListProducts,
    ListImageProducts,
    ListClassify,
    ListPromotions,
}