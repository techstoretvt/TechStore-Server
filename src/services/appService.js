import db from '../models'
const { Op } = require("sequelize");

const getProductPromotionHome = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let date = new Date().getTime()

            let products = await db.product.findAll({
                attributes: ['id', 'nameProduct', 'priceProduct', 'isSell', 'sold'],
                limit: 10,
                include: [
                    {
                        model: db.imageProduct, as: 'imageProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    },
                    {
                        model: db.trademark,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    },
                    {
                        model: db.typeProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    },
                    {
                        model: db.classifyProduct, as: 'classifyProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    },
                    {
                        model: db.promotionProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        },
                        where: {
                            [Op.and]: [
                                { numberPercent: { [Op.ne]: 0 } },
                                { timePromotion: { [Op.gt]: date } }
                            ]
                        }
                    }
                ],
                order: [
                    ['id', 'ASC'],
                    [{ model: db.imageProduct, as: 'imageProduct-product' }, 'STTImage', 'asc']
                ],
                raw: false,
                nest: true
            });

            let products2 = await db.product.findAll({
                attributes: ['id', 'nameProduct', 'priceProduct', 'isSell', 'sold'],
                limit: 10 - products.length,
                include: [
                    {
                        model: db.imageProduct, as: 'imageProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    },
                    {
                        model: db.trademark,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    },
                    {
                        model: db.typeProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    },
                    {
                        model: db.classifyProduct, as: 'classifyProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    },
                    {
                        model: db.promotionProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        },
                        where: {
                            [Op.or]: [
                                { numberPercent: { [Op.eq]: 0 } },
                                { timePromotion: { [Op.lte]: date } }
                            ]
                        }
                    }
                ],
                order: [
                    ['id', 'ASC'],
                    [{ model: db.imageProduct, as: 'imageProduct-product' }, 'STTImage', 'asc']
                ],
                raw: false,
                nest: true
            });

            products.concat(products2)

            resolve({
                errCode: 0,
                count: products.length,
                data: products,
            })
        }
        catch (e) {
            reject(e);
        }
    })
}

const getTopSellProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let products = await db.product.findAll({
                attributes: ['id', 'nameProduct', 'priceProduct', 'isSell', 'sold'],
                include: [
                    {
                        model: db.imageProduct, as: 'imageProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    },
                    {
                        model: db.trademark,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    },
                    {
                        model: db.typeProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    },
                    {
                        model: db.classifyProduct, as: 'classifyProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    },
                    {
                        model: db.promotionProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        },
                    }
                ],
                order: [
                    ['sold', 'DESC'],
                    [{ model: db.imageProduct, as: 'imageProduct-product' }, 'STTImage', 'asc']
                ],
                limit: 20,
                raw: false,
                nest: true
            });

            if (products && products.length > 0) {
                resolve({
                    errCode: 0,
                    data: products
                })
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy sản phẩm nào!'
                })
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const getNewCollectionProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.typeProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {

                let products = await db.product.findAll({
                    attributes: ['id', 'nameProduct', 'priceProduct', 'isSell', 'sold'],
                    include: [
                        {
                            model: db.imageProduct, as: 'imageProduct-product',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id']
                            },

                        },
                        {
                            model: db.trademark,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id']
                            }
                        },
                        {
                            model: db.typeProduct,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id']
                            },
                            where: {
                                nameTypeProduct: data.typeProduct.toLowerCase()
                            }
                        },
                        {
                            model: db.classifyProduct, as: 'classifyProduct-product',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id']
                            }
                        },
                        {
                            model: db.promotionProduct,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id']
                            },
                        }
                    ],
                    order: [
                        [{ model: db.imageProduct, as: 'imageProduct-product' }, 'STTImage', 'asc']
                    ],
                    limit: 10,
                    raw: false,
                    nest: true
                });

                if (products && products.length > 0) {
                    resolve({
                        errCode: 0,
                        data: products
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy sản phẩm nào!'
                    })
                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const getProductFlycam = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let products = await db.product.findAll({
                attributes: ['id', 'nameProduct', 'priceProduct', 'isSell', 'sold'],
                include: [
                    {
                        model: db.imageProduct, as: 'imageProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        },

                    },
                    {
                        model: db.trademark,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    },
                    {
                        model: db.typeProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        },
                        where: {
                            nameTypeProduct: 'điện thoại'
                        }
                    },
                    {
                        model: db.classifyProduct, as: 'classifyProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    },
                    {
                        model: db.promotionProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        },
                    }
                ],
                order: [
                    [{ model: db.imageProduct, as: 'imageProduct-product' }, 'STTImage', 'asc']
                ],
                limit: 24,
                raw: false,
                nest: true
            });

            if (products && products.length > 0) {
                resolve({
                    errCode: 0,
                    data: products
                })
            }
            else {
                resolve({
                    errCode: 2,
                    errMessage: 'Không tìm thấy sản phẩm nào!'
                })
            }


        }
        catch (e) {
            reject(e);
        }
    })
}

const getListProductMayLike = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.nameTypeProduct || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                let products = await db.product.findAll({
                    attributes: ['id', 'nameProduct', 'priceProduct', 'isSell', 'sold'],
                    where: {
                        id: {
                            [Op.ne]: data.id
                        }
                    },
                    include: [
                        {
                            model: db.imageProduct, as: 'imageProduct-product',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id']
                            },
                        },
                        {
                            model: db.trademark,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id']
                            }
                        },
                        {
                            model: db.typeProduct,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id']
                            },
                            where: {
                                nameTypeProduct: data.nameTypeProduct
                            }
                        },
                        {
                            model: db.classifyProduct, as: 'classifyProduct-product',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id']
                            }
                        },
                        {
                            model: db.promotionProduct,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id']
                            },
                        }
                    ],
                    order: [
                        [{ model: db.imageProduct, as: 'imageProduct-product' }, 'STTImage', 'asc']
                    ],
                    limit: 20,
                    raw: false,
                    nest: true
                });

                if (products && products.length > 0) {
                    resolve({
                        errCode: 0,
                        data: products
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy sản phẩm nào!'
                    })
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getProductPromotionHome,
    getTopSellProduct,
    getNewCollectionProduct,
    getProductFlycam,
    getListProductMayLike
}