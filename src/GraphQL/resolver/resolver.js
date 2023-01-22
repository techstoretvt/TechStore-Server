import { ListTypeProducts, ListTrademarks, ListProducts } from '../data/rest'


const resolvers = {
    //QUERY
    Query: {
        typeproducts: () => {
            return ListTypeProducts()
        },
        typeproduct: async (parent, args) => {
            let data = await ListTypeProducts();
            return data.find(item => item.id === +args.id)
        },
        product: async (parent, args) => {
            let data = await ListProducts();
            return data.find(item => item.id === +args.id)
        },
        // products: () => {
        //     return 'hello'
        // }
        // book: (parent, args) => books.find(book => book.id === +args.id),
        // authors: () => authors,
        // author: (parent, args) => authors.find(author => author.id === +args.id)
    },
    // Book: {
    //     author: (parent, args) => {
    //         return authors.find(author => author.id === parent.authorId)
    //     }
    // },
    // Author: {
    //     books: (parent, args) => {
    //         return books.filter(book => book.authorId === parent.id)
    //     }
    // },

    // //MUTATION
    // Mutation: {
    //     createAuthor: (parent, args) => args
    // }
}

module.exports = resolvers