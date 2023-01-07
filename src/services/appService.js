import db from '../models'

const getProductPromotionHome = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let countProduct = 10
            let listProducts = []

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
                    ['id', 'ASC'],
                    [{ model: db.imageProduct, as: 'imageProduct-product' }, 'STTImage', 'asc']
                ],
                raw: false,
                nest: true
            });

            let listProductTam = [...products]

            console.log('list product:', listProductTam[7].dataValues.promotionProducts[0].dataValues.timePromotion);

            listProductTam.forEach(item => {
                if (listProducts.length < countProduct) {
                    let time = new Date().getTime();
                    let timedb = +item.dataValues.promotionProducts[0].dataValues.timePromotion
                    if (timedb > time) {
                        // let check = true

                        // listProducts.forEach(item2 => {
                        //     if (item2.id === item.id) check = false
                        // })

                        // if (check)
                        listProducts.push(item);
                    }
                }
            })

            if (listProducts.length < countProduct) {
                console.log("vao");
                products.forEach(item => {
                    if (listProducts.length < countProduct) {
                        let time = new Date().getTime();
                        let timedb = +item.dataValues.promotionProducts[0].dataValues.timePromotion
                        if (timedb < time) {
                            listProducts.push(item);
                        }
                    }
                })
            }
            resolve({
                errCode: 0,
                count: listProducts.length,
                data: listProducts,
            })





        }
        catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getProductPromotionHome
}