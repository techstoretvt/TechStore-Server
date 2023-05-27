import db from '../models'
import { v4 as uuidv4 } from 'uuid';
import { sendEmail, hashPassword, decodeToken } from './commont'
import { Sequelize } from 'sequelize';
var cloudinary = require('cloudinary');
const { Op } = require("sequelize");
import { handleEmit } from '../index'
require('dotenv').config();
import FuzzySearch from 'fuzzy-search';
import jwt from 'jsonwebtoken'
import provinces from './provinces.json'
const { google } = require('googleapis');
// import { v4 as uuidv4 } from 'uuid';
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET
// });

//timer notifycations
// setInterval(async () => {
//     let date = new Date().getTime()
//     console.log('kiem tra thong bao: ', date);
//     let notifys = await db.timerNotifys.findAll({
//         where: {
//             status: "false",
//             timer: {
//                 [Op.lt]: date
//             }
//         }
//     })
//     if (notifys.length > 0) {
//         let users = await db.User.findAll({
//             where: {
//                 statusUser: {
//                     [Op.ne]: 'false'
//                 }
//             }
//         })
//         users = users.filter(user => {
//             return user.statusUser === 'true' || (user.statusUser * 1) < date
//         })
//         notifys.forEach(async item => {
//             let arr = users.map(user => {
//                 return {
//                     id: uuidv4(),
//                     title: item.title,
//                     content: item.content,
//                     redirect_to: item.redirect_to,
//                     idUser: user.id,
//                     typeNotify: item.typeNotify,
//                     timeCreate: date,
//                     urlImage: item.urlImage ?? ''
//                 }
//             })
//             await db.notifycations.bulkCreate(arr, { individualHooks: true })
//             handleEmit('new-notify-all', { title: item.title, content: item.content })
//         })
//         await db.timerNotifys.update({ status: 'true' }, {
//             where: {
//                 status: 'false'
//             }
//         })
//     }


// }, 60000)


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;



const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oAuth2Client
})

let GG_Drive = {
    setFilePublic: async (fileId) => {
        try {
            await drive.permissions.create({
                fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            })

            const getUrl = await drive.files.get({
                fileId,
                fields: 'webViewLink, webContentLink'
            })

            return getUrl;
        } catch (error) {
            console.error(error);
        }
    },
    uploadFile: async (name, idForder = "") => {
        try {
            let date = new Date().getTime()

            const createFile = await drive.files.create({
                requestBody: {
                    name: `Video-${date}`,
                    mimeType: 'video/*',
                    parents: [idForder],
                },
                media: {
                    mimeType: 'video/*',
                    body: fs.createReadStream(path.join(__dirname, `../public/videoTam/${name}`))
                }
            })
            const fileId = createFile.data.id;
            const getUrl = await GG_Drive.setFilePublic(fileId);

            return {
                url: getUrl.data.webViewLink,
                id: createFile.data.id
            }

        } catch (error) {
            console.error('Loi tu upload', error);
        }
    },
    deleteFile: async (fileId) => {
        try {
            const deleteFile = await drive.files.delete({
                fileId: fileId
            })
        } catch (error) {
            console.error(error);
        }
    }
}



