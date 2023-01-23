const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type typeProduct {
        id: ID
        nameTypeProduct: String
    }
    type product {
        id: ID
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
        id: ID
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
        product (id: ID!): product
        
    }

    # type Mutation {
    #     createAuthor(id: ID!,name: String, age: Int): Author
    # }
`

module.exports = typeDefs