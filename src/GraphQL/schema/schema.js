const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type typeProduct {
        id: ID
        nameTypeProduct: String
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