import {
    ListTypeProducts, ListTrademarks, ListProducts, ListImageProducts,
    ListClassify, ListPromotions, listEvaluates

} from '../data/rest'


// let products
// let listtrademarks
// let listimageproduct
// let listclassify
// let listpromotions
// let listevaluates

// async function initList() {






// }
// initList();

const resolvers = {
    //QUERY
    Query: {
        typeproducts: () => {
            return Listtypeproducts
        },
        typeproduct: (parent, args) => {
            return Listtypeproducts.find(item => item.id === +args.id)
        },
        product: async (parent, args) => {
            let products = await ListProducts();
            return products.find(item => item.id === +args.id)
        },
    },
    product: {
        typeProduct: async (parent, args) => {
            let Listtypeproducts = await ListTypeProducts();
            return Listtypeproducts.find(item => item.id === parent.idTypeProduct)
        },
        trademark: async (parent, args) => {
            let listtrademarks = await ListTrademarks();
            return listtrademarks.find(item => item.id === parent.idTrademark)
        },
        imageProduct: async (parent, args) => {
            let listimageproduct = await ListImageProducts();
            return listimageproduct.filter(item => item.idProduct === parent.id)
        },
        classifyProduct: async (parent, args) => {
            let listclassify = await ListClassify();
            return listclassify.filter(item => item.idProduct === parent.id)
        },
        promotionProduct: async (parent, args) => {
            let listpromotions = await ListPromotions();
            return listpromotions.find(item => item.idProduct === parent.id)
        },
        countEvaluate: async (parent, args) => {
            let listevaluates = await listEvaluates();
            let data = listevaluates.filter(item => item.idProduct === parent.id);
            return data.length
        },
        persentElevate: async (parent, args) => {
            let listevaluates = await listEvaluates();
            let data = listevaluates.filter(item => item.idProduct === parent.id);
            if (data.length === 0) return 0

            let sum = data.reduce((init, item) => {
                return init + item.starNumber
            }, 0)

            return sum / data.length;
        },

    },



    // //MUTATION
    // Mutation: {
    //     createAuthor: (parent, args) => args
    // }
}

module.exports = resolvers