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
    }

    type trademark {
        nameTrademark: String
        typeProduct: typeProduct
    }

    # ROOT TYPE
    type Query {
        typeproducts: [typeProduct]
        typeproduct (id: ID!): typeProduct
        
    }

    # type Mutation {
    #     createAuthor(id: ID!,name: String, age: Int): Author
    # }
`

module.exports = typeDefs