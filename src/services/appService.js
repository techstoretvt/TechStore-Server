import db from '../models'
const { Op, UUIDV4 } = require("sequelize");
require('dotenv').config();
import FuzzySearch from 'fuzzy-search';
import { v4 as uuidv4 } from 'uuid';
import commont from '../services/commont'

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
                if (avgStarArrr.length === 0) {
                    avgStar = 0
                }
                else {
                    avgStar = totalStar / avgStarArrr.length
                }

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

//test
const GetListProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let products = await db.product.findAll()

            resolve(products)
        }
        catch (e) {
            reject(e);
        }
    })
}

const createProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {

            // let product = await db.product.create({
            //     nameProduct: data.name,
            //     id: uuidv4(),
            //     idTypeProduct: 'sfsdfsd',
            //     idTrademark: 'sfsdfds',
            //     isSell: 'true',
            //     sold: 0,

            // })

            resolve({
                errCode: 0,
                mess: 'đã thêm sản phẩm'
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
//end test

const getListBlog = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.page || !data.maxCount) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let date = new Date().getTime()
                let arrIdBlogLike = []

                let blogs = await db.blogs.findAll({
                    where: {
                        timePost: {
                            [Op.lt]: date
                        }
                    },
                    offset: (data.page - 1) * data.maxCount,
                    limit: data.maxCount,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'viewBlog', 'timePost', 'timeBlog', 'idUser', 'contentMarkdown']
                    },
                    include: [
                        {
                            model: db.imageBlogs,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'stt', 'idCloudinary', 'idBlog', '']
                            }
                        },
                        {
                            model: db.videoBlogs,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'stt', 'idBlog', '']
                            }
                        },
                        {
                            model: db.User,
                            attributes: {
                                exclude: [
                                    'updatedAt', 'statusUser', 'sdt', 'pass', 'keyVerify', 'idGoogle', 'idGithub', 'idFacebook', 'id', 'email', 'createdAt', 'birtday', 'gender'
                                ]
                            },
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false'
                                }
                            },

                        },
                        {
                            model: db.blogShares, as: 'blogs-blogShares-parent',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'stt', 'idBlogShare', 'idProduct', 'idBlog']
                            },
                            include: [
                                {
                                    model: db.product,
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt', 'stt', 'sold', 'priceProduct', 'nameProductEn', 'isSell', 'idTypeProduct', 'idTrademark', 'contentMarkdown', 'contentHTML']
                                    },
                                    include: [
                                        {
                                            model: db.imageProduct, as: 'imageProduct-product',
                                        }
                                    ]
                                },
                                {
                                    model: db.blogs, as: 'blogs-blogShares-child',
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt', 'stt', 'viewBlog', 'timePost', 'timeBlog', 'idUser', 'contentMarkdown']
                                    },
                                }
                            ]
                        },


                    ],
                    order: [['stt', 'DESC']],
                    raw: false,
                    nest: true
                })

                let countPage = await db.blogs.count({
                    where: {
                        timePost: {
                            [Op.lt]: date
                        }
                    },
                })


                if (data.accessToken) {
                    let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                    if (decode !== null) {
                        let idUser = decode.id
                        let listIdBlog = []

                        let blogArr = await db.blogs.findAll({
                            where: {
                                timePost: {
                                    [Op.lt]: date
                                }
                            },
                            offset: (data.page - 1) * data.maxCount,
                            limit: data.maxCount,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'viewBlog', 'timePost', 'timeBlog', 'idUser', 'contentMarkdown']
                            },
                            include: [

                                {
                                    model: db.User,
                                    attributes: {
                                        exclude: [
                                            'updatedAt', 'statusUser', 'sdt', 'pass', 'keyVerify', 'idGoogle', 'idGithub', 'idFacebook', 'id', 'email', 'createdAt', 'birtday', 'gender'
                                        ]
                                    },
                                    where: {
                                        statusUser: {
                                            [Op.ne]: 'false'
                                        }
                                    },
                                },
                            ],
                            order: [['stt', 'DESC']],
                            raw: false,
                            nest: true
                        })

                        blogArr.forEach((item, index) => {

                            let idBlog = { ...item }.dataValues.id
                            listIdBlog.push(idBlog)
                        })
                        let likeBlog = await db.likeBlog.findAll({
                            where: {
                                idUser,
                                idBlog: {
                                    [Op.in]: listIdBlog
                                }
                            },
                            attributes: ['idBlog']
                        })

                        let listIdBlogCollection = await db.collectionBlogs.findAll({
                            where: {
                                idUser: decode.id
                            },
                            attributes: ['idBlog']
                        })

                        resolve({
                            errCode: 0,
                            data: blogs,
                            countPage,
                            arrIdBlogLike: likeBlog,
                            listIdBlogCollection
                        })
                        return
                    }

                }

                resolve({
                    errCode: 0,
                    data: blogs,
                    countPage,
                    arrIdBlogLike,
                    listIdBlogCollection: []
                })

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getListHashTag = (data) => {
    return new Promise(async (resolve, reject) => {
        try {


            let listProducts = await db.product.findAll({
                attributes: ['id', 'nameProduct']
            })


            resolve({
                errCode: 0,
                data: listProducts
            })


        }
        catch (e) {
            reject(e);
        }
    })
}

const getBlogShareProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBlog) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let blogs = await db.blogs.findOne({
                    where: {
                        id: data.idBlog
                    },
                    attributes: {
                        exclude: ['updatedAt', 'viewBlog', 'timePost', 'timeBlog', 'idUser', 'contentMarkdown']
                    },
                    include: [
                        {
                            model: db.User,
                            attributes: {
                                exclude: [
                                    'updatedAt', 'statusUser', 'sdt', 'pass', 'keyVerify', 'idGoogle', 'idGithub', 'idFacebook', 'id', 'email', 'createdAt', 'birtday', 'gender'
                                ]
                            },
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false'
                                }
                            }
                        },
                        {
                            model: db.blogShares, as: 'blogs-blogShares-parent',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'stt', 'idBlogShare', 'idProduct', 'idBlog']
                            },
                            include: [
                                {
                                    model: db.product,
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt', 'stt', 'sold', 'priceProduct', 'nameProductEn', 'isSell', 'idTypeProduct', 'idTrademark', 'contentMarkdown', 'contentHTML']
                                    },
                                    include: [
                                        {
                                            model: db.imageProduct, as: 'imageProduct-product',
                                        }
                                    ]
                                },
                            ]
                        }

                    ],
                    order: [['stt', 'DESC']],
                    raw: false,
                    nest: true
                })


                resolve({
                    errCode: 0,
                    data: blogs,
                })

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getBlogShareDefault = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBlog) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let blogs = await db.blogs.findOne({
                    where: {
                        id: data.idBlog
                    },
                    attributes: {
                        exclude: ['updatedAt', 'viewBlog', 'timePost', 'timeBlog', 'idUser', 'contentMarkdown']
                    },
                    include: [
                        {
                            model: db.User,
                            attributes: {
                                exclude: [
                                    'updatedAt', 'statusUser', 'sdt', 'pass', 'keyVerify', 'idGoogle', 'idGithub', 'idFacebook', 'id', 'email', 'createdAt', 'birtday', 'gender'
                                ]
                            },
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false'
                                }
                            }
                        },
                        {
                            model: db.imageBlogs,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'stt', 'idCloudinary', 'idBlog', '']
                            }
                        },
                        {
                            model: db.videoBlogs,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'stt', 'idBlog', '']
                            }
                        },
                    ],
                    raw: false,
                    nest: true
                })


                resolve({
                    errCode: 0,
                    data: blogs,
                })

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getBlogById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBlog) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let date = new Date().getTime()
                let blogs = await db.blogs.findOne({
                    where: {
                        id: data.idBlog,
                        timePost: {
                            [Op.lt]: date
                        }
                    },
                    attributes: {
                        exclude: ['updatedAt', 'viewBlog', 'timePost', 'timeBlog', 'idUser', 'contentMarkdown']
                    },
                    include: [
                        {
                            model: db.User,
                            attributes: {
                                exclude: [
                                    'updatedAt', 'statusUser', 'sdt', 'pass', 'keyVerify', 'idGoogle', 'idGithub', 'idFacebook', 'id', 'email', 'createdAt', 'birtday', 'gender'
                                ]
                            },
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false'
                                }
                            }
                        },
                        {
                            model: db.imageBlogs,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'stt', 'idCloudinary', 'idBlog', '']
                            }
                        },
                        {
                            model: db.videoBlogs,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'stt', 'idBlog', '']
                            }
                        },
                        {
                            model: db.blogShares, as: 'blogs-blogShares-parent',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'stt', 'idBlogShare', 'idProduct', 'idBlog']
                            },
                            include: [
                                {
                                    model: db.product,
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt', 'stt', 'sold', 'priceProduct', 'nameProductEn', 'isSell', 'idTypeProduct', 'idTrademark', 'contentMarkdown', 'contentHTML']
                                    },
                                    include: [
                                        {
                                            model: db.imageProduct, as: 'imageProduct-product',
                                        }
                                    ]
                                },
                                {
                                    model: db.blogs, as: 'blogs-blogShares-child',
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt', 'stt', 'viewBlog', 'timePost', 'timeBlog', 'idUser', 'contentMarkdown']
                                    },
                                }
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if (blogs) {
                    let checkLike = false
                    let checkCollection = false
                    if (data.accessToken) {
                        let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)

                        if (decode !== null) {
                            let likeBlogUser = await db.likeBlog.findOne({
                                where: {
                                    idUser: decode.id,
                                    idBlog: data.idBlog
                                }
                            })
                            let collectionBlogs = await db.collectionBlogs.findOne({
                                where: {
                                    idBlog: data.idBlog,
                                    idUser: decode.id
                                }
                            })

                            if (likeBlogUser) checkLike = true
                            if (collectionBlogs) checkCollection = true
                        }
                    }
                    resolve({
                        errCode: 0,
                        data: blogs,
                        checkLike,
                        checkCollection
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Not found'
                    })
                }

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getCommentBlogByIdBlog = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBlog || !data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let commentBlogs = await db.commentBlog.findAll({
                    where: {
                        idBlog: data.idBlog
                    },
                    limit: 20,
                    offset: (+data.page - 1) * 20,
                    include: [
                        {
                            model: db.User,
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false'
                                }
                            }
                        }
                    ],
                    order: [['stt', 'DESC']],
                    raw: false,
                    nest: true
                })

                let count = await db.commentBlog.count({
                    where: {
                        idBlog: data.idBlog
                    },
                    include: [
                        {
                            model: db.User,
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false'
                                }
                            }
                        }
                    ],
                    raw: false,
                    nest: true
                })


                if (data.accessToken) {
                    let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                    if (decode !== null) {
                        resolve({
                            errCode: 0,
                            data: commentBlogs,
                            idUser: decode.id,
                            count
                        })
                        return
                    }
                }


                resolve({
                    errCode: 0,
                    data: commentBlogs,
                    count
                })

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const increaseViewBlogById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBlog) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let blog = await db.blogs.findOne({
                    where: {
                        id: data.idBlog
                    },
                    raw: false
                })

                if (blog) {
                    blog.viewBlog = blog.viewBlog + 1
                    await blog.save()
                }


                resolve({
                    errCode: 0,
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
    GetListProduct,
    createProduct,
    getListBlog,
    getListHashTag,
    getBlogShareProduct,
    getBlogShareDefault,
    getBlogById,
    getCommentBlogByIdBlog,
    increaseViewBlogById
}