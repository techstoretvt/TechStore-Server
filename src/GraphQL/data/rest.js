import db from '../../models'

const ListTypeProducts = async () => {
    let data = await db.typeProduct.findAll();
    return data
}


module.exports = {
    ListTypeProducts
}