const checkLoginAdmin = async (accessToken) => {
    try {
        let decoded = decodeToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
        if (decoded === null) return false

        let user = await db.User.findOne({
            where: {
                id: decoded.id,
                idTypeUser: {
                    [Op.or]: ['1', '2']
                },
            }
        })
        if (!user) return false
        return true

    } catch (e) {
        return false
    }
}


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
                let isLogin = await checkLoginAdmin(data.query.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

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
            // let typeProducts = await db.typeProduct.findAll({
            //     order: db.sequelize.random()
            // });
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
                    let idCloudinary = typeProduct.imageTypeProduct.split("/").pop().split(".")[0];
                    cloudinary.v2.uploader.destroy(idCloudinary)

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
                    let isLogin = await checkLoginAdmin(data.query.accessToken)
                    if (!isLogin) {
                        resolve({
                            errCode: 2,
                            errMessage: 'Chưa có đăng nhập!',
                        })
                        return
                    }

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
                            let idCloudinary = typeProduct.imageTypeProduct.split("/").pop().split(".")[0];
                            cloudinary.v2.uploader.destroy(`type_product/${idCloudinary}`)
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
                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }
                let [trademark, created] = await db.trademark.findOrCreate({
                    where: {
                        nameTrademark: data.nameTrademark.trim().toLowerCase(),
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

const getAllTrademark = (data) => {
    return new Promise(async (resolve, reject) => {
        try {


            const trademarks = await db.trademark.findAll({
                include: [
                    {
                        model: db.typeProduct,
                        attributes: ['id', 'nameTypeProduct'],

                    },
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
                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }
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
                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }
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
                            STTImg: item.STTImg ? +item.STTImg : -1,
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
                        STTImg: -1,
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
            if (!data.files || !data.query.idProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {

                let array = data.files.map((item, index) => {
                    return {
                        id: uuidv4(),
                        imagebase64: item.path,
                        idProduct: data.query.idProduct,
                        STTImage: index + 1,
                    }
                })

                await db.imageProduct.bulkCreate(array, { individualHooks: true })
                resolve({
                    errCode: 0,
                    errMessage: 'ok',

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
                // let whereType = data.idTypeProduct !== 'all' || !data.idTypeProduct ? {
                //     idTypeProduct: data.idTypeProduct
                // } : null

                // let wherename = data?.nameProduct ? {
                //     nameProduct: {
                //         [Op.substring]: data?.nameProduct
                //     }
                // } : null

                let where
                if ((!data.idTypeProduct || data.idTypeProduct === 'all') && !data?.nameProduct) {
                    where = null
                }
                else if (data?.idTypeProduct && data?.idTypeProduct !== 'all' && data?.nameProduct) {
                    let name = data?.nameProduct?.toLowerCase().trim()
                    where = {
                        idTypeProduct: data.idTypeProduct,
                        nameProduct: {
                            [Op.substring]: name
                        }
                    }
                }
                else if (data?.idTypeProduct && data?.idTypeProduct !== 'all' && !data?.nameProduct) {
                    where = {
                        idTypeProduct: data.idTypeProduct,
                    }
                }
                else if ((!data.idTypeProduct || data.idTypeProduct === 'all') && data?.nameProduct) {
                    let name = data?.nameProduct?.toLowerCase().trim()
                    console.log('name: ', name);
                    where = {
                        nameProduct: {
                            [Op.substring]: name
                        }
                    }
                }







                let page = +data.page
                let products = await db.product.findAll({
                    where: where,
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
                        {
                            model: db.promotionProduct
                        }
                    ],
                    order: [
                        ['stt', 'DESC'],
                        [{ model: db.imageProduct, as: 'imageProduct-product' }, 'STTImage', 'asc']
                    ],
                    nest: true,
                    raw: false
                })

                const count = await db.product.count({ where: where });

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
                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }
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
                            STTImg: -1,
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
                                STTImg: item.STTImg ? +item.STTImg : -1,
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
                    console.log('xoa 2');
                    let idCloudinary = imageProduct.imagebase64.split("/").pop().split(".")[0];
                    cloudinary.v2.uploader.destroy(`Image_product/${idCloudinary}`).then(res => {
                        console.log('res: ', res);
                    })

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
                let arrImg = data.imageProducts.map(item => (item.url))
                let listImage = await db.imageProduct.findAll({
                    where: {
                        idProduct: data.idProduct,
                        imagebase64: {
                            [Op.notIn]: arrImg
                        }
                    }
                })
                listImage.forEach(async item => {
                    console.log('xoa 1');
                    let idCloudinary = item.imagebase64.split("/").pop().split(".")[0];
                    console.log('idcloud', idCloudinary);
                    cloudinary.v2.uploader.destroy(idCloudinary)
                })

                await db.imageProduct.destroy({
                    where: {
                        idProduct: data.idProduct,
                        imagebase64: {
                            [Op.notIn]: arrImg
                        }
                    }
                })
                // let arrImageProduct = data.imageProducts.map((item) => {
                //     return {
                //         idProduct: data.idProduct,
                //         imagebase64: item.url,
                //         STTImage: +item.num,
                //         id: uuidv4()
                //     }
                // })
                // await db.imageProduct.bulkCreate(arrImageProduct, { individualHooks: true })
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
                    })

                    if (!check) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Số lượng sản phẩm trong kho không còn đủ!',
                        })
                        return;
                    }
                    else {
                        detailBill.forEach(async (item, index) => {
                            classifyProduct[index].amount = classifyProduct[index].amount - item.amount;
                            await classifyProduct[index].save();
                        })
                    }

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

const createNewKeyWord = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.nameKeyword) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let [keyword, created] = await db.keywordSearchs.findOrCreate({
                    where: {
                        keyword: data.nameKeyword.toLowerCase()
                    },
                    defaults: {
                        amount: 1,
                        id: uuidv4()
                    },
                    raw: false
                })

                if (!created) {
                    keyword.amount = keyword.amount + 1
                    await keyword.save()

                    resolve({
                        errCode: 0,
                    })
                }
                else {
                    resolve({
                        errCode: 0,
                    })
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const createNotify_noimage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.title || !data.content || !data.link || !data.typeNotify) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                if (!data.timePost || +data.timePost === 0) {
                    let users = await db.User.findAll({
                        where: {
                            statusUser: {
                                [Op.ne]: 'false'
                            }
                        }
                    })
                    let date = new Date().getTime()
                    users = users.filter(item => {
                        return item.statusUser === 'true' || (item.statusUser * 1) < date
                    })
                    let arr = users.map(item => {
                        return {
                            id: uuidv4(),
                            title: data.title,
                            content: data.content,
                            redirect_to: data.link,
                            idUser: item.id,
                            typeNotify: data.typeNotify,
                            timeCreate: date,
                        }
                    })
                    await db.notifycations.bulkCreate(arr, { individualHooks: true })
                    handleEmit('new-notify-all', { title: data.title, content: data.content })
                }
                else {
                    await db.timerNotifys.create({
                        id: uuidv4(),
                        title: data.title,
                        content: data.content,
                        redirect_to: data.link,
                        typeNotify: data.typeNotify,
                        status: 'false',
                        timer: +data.timePost
                    })
                }

                // setTimeout(async () => {
                //     let arr = users.map(item => {
                //         return {
                //             id: uuidv4(),
                //             title: data.title,
                //             content: data.content,
                //             redirect_to: data.link,
                //             idUser: item.id,
                //             typeNotify: data.typeNotify,
                //             timeCreate: date,
                //         }
                //     })
                //     await db.notifycations.bulkCreate(arr, { individualHooks: true })
                //     handleEmit('new-notify-all', { title: data.title, content: data.content })

                // }, data.timePost * 1 - date > 0 ? data.timePost * 1 - date : 0);

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

const createNotify_image = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.file || !data.query.title || !data.query.content || !data.query.link || !data.query.typeNotify) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let isLogin = await checkLoginAdmin(data.query.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }
                // console.log(data);

                if (!data.query.timePost || +data.query.timePost === 0) {
                    let users = await db.User.findAll({
                        where: {
                            statusUser: {
                                [Op.ne]: 'false'
                            }
                        }
                    })
                    let date = new Date().getTime()
                    users = users.filter(item => {
                        return item.statusUser === 'true' || (item.statusUser * 1) < date
                    })
                    let arr = users.map(item => {
                        return {
                            id: uuidv4(),
                            title: data.query.title,
                            content: data.query.content,
                            redirect_to: data.query.link,
                            idUser: item.id,
                            typeNotify: data.query.typeNotify,
                            timeCreate: date,
                            urlImage: data.file.path
                        }
                    })
                    await db.notifycations.bulkCreate(arr, { individualHooks: true })
                    handleEmit('new-notify-all', { title: data.query.title, content: data.query.content })
                }
                else {
                    await db.timerNotifys.create({
                        id: uuidv4(),
                        title: data.query.title,
                        content: data.query.content,
                        redirect_to: data.query.link,
                        typeNotify: data.query.typeNotify,
                        status: 'false',
                        urlImage: data.file.path,
                        timer: +data.query.timePost
                    })
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

const CreateToken = (user) => {
    const { id, idGoogle, firstName, idTypeUser } = user;
    const accessToken = jwt.sign({ id, idGoogle, firstName, idTypeUser }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '60m'
    });
    const refreshToken = jwt.sign({ id, idGoogle, firstName, idTypeUser }, process.env.REFESH_TOKEN_SECRET, {
        expiresIn: '7d'
    });

    return { accessToken, refreshToken };
}

const CheckLoginAdminAccessToken = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.type) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let decode = decodeToken(data.accessToken, data.type === 'accessToken' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFESH_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let type = data.typeUser === 'root' ? ['1'] : ['1', '2']

                    let user = await db.User.findOne({
                        where: {
                            id: decode.id,
                            idTypeUser: {
                                [Op.or]: type
                            }
                        }
                    })
                    if (user) {
                        let tokens
                        if (data?.type === 'refreshToken') {
                            tokens = CreateToken(user)
                        }

                        resolve({
                            errCode: 0,
                            data: tokens
                        })
                    }
                    else {
                        resolve({
                            errCode: 3,
                            errMessage: 'Not found user!',
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


const createNewUserAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.username || !data.pass) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                })
            }
            else {
                let decode = decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let passHash = hashPassword(data.pass)
                    let [user, create] = await db.User.findOrCreate({
                        where: {
                            email: data.username,
                        },
                        defaults: {
                            id: uuidv4(),
                            pass: passHash,
                            firstName: 'Admin',
                            typeAccount: 'web',
                            idTypeUser: '2',
                            statusUser: 'true',
                            avatarUpdate: `${process.env.LINK_FONTEND}/images/user/avatar_admin.png`
                        }
                    })
                    if (create) {
                        resolve({
                            errCode: 0,
                        })
                        return
                    }
                    else {
                        resolve({
                            errCode: 3,
                            errMessage: 'Tài khoản này đã tồn tại!',
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

const getListUserAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || data.nameUser === undefined) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data: data
                })
            }
            else {
                let decode = decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {

                    if (data.nameUser === '') {
                        let listUsers = await db.User.findAll({
                            attributes: ['id', 'firstName', 'lastName', 'sdt', 'gender', 'avatarGoogle', 'avatarFacebook', 'avatarGithub', 'avatarUpdate', 'typeAccount', 'statusUser'],
                            where: {
                                idTypeUser: {
                                    [Op.notIn]: ['1', '2']
                                }
                            },
                            limit: 50
                        })

                        resolve({
                            errCode: 0,
                            data: listUsers
                        })
                    }
                    else {
                        let listUsers = await db.User.findAll({
                            attributes: ['id', 'firstName', 'lastName', 'sdt', 'gender', 'avatarGoogle', 'avatarFacebook', 'avatarGithub', 'avatarUpdate', 'typeAccount', 'statusUser'],
                            where: {
                                idTypeUser: {
                                    [Op.notIn]: ['1', '2']
                                },
                            }
                        })

                        const searcher = new FuzzySearch(listUsers, ['firstName'], {
                            caseSensitive: false,
                            sort: true
                        });
                        // let key = args.keyword.normalize('NFD')
                        //     .replace(/[\u0300-\u036f]/g, '')
                        //     .replace(/đ/g, 'd').replace(/Đ/g, 'D');

                        const result = searcher.search(data.nameUser);

                        resolve({
                            errCode: 0,
                            data: result
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

const lockUserAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idUser || !data.status) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data: data
                })
            }
            else {
                let decode = decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let user = await db.User.findOne({
                        where: {
                            id: data.idUser
                        },
                        raw: false
                    })

                    if (!user) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Không tìm thấy tài khoản này!',
                        })
                        return
                    }
                    else {

                        user.statusUser = data.status
                        await user.save()

                        resolve({
                            errCode: 0,
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

const createEventPromotion = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.nameEvent || !data.timeStart || !data.timeEnd || !data.arrProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data: data
                })
            }
            else {
                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                let arrProduct = JSON.parse(data?.arrProduct);
                if (arrProduct?.length < 5) {
                    resolve({
                        errCode: 3,
                        errMessage: 'Vui lòng chọn ít nhất 5 sản phẩm cho sự kiện!',
                    })
                    return
                }

                let idEventPromotion = uuidv4()

                await db.eventPromotions.create({
                    id: idEventPromotion,
                    nameEvent: data.nameEvent,
                    timeStart: +data.timeStart,
                    timeEnd: +data.timeEnd,
                    // cover: data.file.path,
                    // idCover: data.file.filename,
                    firstContent: data.firstContent ?? '',
                    lastContent: data.lastContent ?? ''
                })

                let arrProductEvent = arrProduct?.map(item => ({
                    id: uuidv4(),
                    idEventPromotion,
                    idProduct: item.id
                }))

                await db.productEvents.bulkCreate(arrProductEvent, { individualHooks: true })

                arrProduct?.forEach(async item => {
                    await db.promotionProduct.update({ timePromotion: +data.timeEnd, numberPercent: +item.numberPercent }, {
                        where: {
                            idProduct: item.id
                        }
                    });
                })

                const date = new Date(+data.timeStart);
                const date2 = new Date().getTime();

                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                await db.notifycations.create({
                    id: uuidv4(),
                    title: data.nameEvent,
                    content: `Sự kiến mới sắp ra mắt từ ${formattedDate}`,
                    timeCreate: date2,
                    typeNotify: 'promotion',
                    idUser: user.id,
                    redirect_to: `/promotion/${idEventPromotion}`
                })

                handleEmit('new-notify-all', { title: data.nameEvent, content: `Sự kiến mới sắp ra mắt từ ${formattedDate}` })

                resolve({
                    errCode: 0,
                    idEventPromotion
                })

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const upLoadImageCoverPromotion = ({ file, query }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!file || !query.idEventPromotion) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data: data
                })
            }
            else {

                await db.eventPromotions.update({ cover: file.path, idCover: file.filename }, {
                    where: {
                        id: query.idEventPromotion
                    }
                });

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

const getListEventPromotion = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let date = new Date().getTime()
            let listEventPromotion = await db.eventPromotions.findAll({
                where: {
                    timeEnd: {
                        [Op.gt]: date
                    }
                },
                order: [['stt', 'DESC']],
                attributes: {
                    exclude: ['firstContent', 'lastContent']
                }
            })


            resolve({
                errCode: 0,
                data: listEventPromotion
            })


        }
        catch (e) {
            reject(e);
        }
    })
}

