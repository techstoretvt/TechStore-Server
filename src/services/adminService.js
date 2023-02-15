import db from '../models'
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from './commont'

const addTypeProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.query.nameTypeProduct || !data.file) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                //
                let [typeProduct, created] = await db.typeProduct.findOrCreate({
                    where: { nameTypeProduct: data.query.nameTypeProduct.toLowerCase() },
                    defaults: {
                        imageTypeProduct: data.file.path,
                        id: uuidv4(),
                        nameTypeProductEn: data.query.nameTypeProduct.toLowerCase().normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
                    },
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

const getAllTypeProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let typeProducts = await db.typeProduct.findAll({
                order: [
                    ['id', 'ASC'],
                ],
            });
            if (typeProducts && typeProducts.length > 0) {
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
            if (!data.query.idTypeProduct || !data.query.nameTypeProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let typeProduct = await db.typeProduct.findOne({
                    where: { id: data.query.idTypeProduct },
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
                        where: { nameTypeProduct: data.query.nameTypeProduct.toLowerCase() },
                        raw: false
                    })
                    if (check && check.id !== typeProduct.id) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Tên loại sản phẩm đã tồn tại!',
                        })
                    }
                    else {
                        typeProduct.nameTypeProduct = data.query.nameTypeProduct.toLowerCase();
                        typeProduct.nameTypeProductEn = data.query.nameTypeProduct.toLowerCase().normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
                        if (data.file) {
                            typeProduct.imageTypeProduct = data.file.path
                        }
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
                        idTypeProduct: data.idTypeProduct,
                    },
                    defaults: {
                        id: uuidv4(),
                        nameTrademarkEn: data.nameTrademark.toLowerCase().normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
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
                    { model: db.typeProduct, attributes: ['id', 'nameTypeProduct'] },
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
                        id: data.id,
                    },
                    raw: false
                })
                if (trademarkEdit) {
                    let check = await db.trademark.findOne({
                        where: {
                            idTypeProduct: data.idTypeProduct,
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
                        trademarkEdit.nameTrademarkEn = data.nameTrademark.toLowerCase().normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
                        trademarkEdit.idTypeProduct = data.idTypeProduct;
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
                    nameProductEn: data.nameProduct.toLowerCase().normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/đ/g, 'd').replace(/Đ/g, 'D'),
                    priceProduct: data.priceProduct,
                    idTypeProduct: data.idTypeProduct,
                    idTrademark: data.idTrademark,
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    isSell: 'true',
                    sold: 0,
                    id: uuidv4()
                })

                // console.log('product: ', product.dataValues);
                await db.promotionProduct.create({
                    idProduct: product.dataValues.id,
                    timePromotion: 0,
                    numberPercent: 0,
                    id: uuidv4()
                })


                if (data.listClassify?.length > 0) {
                    data.listClassify.forEach(async (item, index) => {
                        let classifyProduct = await db.classifyProduct.create({
                            idProduct: product.dataValues.id,
                            amount: item.amount,
                            nameClassifyProduct: item.nameClassify.toLowerCase() !== 'default' ?
                                item.nameClassify.toLowerCase() : 'Mặt định',
                            STTImg: item.STTImg ? +item.STTImg : 100,
                            priceClassify: +item.priceClassify,
                            id: uuidv4()
                        })
                    })
                }
                else {
                    let classifyProduct = await db.classifyProduct.create({
                        idProduct: product.dataValues.id,
                        amount: +data.sl,
                        nameClassifyProduct: 'default',
                        id: uuidv4()
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
                    idProduct: data.query.idProduct,
                    imagebase64: data.file.path,
                    STTImage: +data.query.num,
                    id: uuidv4()
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
                        ['stt', 'DESC'],
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
                        id: data.idProduct
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
                    product.nameProduct = data.nameProduct.toLowerCase();
                    product.nameProductEn = data.nameProduct.toLowerCase().normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
                    product.priceProduct = data.priceProduct;
                    product.idTypeProduct = data.idTypeProduct;
                    product.idTrademark = data.idTrademark;
                    product.contentHTML = data.contentHTML;
                    product.contentMarkdown = data.contentMarkdown

                    await product.save();

                    if (data.listClassify.length === 0) {
                        await db.classifyProduct.destroy({
                            where: {
                                idProduct: data.idProduct
                            }
                        })

                        await db.classifyProduct.create({
                            idProduct: data.idProduct,
                            amount: +data.sl,
                            nameClassifyProduct: 'default',
                            id: uuidv4()
                        })

                    }
                    else {
                        await db.classifyProduct.destroy({
                            where: {
                                idProduct: data.idProduct
                            }
                        })

                        let arrClassify = data.listClassify.map((item, index) => {
                            return {
                                idProduct: data.idProduct,
                                amount: +item.amount,
                                nameClassifyProduct: item.nameClassify.toLowerCase(),
                                STTImg: item.STTImg ? +item.STTImg : 100,
                                priceClassify: item.priceClassify,
                                id: uuidv4().toString()
                            }
                        })
                        await db.classifyProduct.bulkCreate(arrClassify, { individualHooks: true })
                    }

                    await db.cart.destroy({
                        where: {
                            idProduct: data.idProduct
                        }
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
                        idProduct: data.query.idProduct,
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
                        idProduct: data.query.idProduct,
                        imagebase64: data.file.path,
                        STTImage: +data.query.num,
                        id: uuidv4()
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

                await db.imageProduct.destroy({
                    where: {
                        idProduct: data.idProduct
                    }
                })

                let arrImageProduct = data.imageProducts.map((item) => {
                    return {
                        idProduct: data.idProduct,
                        imagebase64: item.url,
                        STTImage: +item.num,
                        id: uuidv4()
                    }
                })

                await db.imageProduct.bulkCreate(arrImageProduct, { individualHooks: true })

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
                    ['stt', 'DESC'],
                    ['stt', 'ASC'],
                    ['nameProduct', 'ASC'],
                    ['nameProduct', 'DESC']
                ];
                let page = +data.currentPage
                let products = await db.product.findAll({
                    offset: (page - 1) * 10,
                    limit: 10,
                    attributes: ['id', 'nameProduct', 'stt'],
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
                        idProduct: data.idProduct
                    },
                    defaults: {
                        timePromotion: data.timePromotion + '',
                        numberPercent: +data.persentPromotion,
                        id: uuidv4()
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

const testApi = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let datas = await db.typeProduct.findAll({
                include: [
                    { model: db.trademark },
                ],
                // nest: true,
                // raw: false
            })

            resolve({
                data: datas
            })

        }
        catch (e) {
            reject(e);
        }
    })
}

const deleteErrorProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                await db.product.destroy({
                    where: {
                        id: data.id
                    }
                })

                await db.classifyProduct.destroy({
                    where: {
                        idProduct: data.id
                    }
                })

                await db.imageProduct.destroy({
                    where: {
                        idProduct: data.id
                    }
                })



                resolve({
                    errCode: 0,
                    errMessage: 'da xoa all',
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const confirmBillById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let bill = await db.bill.findOne({
                    where: {
                        id: data.id
                    },
                    raw: false
                })

                if (bill) {
                    bill.idStatusBill = '2'
                    await bill.save()

                    //update amount product
                    let detailBill = await db.detailBill.findAll({
                        where: {
                            idBill: bill.id
                        }
                    })

                    let classifyProduct = await db.classifyProduct.findAll({
                        include: [
                            {
                                model: db.detailBill,
                                where: {
                                    idBill: bill.id
                                }
                            }
                        ],
                        raw: false,
                        nest: true
                    })
                    let check = true
                    detailBill.forEach((item, index) => {
                        if (classifyProduct[index].amount < item.amount) check = false
                        classifyProduct[index].amount = classifyProduct[index].amount - item.amount
                    })

                    if (!check) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Số lượng sản phẩm trong kho không còn đủ!',
                        })
                        return;
                    }

                    await classifyProduct.save()



                    //send email
                    let user = await db.User.findOne({
                        include: [
                            {
                                model: db.bill,
                                where: {
                                    id: data.id
                                }
                            }
                        ],
                        raw: false,
                        nest: true
                    })

                    let date = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()

                    let contentHTML = `
                    <div style="margin: 20px auto 0;width: min(100%,500px);padding: 10px;border: 1px solid #000;">
        <img src="https://res.cloudinary.com/dultkpqjp/image/upload/v1676188615/logo-full_yrga3v.png" alt="logo"
            style="width: min(50%,120px);margin: 0 auto;display: block;" />

        <br>
        <div>Xin chào ${user.firstName + " " + user.lastName},</div>
        <br>
        <div>
            Đơn hàng
            <span style="color: red;text-transform: uppercase;"> #${bill.id} </span>
            của bạn đã được duyệt và đang tiến hành giao hàng ngày ${date}.
        </div>
        <br>
        <div>
            Vui lòng đăng nhập TechStoreTvT để xem thông tin đơn hàng. Vui lòng kiểm tra cuộc gọi từ Shipper để nhận
            hàng trong thời gian sắp tới. Xin cảm ơn quý khách.
        </div>

        <a href="${process.env.LINK_FONTEND}" style="margin: 0 auto;display: block;background-color: red;color: #fff;border: none;
        padding: 10px 20px;border-radius: 4px;cursor: pointer;width: fit-content;text-decoration: none;">Ghé thăm
            website</a>

    </div>
                    `

                    if (user && user.typeAccount === 'web') {
                        console.log('giong');
                        sendEmail(user.email, 'Đơn hàng của bạn đã được xác nhận và đang tiến hành giao hàng',
                            contentHTML
                        )
                    }
                    resolve({
                        errCode: 0,
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Bill not found!',
                    })
                }


            }
        }
        catch (e) {
            reject(e);
        }
    })
}


