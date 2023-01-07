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
                console.log(data.nameTypeProduct.toLowerCase());
                let [typeProduct, created] = await db.typeProduct.findOrCreate({
                    where: { nameTypeProduct: data.nameTypeProduct.toLowerCase() },
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

                    let restrademark = await db.trademark.findAll({
                        where: { idTypeProduct: +data.idType },
                        raw: false
                    })
                    if (restrademark) {
                        await restrademark.destroy();
                    }

                    let products = await db.product.findAll({
                        where: { idTypeProduct: +data.idType },
                        raw: false
                    })
                    if (products) {
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
            console.log(data);
            if (!data.id || !data.nameTypeProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let typeProduct = await db.typeProduct.findOne({
                    where: { id: +data.id },
                    raw: false
                })

                if (!typeProduct) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy loại sản phẩm này!',
                    })
                }
                else {
                    let check = await db.typeProduct.findOne({
                        where: { nameTypeProduct: data.nameTypeProduct.toLowerCase() },
                        raw: false
                    })
                    if (check) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Loại sản phẩm đã tồn tại!',
                        })
                    }
                    else {
                        typeProduct.nameTypeProduct = data.nameTypeProduct.toLowerCase();
                        await typeProduct.save();

                        resolve({
                            errCode: 0,
                            errMessage: 'Đã thay đổi tên loại sản phẩm thành công!',
                        })
                    }
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
                    ['idTypeProduct', 'ASC'],
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