const editEventPromotion = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.nameEvent || !data.timeStart || !data.timeEnd || !data.idEventPromotion) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data: data
                })
            }
            else {
                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                await db.eventPromotions.update({
                    nameEvent: data.nameEvent,
                    timeStart: +data.timeStart,
                    timeEnd: +data.timeEnd,
                    firstContent: data.firstContent ?? '',
                    lastContent: data.lastContent ?? ''
                }, {
                    where: {
                        id: data.idEventPromotion
                    }
                });


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

const getListBillByTypeAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.type || !data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {

                if (+data.type === 1 || +data.type === 3 || +data.type === 4) {
                    if (+data.type === 3) {
                        let listBill = await db.bill.findAll({
                            where: {
                                idStatusBill: {
                                    [Op.between]: [2.99, 3]
                                }
                            }
                        })
                        resolve({
                            errCode: 0,
                            data: listBill
                        })

                        return
                    }
                    let listBill = await db.bill.findAll({
                        where: {
                            idStatusBill: +data.type
                        }
                    })
                    resolve({
                        errCode: 0,
                        data: listBill
                    })
                }
                else if (+data.type === 2) {
                    let listBill = await db.bill.findAll({
                        where: {
                            idStatusBill: {
                                [Op.between]: [2, 2.98]
                            }
                        }
                    })
                    resolve({
                        errCode: 0,
                        data: listBill
                    })
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const updateStatusBillAdminWeb = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idBill || !data.status) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {
                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                let bill = await db.bill.findOne({
                    where: {
                        id: data.idBill
                    },
                    raw: false
                })

                if (!bill) {
                    resolve({
                        errCode: 3,
                        errMessage: 'Không tìm thấy hóa đơn!',
                    })
                    return
                }

                let date = new Date().getTime()
                //xac nhan
                if (data.status === 'confirm') {
                    if (bill.idStatusBill === 1) {
                        bill.idStatusBill = 2
                        await bill.save()

                        await db.statusBills.create({
                            id: uuidv4(),
                            idBill: bill.id,
                            nameStatus: 'Đang giao',
                            idStatusBill: bill.idStatusBill,
                            timeStatus: new Date().getTime()
                        })

                        let user = await db.User.findOne({
                            include: [
                                {
                                    model: db.bill,
                                    where: {
                                        id: data.idBill
                                    }
                                }
                            ],
                            nest: true,
                            raw: false
                        })
                        await db.notifycations.create({
                            id: uuidv4(),
                            title: 'Đơn hàng đã xác nhận',
                            content: `Đơn hàng ${data.idBill} đã được xác nhận`,
                            timeCreate: date,
                            typeNotify: 'order',
                            idUser: user.id,
                            redirect_to: '/user/purchase?type=2'
                        })

                        handleEmit(`new-notify-${user.id}`, {
                            title: 'Đơn hàng của bạn đã được xác nhận',
                            content: 'Vào website để xem chi tiết'
                        })

                        //send email
                        if (user?.typeAccount === 'web') {
                            let content = contentEmailConfirmBill()
                            sendEmail(user.email, 'Đơn hàng của bạn đã được xác nhận', content)
                        }
                    }
                    resolve({
                        errCode: 0,
                    })
                    return
                }

                //thay doi trang thai
                if (data.status === 'change') {
                    if (!data.nameStatus) {
                        resolve({
                            errCode: 4,
                            errMessage: 'Vui lòng cung cấp mô tả cho cập nhật này!',
                        })
                        return
                    }


                    let user = await db.User.findOne({
                        include: [
                            {
                                model: db.bill,
                                where: {
                                    id: data.idBill
                                }
                            }
                        ],
                        nest: true,
                        raw: false
                    })

                    bill.idStatusBill = (bill.idStatusBill + 0.01).toFixed(2)
                    bill.timeBill = date
                    await bill.save()

                    await db.statusBills.create({
                        id: uuidv4(),
                        idBill: bill.id,
                        nameStatus: data.nameStatus,
                        idStatusBill: bill.idStatusBill,
                        timeStatus: new Date().getTime()
                    })


                    // await notifycations.destroy({
                    //     where: {
                    //         title: `Cập nhật trạng thái đơn hàng ${data.idBill}`
                    //     }
                    // });

                    await db.notifycations.create({
                        id: uuidv4(),
                        title: `Cập nhật trạng thái đơn hàng ${data.idBill}`,
                        content: data.nameStatus,
                        timeCreate: date,
                        typeNotify: 'order',
                        idUser: user.id,
                        redirect_to: '/user/purchase?type=2'
                    })


                    handleEmit(`new-notify-${user.id}`, {
                        title: data.nameStatus,
                        content: 'Vào website để xem chi tiết'
                    })

                    //send email
                    if (user?.typeAccount === 'web') {
                        let content = contentUpdateStatusBill()
                        sendEmail(user.email, 'Cập nhật trạng thái đơn hàng', content)
                    }

                    resolve({
                        errCode: 0,
                    })
                    return

                }

                //hoan thanh
                if (data.status === 'success') {
                    let user = await db.User.findOne({
                        include: [
                            {
                                model: db.bill,
                                where: {
                                    id: data.idBill
                                }
                            }
                        ],
                        nest: true,
                        raw: false
                    })


                    bill.idStatusBill = 2.99
                    bill.timeBill = date
                    await bill.save()

                    await db.statusBills.create({
                        id: uuidv4(),
                        idBill: bill.id,
                        nameStatus: 'Đã giao',
                        idStatusBill: 2.99,
                        timeStatus: new Date().getTime()
                    })

                    await db.notifycations.create({
                        id: uuidv4(),
                        title: `Đơn hàng ${data.idBill} đã hoàn thành`,
                        content: 'Đơn hàng đã đến tay người mua',
                        timeCreate: date,
                        typeNotify: 'order',
                        idUser: user.id,
                        redirect_to: '/user/purchase?type=3'
                    })

                    handleEmit(`new-notify-${user.id}`, {
                        title: 'Giao thành công',
                        content: `Đơn hàng ${data.idBill} đã được hoàn thành`
                    })

                    //send email
                    if (user?.typeAccount === 'web') {
                        let content = contentSuccessBill()
                        sendEmail(user.email, 'Giao hàng thành công', content)
                    }

                    resolve({
                        errCode: 0,
                    })
                    return
                }


                //huy don
                if (data.status === 'cancel') {
                    if (!data.noteCancel) {
                        resolve({
                            errCode: 4,
                            errMessage: 'Vui lòng cung cấp mô tả cho cập nhật này!',
                        })
                        return
                    }
                    let user = await db.User.findOne({
                        include: [
                            {
                                model: db.bill,
                                where: {
                                    id: data.idBill
                                }
                            }
                        ],
                        nest: true,
                        raw: false
                    })

                    bill.idStatusBill = 4
                    bill.timeBill = date
                    bill.noteCancel = data.noteCancel
                    await bill.save()

                    await db.statusBills.create({
                        id: uuidv4(),
                        idBill: bill.id,
                        nameStatus: 'Đã hủy',
                        idStatusBill: 4,
                        timeStatus: new Date().getTime()
                    })

                    //increase amount product
                    let detailBills = await db.detailBill.findAll({
                        where: {
                            idBill: bill.id
                        }
                    })

                    detailBills.forEach(async item => {
                        let classify = await db.classifyProduct.findOne({
                            where: {
                                id: item.idClassifyProduct
                            },
                            raw: false
                        })
                        if (classify) {
                            classify.amount = classify.amount + item.amount
                            await classify.save()
                        }
                    })


                    //notify
                    await db.notifycations.create({
                        id: uuidv4(),
                        title: `Đơn hàng ${data.idBill} đã bị hủy`,
                        content: 'Giao hàng thất bại',
                        timeCreate: date,
                        typeNotify: 'order',
                        idUser: user.id,
                        redirect_to: '/user/purchase?type=4'
                    })

                    handleEmit(`new-notify-${user.id}`, {
                        title: 'Giao hàng thất bại',
                        content: `Đơn hàng ${data.idBill} đã bị hủy`
                    })

                    //send email
                    if (user?.typeAccount === 'web') {
                        let content = contentFailBill()
                        sendEmail(user.email, `Đơn hàng ${data.idBill} đã bị hủy`, content)
                    }

                    resolve({
                        errCode: 0,
                    })
                    return
                }






            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getListVideoAdminByPage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {

                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                let where = null
                if (data.idSearch) {
                    where = {
                        id: {
                            [Op.substring]: data.idSearch
                        }
                    }
                }

                else if (data.titleSearch) {
                    where = {
                        content: {
                            [Op.substring]: data.titleSearch
                        }
                    }
                }



                let listVideo = await db.shortVideos.findAll({
                    where: where,
                    limit: 10,
                    offset: (+data.page - 1) * 10,
                    include: [
                        {
                            model: db.User
                        }
                    ],
                    raw: false,
                    nest: true
                })

                let count = await db.shortVideos.count({ where: where, })

                resolve({
                    errCode: 0,
                    data: listVideo,
                    count
                })


            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const deleteShortVideoAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idShortVideo || !data.note) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {
                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }


                // let user1 = await db.User.findOne({
                //     include: [
                //         {
                //             model: db.shortVideos,
                //             where: {
                //                 id: data.idShortVideo
                //             }
                //         }
                //     ],
                //     nest: true,
                //     raw: false
                // })
                // console.log(!user1);
                // resolve({
                //     errCode: 0,
                //     errMessage: 'Not found',
                // })
                // return




                let shortVideo = await db.shortVideos.findOne({
                    where: {
                        id: data.idShortVideo
                    },
                    raw: false
                })

                if (!shortVideo) {
                    resolve({
                        errCode: 3,
                        errMessage: 'Not found',
                    })
                    return
                }

                cloudinary.v2.uploader.destroy(`${shortVideo.idCloudinary}`)
                GG_Drive.deleteFile(shortVideo.idDriveVideo)





                db.hashTagVideos.destroy({
                    where: {
                        idShortVideo: data.idShortVideo
                    }
                })

                db.commentShortVideos.destroy({
                    where: {
                        idShortVideo: data.idShortVideo
                    }
                })

                db.likeShortVideos.destroy({
                    where: {
                        idShortVideo: data.idShortVideo
                    }
                })

                db.collectionShortVideos.destroy({
                    where: {
                        idShortVideo: data.idShortVideo
                    }
                })




                //thong bao
                let user = await db.User.findOne({
                    include: [
                        {
                            model: db.shortVideos,
                            where: {
                                id: data.idShortVideo
                            }
                        }
                    ],
                    nest: true,
                    raw: false
                })

                console.log(user);
                let date = new Date().getTime()

                if (!user) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Không tìm thấy tác giả này',
                    })
                    return
                }

                await db.notifycations.create({
                    id: uuidv4(),
                    title: `Video của bạn đã bị xóa`,
                    content: data.note,
                    timeCreate: date,
                    typeNotify: 'short_video',
                    idUser: user.id,
                    redirect_to: '/short-video/user'
                })

                handleEmit(`new-notify-${user.id}`, {
                    title: 'Video của bạn đã bị xóa',
                    content: `${data.note}`
                })

                //send email
                if (user?.typeAccount === 'web') {
                    let content = contentSuccessBill()
                    sendEmail(user.email, 'Video của bạn đã bị xóa', content)
                }


                shortVideo.destroy()
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

const getListReportAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {

                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                let listReportVideo = await db.reportVideos.findAll({
                    where: {
                        status: 'true'
                    },
                    include: [
                        {
                            model: db.shortVideos,
                            attributes: ['id', 'urlImage'],
                            where: {
                                id: {
                                    [Op.ne]: 'false'
                                }
                            }
                        },
                        {
                            model: db.User,
                            attributes: ['id', 'firstName']
                        }
                    ],
                    limit: 10,
                    offset: (+data.page - 1) * 10,
                    raw: false,
                    nest: true
                })


                let count = await db.reportVideos.count({
                    where: {
                        status: 'true'
                    }
                })

                resolve({
                    errCode: 0,
                    data: listReportVideo,
                    count
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const skipReportVideoAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idReportVideo) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {

                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                await db.reportVideos.update({ status: "false" }, {
                    where: {
                        id: data.idReportVideo
                    }
                });

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

const getListBlogAdminByPage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {



                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }


                let where = null
                if (data.idSearch) {
                    where = {
                        id: {
                            [Op.substring]: data.idSearch
                        }
                    }
                }
                else if (data.contentSearch) {
                    where = {
                        contentHTML: {
                            [Op.substring]: data.contentSearch
                        }
                    }
                }




                let listBlog = await db.blogs.findAll({
                    where: where,
                    limit: 10,
                    offset: (+data.page - 1) * 10,
                    include: [
                        {
                            model: db.User, attributes: ['id', 'firstName']
                        }
                    ],
                    raw: false,
                    nest: true
                })

                let count = await db.blogs.count({ where: where })



                resolve({
                    errCode: 0,
                    data: listBlog,
                    count
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const deleteBlogAdminById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idBlog || !data.note) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {
                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                //xoa blog
                let blog = await db.blogs.findOne({
                    where: {
                        id: data.idBlog
                    },
                    raw: false
                })

                if (!blog) {
                    resolve({
                        errCode: 3,
                        errMessage: 'Not found!',
                    })
                    return
                }

                let videoBlog = await db.videoBlogs.findOne({
                    where: {
                        idBlog: data.idBlog
                    },
                    raw: false
                })
                if (videoBlog) {
                    GG_Drive.deleteFile(videoBlog.idDrive)
                    videoBlog.destroy()
                }
                let imageBlogs = await db.imageBlogs.findAll({
                    where: {
                        idBlog: data.idBlog
                    }
                })
                if (imageBlogs && imageBlogs.length > 0) {
                    imageBlogs.map(item => {
                        cloudinary.v2.uploader.destroy(item.idCloudinary)
                    })
                }
                db.imageBlogs.destroy({
                    where: {
                        idBlog: data.idBlog
                    }
                })

                db.likeBlog.destroy({
                    where: {
                        idBlog: data.idBlog
                    }
                })

                db.blogShares.destroy({
                    where: {
                        idBlog: data.idBlog
                    }
                })

                db.commentBlog.destroy({
                    where: {
                        idBlog: data.idBlog
                    }
                })




                //thong bao
                let user = await db.User.findOne({
                    include: [
                        {
                            model: db.blogs,
                            where: {
                                id: data.idBlog
                            }
                        }
                    ],
                    nest: true,
                    raw: false
                })

                // console.log(user);
                let date = new Date().getTime()

                if (!user) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Không tìm thấy tác giả này',
                    })
                    return
                }

                await db.notifycations.create({
                    id: uuidv4(),
                    title: `Bài viết của bạn đã bị xóa`,
                    content: data.note,
                    timeCreate: date,
                    typeNotify: 'blog',
                    idUser: user.id,
                    redirect_to: '/blogs/blog-user'
                })

                handleEmit(`new-notify-${user.id}`, {
                    title: 'Bài viết của bạn đã bị xóa',
                    content: `${data.note}`
                })

                //send email
                if (user?.typeAccount === 'web') {
                    let content = contentSuccessBill()
                    sendEmail(user.email, 'Bài viết của bạn đã bị xóa', content)
                }
                blog.destroy()
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

const getListReportBlogAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {

                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                let listReportBlog = await db.reportBlogs.findAll({
                    where: {
                        status: 'true'
                    },
                    include: [
                        {
                            model: db.blogs,
                            attributes: ['id'],
                            where: {
                                id: {
                                    [Op.ne]: 'false'
                                }
                            }
                        },
                        {
                            model: db.User,
                            attributes: ['id', 'firstName']
                        }
                    ],
                    limit: 10,
                    offset: (+data.page - 1) * 10,
                    raw: false,
                    nest: true
                })


                let count = await db.reportBlogs.count({
                    where: {
                        status: 'true'
                    }
                })

                resolve({
                    errCode: 0,
                    data: listReportBlog,
                    count
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const skipReportBlogAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idReportBlog) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {

                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                await db.reportBlogs.update({ status: "false" }, {
                    where: {
                        id: data.idReportBlog
                    }
                });

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

const getStatisticalAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {

                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                //countproduct
                let countProduct = await db.product.count()

                //sum price bill
                let revenue = await db.bill.sum('totals', {
                    where: {
                        idStatusBill: 3
                    }
                })

                //count bill
                let countBill = await db.bill.count({
                    where: {
                        idStatusBill: 3
                    }
                })

                //avg evaluate
                let countEvaluate = await db.evaluateProduct.count()
                let sumEvaluate = await db.evaluateProduct.sum('starNumber')

                //count user
                let countUser = await db.User.count({
                    where: {
                        idTypeUser: "3"
                    }
                })

                //count Video
                let countVideo = await db.shortVideos.count()

                //count blog
                let countBlog = await db.blogs.count()

                resolve({
                    errCode: 0,
                    data: {
                        countProduct,
                        revenue,
                        countBill,
                        avgStart: (sumEvaluate / countEvaluate).toFixed(1),
                        countUser,
                        countVideo,
                        countBlog
                    }
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const StatisticalEvaluateAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {

                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                let include = null
                if (data.idProduct) {
                    console.log('vao1', data.idProduct);
                    let product = await db.product.findOne({
                        where: {
                            id: data.idProduct
                        }
                    })
                    if (product)
                        include = [
                            {
                                model: db.product,
                                where: {
                                    id: data.idProduct.trim()
                                }
                            }
                        ]
                }

                if (data.idTypeProduct) {
                    console.log('vao2');
                    include = [
                        {
                            model: db.product,
                            where: {
                                idTypeProduct: data.idTypeProduct
                            }
                        }
                    ]
                }

                if (data.idTrademark) {
                    console.log('vao3');
                    include = [
                        {
                            model: db.product,
                            where: {
                                idTrademark: data.idTrademark
                            }
                        }
                    ]
                }


                let count = await db.evaluateProduct.count({
                    include: include
                })

                let count1 = await db.evaluateProduct.count({
                    where: {
                        starNumber: 1
                    },
                    include: include
                })

                let count2 = await db.evaluateProduct.count({
                    where: {
                        starNumber: 2
                    },
                    include: include
                })

                let count3 = await db.evaluateProduct.count({
                    where: {
                        starNumber: 3
                    },
                    include: include
                })

                let count4 = await db.evaluateProduct.count({
                    where: {
                        starNumber: 4
                    },
                    include: include
                })

                let count5 = await db.evaluateProduct.count({
                    where: {
                        starNumber: 5
                    },
                    include: include
                })

                // console.log('count', count);
                // console.log('count1', count1);
                // console.log('count2', count2);
                // console.log('count3', count3);
                // console.log('count4', count4);
                // console.log('count5', count5);

                if (count === 0) {
                    resolve({
                        errCode: 3,
                        errMessage: 'Not found product'
                    })
                    return
                }


                resolve({
                    errCode: 0,
                    data: {
                        count1: count1 / count * 100,
                        count2: count2 / count * 100,
                        count3: count3 / count * 100,
                        count4: count4 / count * 100,
                        count5: count5 / count * 100,
                    }
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getStatisticalSale = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {

                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                let whereTypeProduct = null
                if (data.idTypeProduct) {
                    whereTypeProduct = {
                        idTypeProduct: data.idTypeProduct
                    }
                }

                let detailbills = await db.detailBill.findAll({
                    include: [
                        {
                            model: db.bill,
                            where: {
                                idStatusBill: 3
                            }
                        },
                        {
                            model: db.product,
                            where: whereTypeProduct
                        }
                    ],
                    raw: false,
                    nest: true
                })

                let arr = []
                for (let i = 0; i < 12; i++) {
                    let rand = 0
                    arr.push(rand)
                }

                detailbills?.forEach(item => {
                    let month = new Date(item.updatedAt).getMonth()
                    let year = new Date(item.updatedAt).getFullYear()

                    if (year === +data.year) {
                        arr[month] = arr[month] + (item.amount + 5)
                    }
                })

                // console.log('arr', arr);



                resolve({
                    errCode: 0,
                    data: {
                        arr
                    }
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getListKeyWordAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {

                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                let where = null
                if (data.nameKeyword) {
                    where = {
                        keyword: {
                            [Op.substring]: data.nameKeyword
                        }
                    }
                }

                let listKeyWord = await db.keywordSearchs.findAll({
                    limit: 20,
                    where: where
                })


                resolve({
                    errCode: 0,
                    data: listKeyWord
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const editKeyWordSearchAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idKeyWord || !data.nameKeyword) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {

                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                await db.keywordSearchs.update({ keyword: data.nameKeyword }, {
                    where: {
                        id: data.idKeyWord
                    }
                })


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

const deleteKeyWordAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idKeyWord) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {

                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                await db.keywordSearchs.destroy({
                    where: {
                        id: data.idKeyWord
                    }
                })


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

const getListUserTypeAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {

                let decoded = decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (!decoded) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chua co dang nhap!',
                    })
                    return
                }

                let user = await db.User.findOne({
                    where: {
                        id: decoded.id,
                        idTypeUser: '1'
                    }
                })

                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: 'khong co quyen truy cap!',
                    })
                    return
                }

                let where = {
                    idTypeUser: '2'
                }
                if (data.nameUser) {
                    where = {
                        firstName: {
                            [Op.substring]: data.nameUser
                        },
                        idTypeUser: '2'
                    }
                }

                let listUser = await db.User.findAll({
                    where: where,
                    limit: 30
                })


                resolve({
                    errCode: 0,
                    data: listUser
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const deleteEventPromotionAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idEvent) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {

                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                let event = await db.eventPromotions.findOne({
                    where: {
                        id: data.idEvent
                    },
                    raw: false
                })
                if (event) {
                    await cloudinary.v2.uploader.destroy(`${event.idCover}`)
                    await event.destroy()
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

const getCountBillOfMonth = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.year) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data
                })
            }
            else {

                let isLogin = await checkLoginAdmin(data.accessToken)
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    })
                    return
                }

                let listBill = await db.bill.findAll({
                    where: {
                        idStatusBill: 3
                    }
                })

                let arr = []
                for (let i = 0; i < 12; i++) {
                    arr.push(0)
                }

                console.log(listBill.length);


                listBill.forEach(item => {
                    let month = new Date(item.updatedAt).getMonth()
                    let year = new Date(item.updatedAt).getFullYear()

                    if (year === +data.year) {
                        arr[month] = arr[month] + 1
                    }

                })






                resolve({
                    errCode: 0,
                    data: arr
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}


//winform
const getListBillNoConfirm = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let listBills = await db.bill.findAll({
                where: {
                    idStatusBill: 1
                }
            })

            resolve(listBills)
        }
        catch (e) {
            reject(e);
        }
    })
}

const getDetailBillAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBill) {
                resolve([])
            }
            else {
                let { count, rows } = await db.detailBill.findAndCountAll({
                    where: {
                        idBill: data.idBill
                    },
                    include: [
                        {
                            model: db.product,
                            // include: [
                            //     {
                            //         model: db.classifyProduct, as: 'classifyProduct-product'
                            //     }
                            // ]
                        },
                        {
                            model: db.classifyProduct
                        }
                    ],
                    nest: true,
                    raw: false
                })

                let data2 = []

                for (let i = 0; i < count; i++) {
                    let donGia
                    if (rows[i].classifyProduct.nameClassifyProduct !== 'default')
                        donGia = rows[i].classifyProduct.priceClassify
                    else
                        donGia = rows[i].product.priceProduct * 1



                    let obj = {
                        maSP: rows[i].product.id,
                        tenSP: rows[i].product.nameProduct,
                        donGia,
                        soLuong: rows[i].amount,
                        phanLoai: rows[i].classifyProduct.nameClassifyProduct,
                    }
                    data2.push(obj)
                }

                resolve(data2)

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getListImageProductAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idProduct) {
                resolve([])
            }
            else {
                let images = await db.imageProduct.findAll({
                    where: {
                        idProduct: data.idProduct
                    }
                })
                // console.log('images', images);

                resolve(images)
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getInfoProductAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idProduct) {
                resolve([])
            }
            else {
                let product = await db.product.findOne({
                    where: {
                        id: data.idProduct
                    },
                    include: [
                        { model: db.typeProduct },
                        { model: db.trademark }
                    ],
                    raw: false,
                    nest: true
                })

                resolve([{
                    tenSP: product.nameProduct,
                    daBan: product.sold,
                    tinhTrang: product.isSell === 'true' ? 'Còn bán' : 'Ngừng bán',
                    danhMuc: product.typeProduct.nameTypeProduct,
                    thuongHieu: product.trademark.nameTrademark
                }])
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getClassifyProductAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idProduct) {
                resolve([])
            }
            else {

                let listClassifys = await db.classifyProduct.findAll({
                    where: {
                        idProduct: data.idProduct
                    }
                })

                resolve(listClassifys)

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getAddressBillAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBill) {
                resolve([])
            }
            else {

                let address = await db.addressUser.findOne({
                    include: [
                        {
                            model: db.bill,
                            where: {
                                id: data.idBill
                            }
                        }
                    ],
                    raw: false,
                    nest: true
                })
                // console.log(address);

                resolve([{
                    tenNguoiMua: address.fullname,
                    soDienThoai: address.sdt,
                    ghiChuDiaChi: address.addressText,
                    tinhThanh: provinces[address.country * 1].name,
                    quanHuyen: provinces[address.country * 1].districts[address.district * 1].name
                }])

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const contentEmailConfirmBill = () => {
    return `
        <h2>Vào website để xem chi tiết</h2>
    `
}

const confirmBillAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBill) {
                resolve(false)
            }
            else {
                let bill = await db.bill.findOne({
                    where: {
                        id: data.idBill,
                        idStatusBill: 1
                    },
                    raw: false
                })

                if (!bill) {
                    resolve(false)
                    return
                }

                bill.idStatusBill = 2
                await bill.save()

                await db.statusBills.create({
                    id: uuidv4(),
                    idBill: bill.id,
                    nameStatus: 'Đang giao',
                    idStatusBill: bill.idStatusBill,
                    timeStatus: new Date().getTime()
                })

                let user = await db.User.findOne({
                    include: [
                        {
                            model: db.bill,
                            where: {
                                id: data.idBill
                            }
                        }
                    ],
                    nest: true,
                    raw: false
                })
                let date = new Date().getTime()
                await db.notifycations.create({
                    id: uuidv4(),
                    title: 'Đơn hàng đã xác nhận',
                    content: `Đơn hàng ${data.idBill} đã được xác nhận`,
                    timeCreate: date,
                    typeNotify: 'order',
                    idUser: user.id,
                    redirect_to: '/user/purchase?type=2'
                })

                handleEmit(`new-notify-${user.id}`, {
                    title: 'Đơn hàng của bạn đã được xác nhận',
                    content: 'Vào website để xem chi tiết'
                })

                //send email
                if (user?.typeAccount === 'web') {
                    let content = contentEmailConfirmBill()
                    sendEmail(user.email, 'Đơn hàng của bạn đã được xác nhận', content)
                }


                resolve(true)
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let contentUpdateStatusBill = () => {
    return `
    <h3>Vào website để xem chi tiết</h3>
    `
}

let contentSuccessBill = () => {
    return `
    <h3>Vào website để xem chi</h3>
    `
}

let contentFailBill = () => {
    return `
    <h3>Vào website để xem chi tiết</h3>
    `
}

const updateStatusBillAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBill || !data.nameStatus) {
                resolve(false)
            }
            else {
                let bill = await db.bill.findOne({
                    where: {
                        id: data.idBill,
                        idStatusBill: {
                            [Op.between]: [2, 2.99]
                        }
                    },
                    raw: false
                })

                if (!bill) {
                    resolve(false)
                    return
                }

                let date = new Date().getTime()
                let user = await db.User.findOne({
                    include: [
                        {
                            model: db.bill,
                            where: {
                                id: data.idBill
                            }
                        }
                    ],
                    nest: true,
                    raw: false
                })

                if (data.nameStatus === 'success') {
                    bill.idStatusBill = 2.99
                    bill.timeBill = date
                    await bill.save()

                    await db.statusBills.create({
                        id: uuidv4(),
                        idBill: bill.id,
                        nameStatus: 'Đã giao',
                        idStatusBill: 2.99,
                        timeStatus: new Date().getTime()
                    })

                    await db.notifycations.create({
                        id: uuidv4(),
                        title: `Đơn hàng ${data.idBill} đã hoàn thành`,
                        content: 'Đơn hàng đã đến tay người mua',
                        timeCreate: date,
                        typeNotify: 'order',
                        idUser: user.id,
                        redirect_to: '/user/purchase?type=3'
                    })

                    handleEmit(`new-notify-${user.id}`, {
                        title: 'Giao thành công',
                        content: `Đơn hàng ${data.idBill} đã được hoàn thành`
                    })

                    //send email
                    if (user?.typeAccount === 'web') {
                        let content = contentSuccessBill()
                        sendEmail(user.email, 'Giao hàng thành công', content)
                    }
                }
                else if (data.nameStatus === 'fail') {
                    bill.idStatusBill = 4
                    bill.timeBill = date
                    bill.noteCancel = 'Giao hàng thất bại'
                    await bill.save()

                    await db.statusBills.create({
                        id: uuidv4(),
                        idBill: bill.id,
                        nameStatus: 'Đã hủy',
                        idStatusBill: 4,
                        timeStatus: new Date().getTime()
                    })

                    //increase amount product
                    let detailBills = await db.detailBill.findAll({
                        where: {
                            idBill: bill.id
                        }
                    })

                    detailBills.forEach(async item => {
                        let classify = await db.classifyProduct.findOne({
                            where: {
                                id: item.idClassifyProduct
                            },
                            raw: false
                        })
                        if (classify) {
                            classify.amount = classify.amount + item.amount
                            await classify.save()
                        }
                    })


                    //notify
                    await db.notifycations.create({
                        id: uuidv4(),
                        title: `Đơn hàng ${data.idBill} đã bị hủy`,
                        content: 'Giao hàng thất bại',
                        timeCreate: date,
                        typeNotify: 'order',
                        idUser: user.id,
                        redirect_to: '/user/purchase?type=4'
                    })

                    handleEmit(`new-notify-${user.id}`, {
                        title: 'Giao hàng thất bại',
                        content: `Đơn hàng ${data.idBill} đã bị hủy`
                    })

                    //send email
                    if (user?.typeAccount === 'web') {
                        let content = contentFailBill()
                        sendEmail(user.email, `Đơn hàng ${data.idBill} đã bị hủy`, content)
                    }

                }
                else {
                    bill.idStatusBill = (bill.idStatusBill + 0.01).toFixed(2)
                    bill.timeBill = date
                    await bill.save()

                    await db.statusBills.create({
                        id: uuidv4(),
                        idBill: bill.id,
                        nameStatus: data.nameStatus,
                        idStatusBill: bill.idStatusBill,
                        timeStatus: new Date().getTime()
                    })



                    await db.notifycations.create({
                        id: uuidv4(),
                        title: `Cập nhật trạng thái đơn hàng ${data.idBill}`,
                        content: data.nameStatus,
                        timeCreate: date,
                        typeNotify: 'order',
                        idUser: user.id,
                        redirect_to: '/user/purchase?type=2'
                    })


                    handleEmit(`new-notify-${user.id}`, {
                        title: data.nameStatus,
                        content: 'Vào website để xem chi tiết'
                    })

                    //send email
                    if (user?.typeAccount === 'web') {
                        let content = contentUpdateStatusBill()
                        sendEmail(user.email, 'Đơn hàng của bạn đã được xác nhận', content)
                    }
                }

                resolve(true)
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getListStatusBillAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBill) {
                resolve([])
            }
            else {
                let statusBills = await db.statusBills.findAll({
                    where: {
                        idBill: data.idBill
                    },
                    order: [['stt', 'ASC']]
                })
                resolve(statusBills)
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

//end winform

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
    cancelBillById,
    createNewKeyWord,
    createNotify_noimage,
    createNotify_image,
    CheckLoginAdminAccessToken,
    createNewUserAdmin,
    getListUserAdmin,
    lockUserAdmin,
    createEventPromotion,
    upLoadImageCoverPromotion,
    getListEventPromotion,
    editEventPromotion,
    getListBillByTypeAdmin,
    updateStatusBillAdminWeb,
    getListVideoAdminByPage,
    deleteShortVideoAdmin,
    getListReportAdmin,
    skipReportVideoAdmin,
    getListBlogAdminByPage,
    deleteBlogAdminById,
    getListReportBlogAdmin,
    skipReportBlogAdmin,
    getStatisticalAdmin,
    StatisticalEvaluateAdmin,
    getStatisticalSale,
    getListKeyWordAdmin,
    editKeyWordSearchAdmin,
    deleteKeyWordAdmin,
    getListUserTypeAdmin,
    deleteEventPromotionAdmin,
    getCountBillOfMonth,



    //winform
    getListBillNoConfirm,
    getDetailBillAdmin,
    getListImageProductAdmin,
    getInfoProductAdmin,
    getClassifyProductAdmin,
    getAddressBillAdmin,
    confirmBillAdmin,
    updateStatusBillAdmin,
    getListStatusBillAdmin
    //end winform
}