const cancelBillById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.note) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let bill = await db.bill.findOne({
                    where: {
                        id: data.id
                    },
                    raw: false
                })

                if (bill) {
                    bill.idStatusBill = '4'
                    bill.noteCancel = data.note
                    await bill.save()

                    let user = await db.User.findOne({
                        include: [
                            {
                                model: db.bill,
                                where: {
                                    id: data.id
                                }
                            }
                        ],
                        raw: false,
                        nest: true
                    })
                    let date = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear();

                    let contentHTML = `
                    <div style="margin: 20px auto 0;width: min(100%,500px);padding: 10px;border: 1px solid #000;">
        <img src="https://res.cloudinary.com/dultkpqjp/image/upload/v1676188615/logo-full_yrga3v.png" alt="logo"
            style="width: min(50%,120px);margin: 0 auto;display: block;" />

        <br>
        <div>Xin chào ${user.firstName + " " + user.lastName},</div>
        <br>
        <div>
            Đơn hàng
            <span style="color: red;text-transform: uppercase;"> #${bill.id} </span>
            của bạn đã bị hủy ngày ${date}.
        </div>
        <br>
        <div>
            <b>Với lý do: </b>
            ${data.note}
        </div>
        <br>
        <div>
            TechStoreTvT rất tiếc vì không thể phục vụ quý khác đúng như mong đợi, cảm ơn quý khác đã ghé thắm và tin
            tưởng sử dụng dịch vụ của chúng tôi. Xin cảm ơn.
        </div>

    </div>
                    `

                    if (user && user.typeAccount === 'web') {
                        console.log('giong');
                        sendEmail(user.email, 'Đơn hàng của bạn đã bị hủy',
                            contentHTML
                        )
                    }


                    resolve({
                        errCode: 0,
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Bill not found!',
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
    addPromotionByIdProduct,
    testApi,
    deleteErrorProduct,
    confirmBillById,
    cancelBillById
}