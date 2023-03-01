import db from '../models'
const { Op } = require("sequelize");
import FuzzySearch from 'fuzzy-search';

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

                let arrType = data.nameTypeProduct.split(',')

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
                                nameTypeProduct: {
                                    [Op.in]: arrType
                                }
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

const getEvaluateByIdProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idProduct || !data.fillter || !data.page || !data.offset) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let amount5star = await db.evaluateProduct.count({
                    where: {
                        idProduct: data.idProduct,
                        starNumber: 5
                    }
                })
                let amount4star = await db.evaluateProduct.count({
                    where: {
                        idProduct: data.idProduct,
                        starNumber: 4
                    }
                })
                let amount3star = await db.evaluateProduct.count({
                    where: {
                        idProduct: data.idProduct,
                        starNumber: 3
                    }
                })
                let amount2star = await db.evaluateProduct.count({
                    where: {
                        idProduct: data.idProduct,
                        starNumber: 2
                    }
                })
                let amount1star = await db.evaluateProduct.count({
                    where: {
                        idProduct: data.idProduct,
                        starNumber: 1
                    }
                })

                let amountComment = await db.evaluateProduct.count({
                    where: {
                        idProduct: data.idProduct,
                        content: {
                            [Op.ne]: ""
                        }
                    }
                })

                let evaluateProductArr = await db.evaluateProduct.findAll({
                    where: {
                        idProduct: data.idProduct
                    },
                })
                let amountImage = 0
                let amountVideo = 0
                evaluateProductArr.forEach(async item => {
                    let image = await db.imageEvaluateProduct.findOne({
                        where: {
                            idEvaluateProduct: item.id
                        }
                    })
                    let video = await db.videoEvaluateProduct.findOne({
                        where: {
                            idEvaluateProduct: item.id
                        }
                    })
                    if (image) amountImage++
                    if (video) amountVideo++
                })

                let avgStarArrr = await db.evaluateProduct.findAll({
                    where: {
                        idProduct: data.idProduct
                    }
                })

                let avgStar, totalStar = 0
                avgStarArrr.forEach(item => {
                    totalStar += item.starNumber
                });
                avgStar = totalStar / avgStarArrr.length

                if (data.fillter === 'all') {
                    let evaluateProduct = await db.evaluateProduct.findAll({
                        where: {
                            idProduct: data.idProduct
                        },
                        offset: (data.page - 1) * data.offset,
                        limit: data.offset,
                        include: [
                            {
                                model: db.User,
                                attributes: [
                                    'firstName', 'lastName', 'typeAccount',
                                    'avatar', 'avatarGoogle', 'avatarFacebook', 'avatarGithub',
                                    'avatarUpdate'
                                ]
                            },
                            {
                                model: db.detailBill,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: db.classifyProduct,
                                        attributes: ['nameClassifyProduct'],
                                    }
                                ]
                            },
                            {
                                model: db.imageEvaluateProduct
                            },
                            {
                                model: db.videoEvaluateProduct
                            }
                        ],
                        order: [['createdAt', 'DESC']],
                        raw: false,
                        nest: true
                    })

                    let amountEvaluate = await db.evaluateProduct.count({
                        where: {
                            idProduct: data.idProduct
                        },
                    })


                    resolve({
                        errCode: 0,

                        data: evaluateProduct,
                        amoutFiller: amountEvaluate,

                        amount5star,
                        amount4star,
                        amount3star,
                        amount2star,
                        amount1star,
                        amountComment,
                        amountImage,
                        amountVideo,
                        avgStar
                    })


                }

                else if (data.fillter !== 'all' && data.fillter !== 'comment' && data.fillter !== 'video'
                    && data.fillter !== 'image'
                ) {
                    let evaluateProduct = await db.evaluateProduct.findAll({
                        where: {
                            idProduct: data.idProduct,
                            starNumber: +data.fillter
                        },
                        offset: (data.page - 1) * data.offset,
                        limit: data.offset,
                        include: [
                            {
                                model: db.User,
                                attributes: [
                                    'firstName', 'lastName', 'typeAccount',
                                    'avatar', 'avatarGoogle', 'avatarFacebook', 'avatarGithub',
                                    'avatarUpdate'
                                ]
                            },
                            {
                                model: db.detailBill,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: db.classifyProduct,
                                        attributes: ['nameClassifyProduct'],
                                    }
                                ]
                            },
                            {
                                model: db.imageEvaluateProduct
                            },
                            {
                                model: db.videoEvaluateProduct
                            }
                        ],
                        order: [['createdAt', 'DESC']],
                        raw: false,
                        nest: true
                    })

                    let amountEvaluate = await db.evaluateProduct.count({
                        where: {
                            idProduct: data.idProduct,
                            starNumber: +data.fillter
                        },
                    })


                    resolve({
                        errCode: 0,

                        data: evaluateProduct,
                        amoutFiller: amountEvaluate,

                        amount5star,
                        amount4star,
                        amount3star,
                        amount2star,
                        amount1star,
                        amountComment,
                        amountImage,
                        amountVideo,
                        avgStar
                    })
                }
                else if (data.fillter === 'comment') {
                    let evaluateProduct = await db.evaluateProduct.findAll({
                        where: {
                            idProduct: data.idProduct,
                            content: {
                                [Op.ne]: ''
                            }
                        },
                        offset: (data.page - 1) * data.offset,
                        limit: data.offset,
                        include: [
                            {
                                model: db.User,
                                attributes: [
                                    'firstName', 'lastName', 'typeAccount',
                                    'avatar', 'avatarGoogle', 'avatarFacebook', 'avatarGithub',
                                    'avatarUpdate'
                                ]
                            },
                            {
                                model: db.detailBill,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: db.classifyProduct,
                                        attributes: ['nameClassifyProduct'],
                                    }
                                ]
                            },
                            {
                                model: db.imageEvaluateProduct
                            },
                            {
                                model: db.videoEvaluateProduct
                            }
                        ],
                        order: [['createdAt', 'DESC']],
                        raw: false,
                        nest: true
                    })

                    let amountEvaluate = await db.evaluateProduct.count({
                        where: {
                            idProduct: data.idProduct,
                            content: {
                                [Op.ne]: ''
                            }
                        },
                    })


                    resolve({
                        errCode: 0,

                        data: evaluateProduct,
                        amoutFiller: amountEvaluate,

                        amount5star,
                        amount4star,
                        amount3star,
                        amount2star,
                        amount1star,
                        amountComment,
                        amountImage,
                        amountVideo,
                        avgStar
                    })
                }
                else if (data.fillter === 'image') {
                    let evaluateProduct = await db.evaluateProduct.findAll({
                        where: {
                            idProduct: data.idProduct,
                        },
                        offset: (data.page - 1) * data.offset,
                        limit: data.offset,
                        include: [
                            {
                                model: db.User,
                                attributes: [
                                    'firstName', 'lastName', 'typeAccount',
                                    'avatar', 'avatarGoogle', 'avatarFacebook', 'avatarGithub',
                                    'avatarUpdate'
                                ]
                            },
                            {
                                model: db.detailBill,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: db.classifyProduct,
                                        attributes: ['nameClassifyProduct'],
                                    }
                                ]
                            },
                            {
                                model: db.imageEvaluateProduct,
                                where: {
                                    imagebase64: {
                                        [Op.ne]: ''
                                    }
                                }
                            },
                            {
                                model: db.videoEvaluateProduct,

                            }
                        ],
                        order: [['createdAt', 'DESC']],
                        raw: false,
                        nest: true
                    })

                    resolve({
                        errCode: 0,

                        data: evaluateProduct,
                        amoutFiller: amountImage,

                        amount5star,
                        amount4star,
                        amount3star,
                        amount2star,
                        amount1star,
                        amountComment,
                        amountImage,
                        amountVideo,
                        avgStar
                    })
                }
                else if (data.fillter === 'video') {
                    let evaluateProduct = await db.evaluateProduct.findAll({
                        where: {
                            idProduct: data.idProduct,
                        },
                        offset: (data.page - 1) * data.offset,
                        limit: data.offset,
                        include: [
                            {
                                model: db.User,
                                attributes: [
                                    'firstName', 'lastName', 'typeAccount',
                                    'avatar', 'avatarGoogle', 'avatarFacebook', 'avatarGithub',
                                    'avatarUpdate'
                                ]
                            },
                            {
                                model: db.detailBill,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: db.classifyProduct,
                                        attributes: ['nameClassifyProduct'],
                                    }
                                ]
                            },
                            {
                                model: db.imageEvaluateProduct,

                            },
                            {
                                model: db.videoEvaluateProduct,
                                where: {
                                    videobase64: {
                                        [Op.ne]: ''
                                    }
                                }
                            }
                        ],
                        order: [['createdAt', 'DESC']],
                        raw: false,
                        nest: true
                    })

                    resolve({
                        errCode: 0,

                        data: evaluateProduct,
                        amoutFiller: amountVideo,

                        amount5star,
                        amount4star,
                        amount3star,
                        amount2star,
                        amount1star,
                        amountComment,
                        amountImage,
                        amountVideo,
                        avgStar
                    })
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}


const searchProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.keyword || !data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let whereTrademark = () => {
                    if (!data.brand) return {}
                    let arr = data.brand.split(',')
                    return {
                        nameTrademark: {
                            [Op.or]: arr
                        }
                    }
                }

                let whereTypeProduct = () => {
                    if (!data.facet) return {}
                    let arr = data.facet.split(',')
                    return {
                        nameTypeProduct: {
                            [Op.or]: arr
                        }
                    }
                }

                let whereStatus = () => {
                    if (!data.status) return {}
                    return {
                        isSell: data.status === 'sell' ? 'true' : 'false'
                    }
                }

                let wherePrice = () => {
                    if (!data.minP || !data.maxP) return {}
                    return {
                        priceClassify: {
                            [Op.between]: [+data.minP, +data.maxP]
                        }
                    }
                }

                let whereRating = () => {
                    if (!data.rating) return null

                    return {
                        starNumber: {
                            [Op.gte]: +data.rating
                        }
                    }
                }

                // let arrOrder = () => {
                //     if (!data.order) return null

                //     if (data.order === 'latest') {
                //         return ['createdAt', 'DESC']
                //     }

                //     if (data.order === 'selling') {
                //         return ['isSell', 'DESC']
                //     }
                // }

                let arrOrder = [['nameProduct', 'asc'], ['stt', 'DESC'], ['isSell', 'DESC']]
                let indexOrder = !data.order ? 0 : data.order === 'latest' ? 1 : data.order === 'selling' ? 2 : 0


                let listProducts = await db.product.findAll({
                    where: whereStatus(),
                    // offset: (data.page - 1) * data.maxProduct,
                    // limit: data.maxProduct,
                    include: [
                        {
                            model: db.trademark,
                            where: whereTrademark()
                        },
                        {
                            model: db.typeProduct,
                            where: whereTypeProduct()
                        },
                        {
                            model: db.imageProduct, as: 'imageProduct-product'
                        },
                        {
                            model: db.classifyProduct, as: 'classifyProduct-product',
                            where: wherePrice(),
                        },
                        {
                            model: db.promotionProduct
                        },
                        {
                            model: db.evaluateProduct,
                            where: whereRating()
                        }
                    ],
                    order: [
                        [{ model: db.imageProduct, as: 'imageProduct-product' }, 'STTImage', 'asc'],
                        [{ model: db.classifyProduct, as: 'classifyProduct-product' }, 'priceClassify', 'asc'],
                        arrOrder[indexOrder]
                    ],
                    raw: false,
                    nest: true
                })

                const searcher = new FuzzySearch(listProducts, ['nameProductEn', 'trademark.nameTrademarkEn', 'typeProduct.nameTypeProductEn'], {
                    caseSensitive: false,
                    sort: true
                });
                let key = data.keyword.normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/đ/g, 'd').replace(/Đ/g, 'D');

                const result = searcher.search(key);

                let start = (data.page - 1) * data.maxProduct
                let end = start + data.maxProduct

                resolve({
                    errCode: 0,
                    countProduct: result.length,
                    data: result.slice(start, end),
                })

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
    getListProductMayLike,
    getEvaluateByIdProduct,
    searchProduct,
}