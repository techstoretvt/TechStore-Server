import express from 'express'
import adminController from '../controllers/adminController'
const fileUploader = require('../config/cloudinary.config');
import multer from 'multer';
import path from 'path'
import { routes } from '../services/commont'

let router = express.Router();

let appRoot = require('app-root-path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + '/src/public/videoTam/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

let upload = multer({
    storage,
    limits: { fileSize: 104857600 }
})


const initAdminRoute = (app) => {

    //admin api
    router.get(routes.getAllTypeProduct, adminController.getAllTypeProduct)
    router.get(routes.getAllTrademark, adminController.getAllTrademark)
    router.get(routes.getListProductByPage, adminController.getListProductByPage)
    router.get(routes.getProductBySwapAndPage, adminController.getProductBySwapAndPage);
    //winform
    router.get(routes.getListBillNoConfirm, adminController.getListBillNoConfirm)
    router.get(routes.getDetailBillAdmin, adminController.getDetailBillAdmin)
    router.get(routes.getListImageProductAdmin, adminController.getListImageProductAdmin)
    router.get(routes.getInfoProductAdmin, adminController.getInfoProductAdmin)
    router.get(routes.getClassifyProductAdmin, adminController.getClassifyProductAdmin)
    router.get(routes.getAddressBillAdmin, adminController.getAddressBillAdmin)
    router.get(routes.confirmBillAdmin, adminController.confirmBillAdmin)
    router.get(routes.updateStatusBillAdmin, adminController.updateStatusBillAdmin)
    router.get(routes.getListStatusBillAdmin, adminController.getListStatusBillAdmin)
    //end winform



    router.post(routes.addTrademark, adminController.addTrademark)
    router.post(routes.addTypeProduct, fileUploader.single('file'), adminController.addTypeProduct)
    router.post(routes.cloudinaryUpload, fileUploader.array('file'), adminController.cloudinaryUpload);
    router.post(routes.createNewProduct, adminController.createNewProduct)
    router.post(routes.addPromotionByIdProduct, adminController.addPromotionByIdProduct);
    router.post(routes.swapImageProduct, adminController.swapImageProduct);
    router.post(routes.createNewKeyWord, adminController.createNewKeyWord)
    router.post(routes.createNotify_noimage, adminController.createNotify_noimage)
    router.post(routes.createNotify_image, fileUploader.single('file'), adminController.createNotify_image)
    router.post(routes.CheckLoginAdminAccessToken, adminController.CheckLoginAdminAccessToken)
    router.post(routes.createNewUserAdmin, adminController.createNewUserAdmin)


    router.put(routes.confirmBillById, adminController.confirmBillById)
    router.put(routes.cancelBillById, adminController.cancelBillById)
    router.put(routes.updateTypeProductById, fileUploader.single('file'), adminController.updateTypeProductById)
    router.put(routes.updateTrademarkById, adminController.updateTrademarkById)
    router.put(routes.editProductById, adminController.editProductById)
    router.put(routes.blockProduct, adminController.blockProduct)
    router.put(routes.editImageProduct, fileUploader.single('file'), adminController.editImageProduct)


    router.delete(routes.deleteTypeProduct, adminController.deleteTypeProduct)
    router.delete(routes.deleteTrademarkById, adminController.deleteTrademarkById)
    router.delete(routes.deleteErrorProduct, adminController.deleteErrorProduct);





    return app.use('/', router);
}

export default initAdminRoute;