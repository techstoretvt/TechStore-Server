const { gql } = require('apollo-server-express')

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

    # ROOT TYPE
    type Query {
        typeproducts: [typeProduct]
        typeproduct (id: ID!): typeProduct
        product (id: String!): product
        
    }

    # type Mutation {
    #     createAuthor(id: ID!,name: String, age: Int): Author
    # }
`

module.exports = typeDefs