const deleteTrademarkById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idTrademark) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {

                let resTrademark = await db.trademark.findOne({
                    where: {
                        id: +data.idTrademark
                    },
                    raw: false
                })
                if (!resTrademark) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy thương hiệu này!',
                    })
                }
                else {
                    await resTrademark.destroy();
                    let products = await db.product.findAll({
                        where: {
                            idTrademark: +data.idTrademark
                        },
                        raw: false
                    })
                    if (products && products.length > 0) {
                        await products.destroy();
                    }

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

const updateTrademarkById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.idTypeProduct || !data.nameTrademark) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {

                let trademarkEdit = await db.trademark.findOne({
                    where: {
                        id: +data.id,
                    },
                    raw: false
                })
                if (trademarkEdit) {
                    let check = await db.trademark.findOne({
                        where: {
                            idTypeProduct: +data.idTypeProduct,
                            nameTrademark: data.nameTrademark.toLowerCase()
                        },
                        raw: false
                    })

                    if (check) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Thương hiệu này đã tồn tại!',
                        })
                    }
                    else {
                        trademarkEdit.nameTrademark = data.nameTrademark.toLowerCase();
                        trademarkEdit.idTypeProduct = +data.idTypeProduct;
                        await trademarkEdit.save();

                        resolve({
                            errCode: 0,
                            errMessage: 'ok',
                        })
                    }
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy thương hiệu này!',
                    })
                }


            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const createNewProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.nameProduct || !data.priceProduct || !data.idTypeProduct || !data.idTrademark || !data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {

                let product = await db.product.create({
                    nameProduct: data.nameProduct.toLowerCase(),
                    priceProduct: data.priceProduct,
                    idTypeProduct: +data.idTypeProduct,
                    idTrademark: +data.idTrademark,
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    isSell: 'true',
                    sold: 0
                })

                // console.log('product: ', product.dataValues);


                if (data.listClassify?.length > 0) {
                    data.listClassify.forEach(async (item, index) => {
                        let classifyProduct = await db.classifyProduct.create({
                            idProduct: product.dataValues.id,
                            amount: item.amount,
                            nameClassifyProduct: item.nameClassify.toLowerCase(),
                            STTImg: item.STTImg ? +item.STTImg : -1,
                            priceClassify: +item.priceClassify
                        })
                        console.log(`classify ${index}:`, classifyProduct.dataValues);
                    })
                }
                else {
                    let classifyProduct = await db.classifyProduct.create({
                        idProduct: product.dataValues.id,
                        amount: +data.sl,
                        nameClassifyProduct: 'default',
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Create a new product success!',
                    idProduct: product.dataValues.id
                })

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const cloudinaryUpload = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.file || !data.query.num || !data.query.idProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let imageProduct = await db.imageProduct.create({
                    idProduct: +data.query.idProduct,
                    imagebase64: data.file.path,
                    STTImage: +data.query.num
                })
                console.log(`imgproduct ${data.query.num}: `, imageProduct.dataValues);


                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    data: {
                        secure_url: data.file.path,
                        num: data.query.num,
                        idProduct: data.query.idProduct
                    }
                })

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getListProductByPage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let page = +data.page
                let products = await db.product.findAll({
                    offset: (page - 1) * 5,
                    limit: 5,
                    include: [
                        { model: db.typeProduct, attributes: ['id', 'nameTypeProduct'] },
                        { model: db.trademark, attributes: ['id', 'nameTrademark'] },
                        {
                            model: db.imageProduct, as: 'imageProduct-product',
                        },
                        {
                            model: db.classifyProduct,
                            as: 'classifyProduct-product'
                        },
                    ],
                    order: [
                        ['id', 'DESC'],
                        [{ model: db.imageProduct, as: 'imageProduct-product' }, 'STTImage', 'asc']
                    ],
                    nest: true,
                    raw: false
                })

                const count = await db.product.count();

                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    data: products,
                    count: count
                })

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const blockProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.isSell || !data.idProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let product = await db.product.findOne({
                    where: {
                        id: data.idProduct,
                    },
                    raw: false
                })

                if (!product) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy sản phẩm này!',
                    })
                }
                else {
                    product.isSell = data.isSell
                    await product.save()

                    resolve({
                        errCode: 0,
                        errMessage: 'Đã khóa sản phẩm!',
                    })
                }


            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const editProductById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.nameProduct || !data.priceProduct || !data.idTypeProduct || !data.idTrademark || !data.contentHTML || !data.contentMarkdown || !data.idProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let product = await db.product.findOne({
                    where: {
                        id: +data.idProduct
                    },
                    raw: false
                })

                if (!product) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy sản phẩm này!',
                    })
                }
                else {
                    product.nameProduct = data.nameProduct;
                    product.priceProduct = data.priceProduct;
                    product.idTypeProduct = data.idTypeProduct;
                    product.idTrademark = data.idTrademark;
                    product.contentHTML = data.contentHTML;
                    product.contentMarkdown = data.contentMarkdown

                    await product.save();

                    if (data.listClassify.length === 0) {
                        let isDelete = true

                        while (isDelete) {
                            let classifyProduct = await db.classifyProduct.findOne({
                                where: {
                                    idProduct: +data.idProduct
                                },
                                raw: false
                            })

                            if (classifyProduct) {
                                await classifyProduct.destroy()
                            }
                            else {
                                isDelete = false
                            }
                        }

                        await db.classifyProduct.create({
                            idProduct: +data.idProduct,
                            amount: +data.sl,
                            nameClassifyProduct: 'default',
                        })

                    }
                    else {
                        let isDelete = true

                        while (isDelete) {
                            let classifyProduct = await db.classifyProduct.findOne({
                                where: {
                                    idProduct: +data.idProduct
                                },
                                raw: false
                            })

                            if (classifyProduct) {
                                await classifyProduct.destroy()
                            }
                            else {
                                isDelete = false
                            }
                        }

                        data.listClassify.forEach(async (item, index) => {
                            let classifyProduct = await db.classifyProduct.create({
                                idProduct: data.idProduct,
                                amount: item.amount,
                                nameClassifyProduct: item.nameClassify.toLowerCase(),
                                STTImg: item.STTImg ? +item.STTImg : -1,
                                priceClassify: item.priceClassify
                            })
                        })
                    }

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

const editImageProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.file || !data.query.num || !data.query.idProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {

                let imageProduct = await db.imageProduct.findOne({
                    where: {
                        idProduct: +data.query.idProduct,
                        STTImage: +data.query.num,
                    },
                    raw: false
                })

                if (imageProduct) {
                    imageProduct.imagebase64 = data.file.path
                    await imageProduct.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'ok!',
                    })
                }
                else {
                    await db.imageProduct.create({
                        idProduct: +data.query.idProduct,
                        imagebase64: data.file.path,
                        STTImage: +data.query.num
                    })
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

const swapImageProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.imageProducts || !data.idProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {


                let isDelete = true
                while (isDelete) {
                    let imageProduct = await db.imageProduct.findOne({
                        where: {
                            idProduct: data.idProduct
                        },
                        raw: false
                    })
                    if (imageProduct) {
                        await imageProduct.destroy();
                    }
                    else {
                        isDelete = false
                    }
                }

                data.imageProducts.forEach(async (item, index) => {
                    await db.imageProduct.create({
                        idProduct: +data.idProduct,
                        imagebase64: item.url,
                        STTImage: +item.num
                    })
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Sắp xếp ảnh thành công!',
                })

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getProductBySwapAndPage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.currentPage || !data.typeSwap) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let arr = [
                    ['id', 'ASC'],
                    ['id', 'DESC'],
                    ['nameProduct', 'ASC'],
                    ['nameProduct', 'DESC']
                ];
                let page = +data.currentPage
                let products = await db.product.findAll({
                    offset: (page - 1) * 10,
                    limit: 10,
                    attributes: ['id', 'nameProduct'],
                    include: [
                        { model: db.typeProduct, attributes: ['id', 'nameTypeProduct'] },
                        { model: db.trademark, attributes: ['id', 'nameTrademark'] },
                        { model: db.promotionProduct, attributes: ['timePromotion', 'numberPercent'] },
                    ],
                    order: [arr[+data.typeSwap - 1]],
                    nest: true,
                    raw: false
                })

                if (products) {

                    let count = await db.product.count()

                    resolve({
                        errCode: 0,
                        errMessage: 'ok!',
                        data: products,
                        count: count
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy sản phẩm nào!',
                    })
                }

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const addPromotionByIdProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idProduct || !data.timePromotion || !data.persentPromotion) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let [promotion, created] = await db.promotionProduct.findOrCreate({
                    where: {
                        idProduct: +data.idProduct
                    },
                    defaults: {
                        timePromotion: data.timePromotion + '',
                        numberPercent: +data.persentPromotion,
                    },
                    raw: false
                })
                if (created) {
                    resolve({
                        errCode: 0,
                        errMessage: 'ok',
                    })
                }
                else {
                    promotion.timePromotion = data.timePromotion;
                    promotion.numberPercent = +data.persentPromotion;
                    await promotion.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'ok',
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
    addTypeProduct,
    getAllTypeProduct,
    deleteTypeProduct,
    updateTypeProductById,
    addTrademark,
    getAllTrademark,
    deleteTrademarkById,
    updateTrademarkById,
    createNewProduct,
    cloudinaryUpload,
    getListProductByPage,
    blockProduct,
    editProductById,
    editImageProduct,
    swapImageProduct,
    getProductBySwapAndPage,
    addPromotionByIdProduct
}