import { gql } from 'apollo-server-express'

const typeDefs = gql`
    type typeProduct {
        id: String
        nameTypeProduct: String
        nameTypeProductEn: String
    }
    type product {
        id: String
        nameProduct: String
        nameProductEn: String
        priceProduct: String
        contentHTML: String
        isSell: String
        sold: Int
        
        typeProduct: typeProduct
        trademark: trademark
        imageProduct: [imageProduct]
        classifyProduct: [classifyProduct]
        promotionProduct: promotionProduct

        countEvaluate: Int
        persentElevate: Float
    }

    type trademark {
        id: String
        nameTrademark: String
        nameTrademarkEn: String
        typeProduct: typeProduct
        product: [product]
    }

    type imageProduct {
        imagebase64: String
        STTImage: Int
    }

    type classifyProduct {
        id: String
        amount: Int
        nameClassifyProduct: String
        STTImg: Int
        priceClassify: Int
    }

    type promotionProduct {
        timePromotion: String
        numberPercent: Int
    }

    type bill {
        id: String
        idUser: String
        timeBill: String
        idStatusBill: String
        idAddressUser: String
        note: String
        totals: Int
        detailBill: [detailBill]
        addressUser: addressUser
        updatedAt: String
        createdAt: String
        payment: String
    }

    type detailBill {
        id: String
        idBill: String
        amount: Int
        isReviews: String
        idProduct: String
        product: product
        classifyProduct: classifyProduct
        evaluateProduct:evaluateProduct
    }

    type addressUser {
        id: String
        fullname: String,
        sdt: String,
        country: String,
        district: String,
        addressText: String,
    }

    type evaluateProduct {
        id: String
        idUser: String
        idProduct: String
        starNumber: Int
        content: String
        stt: Int
        displayname: String
        imageEvaluateProduct: [imageEvaluateProduct]
        videoEvaluateProduct: videoEvaluateProduct
        idDetailBill: String
    }

    type imageEvaluateProduct {
        id: String
        idEvaluateProduct: String
        imagebase64: String
        idCloudinary: String
    }

    type videoEvaluateProduct {
        id: String
        idEvaluateProduct: String
        videobase64: String
        idGGDrive: String
    }


    # ROOT TYPE
    type Query {
        typeproducts: [typeProduct]
        typeproduct (id: ID!): typeProduct
        product (id: String!): product
        searchProduct (keyword: String!): [product]
        listBillByType (type: String!): [bill]
        BillById(id: String!): bill
        detailBillById(id: String): detailBill
        listTrademarkSearch(keyword: String!): [trademark]
        listTypeProductSearch(keyword: String!): [typeProduct]
    }

    # type Mutation {
    #     createAuthor(id: ID!,name: String, age: Int): Author
    # }
`

module.exports = typeDefs