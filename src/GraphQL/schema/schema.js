import { gql } from 'apollo-server-express'

const typeDefs = gql`
    type typeProduct {
        id: String
        nameTypeProduct: String
    }
    type product {
        id: String
        nameProduct: String
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
        nameTrademark: String
        typeProduct: typeProduct
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
    }

    type detailBill {
        idBill: String
        amount: Int
        isReviews: String
        product: product
        classifyProduct: classifyProduct
    }

    type addressUser {
        id: String
        fullname: String,
        sdt: String,
        country: String,
        district: String,
        addressText: String,
    }


    # ROOT TYPE
    type Query {
        typeproducts: [typeProduct]
        typeproduct (id: ID!): typeProduct
        product (id: String!): product
        searchProduct (keyword: String!): [product]
        listBillByType (type: String!): [bill]
    }

    # type Mutation {
    #     createAuthor(id: ID!,name: String, age: Int): Author
    # }
`

module.exports = typeDefs