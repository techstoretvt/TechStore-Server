import db from '../models'

const addTypeProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.nameTypeProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                //
                let [typeProduct, created] = await db.typeProduct.findOrCreate({
                    where: { nameTypeProduct: data.nameTypeProduct },
                    defaults: {},
                    raw: false
                })

                if (!created) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Loại sản phẩm đã tồn tại!'
                    })
                }
                else {
                    resolve({
                        errCode: 0,
                        errMessage: 'ok!'
                    })
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}


const getAllTypeProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let typeProducts = await db.typeProduct.findAll({
                order: [
                    ['id', 'ASC'],
                ],
            });
            if (typeProducts) {
                resolve({
                    errCode: 0,
                    data: typeProducts
                })
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'Not found data'
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const deleteTypeProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let typeProduct = await db.typeProduct.findOne({
                    where: { id: +data.idType },
                    raw: false
                });
                if (typeProduct) {
                    await typeProduct.destroy();

                    let trademark = await db.trademark.findAll({
                        where: { idTypeProduct: +data.idType },
                        raw: false
                    })
                    if (trademark && trademark.length > 0) {
                        await trademark.destroy();
                    }

                    let products = await db.product.findAll({
                        where: { idTypeProduct: +data.idType },
                        raw: false
                    })
                    if (products && products.length > 0) {
                        await products.destroy();
                    }


                    resolve({
                        errCode: 0,
                        errMessage: "Xóa loại sản phẩm thành công!"
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Loại sản phẩm không còn tồn tại!'
                    })
                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const updateTypeProductById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.nameTypeProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let typeProduct = await db.typeProduct.findOne({
                    where: { id: data.id },
                    raw: false
                })

                if (!typeProduct) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy loại sản phẩm này!',
                    })
                }
                else {
                    typeProduct.nameTypeProduct = data.nameTypeProduct
                    await typeProduct.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Đã thay đổi tên loại sản phẩm!',
                    })
                }

            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const addTrademark = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idTypeProduct || !data.nameTrademark) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let [trademark, created] = await db.trademark.findOrCreate({
                    where: {
                        nameTrademark: data.nameTrademark.toLowerCase(),
                        idTypeProduct: +data.idTypeProduct
                    },
                    default: {

                    }
                })

                if (!created) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Thương hiệu đã tồn tại!',
                    })
                }
                else {
                    resolve({
                        errCode: 0,
                        errMessage: 'ok!',
                    })
                }

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getAllTrademark = () => {
    return new Promise(async (resolve, reject) => {
        try {

            const trademarks = await db.trademark.findAll({
                include: [
                    { model: db.typeProduct, attributes: ['nameTypeProduct'] },
                ],
                order: [
                    ['id', 'ASC'],
                ],
                raw: true,
                nest: true
            })

            if (trademarks && trademarks.length > 0) {
                resolve({
                    errCode: 0,
                    data: trademarks
                })
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy thương hiệu nào!'
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    addTypeProduct,
    getAllTypeProduct,
    deleteTypeProduct,
    updateTypeProductById,
    addTrademark,
    getAllTrademark
}