import {
    ListTypeProducts, ListTrademarks, ListProducts, ListImageProducts,
    ListClassify, ListPromotions

} from '../data/rest'


let products
let Listtypeproducts
let listtrademarks
let listimageproduct
let listclassify
let listpromotions

async function initList() {
    products = await ListProducts();
    Listtypeproducts = await ListTypeProducts();
    listtrademarks = await ListTrademarks();
    listimageproduct = await ListImageProducts();
    listclassify = await ListClassify();
    listpromotions = await ListPromotions();
}
initList();

const resolvers = {
    //QUERY
    Query: {
        typeproducts: () => {
            return Listtypeproducts
        },
        typeproduct: (parent, args) => {
            return Listtypeproducts.find(item => item.id === +args.id)
        },
        product: (parent, args) => {
            return products.find(item => item.id === +args.id)
        },
    },
    product: {
        typeProduct: (parent, args) => {
            return Listtypeproducts.find(item => item.id === parent.idTypeProduct)
        },
        trademark: (parent, args) => {
            return listtrademarks.find(item => item.id === parent.idTrademark)
        },
        imageProduct: (parent, args) => {
            return listimageproduct.filter(item => item.idProduct === parent.id)
        },
        classifyProduct: (parent, args) => {
            return listclassify.filter(item => item.idProduct === parent.id)
        },
        promotionProduct: (parent, args) => {
            return listpromotions.find(item => item.idProduct === parent.id)
        },

    },



    // //MUTATION
    // Mutation: {
    //     createAuthor: (parent, args) => args
    // }
}

module.exports = resolvers