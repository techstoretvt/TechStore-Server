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



module.exports = {
    ListTypeProducts,
    ListTrademarks,
    ListProducts
}