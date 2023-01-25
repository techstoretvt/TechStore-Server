import {
    ListTypeProducts, ListTrademarks, ListProducts, ListImageProducts,
    ListClassify, ListPromotions, listEvaluates

} from '../data/rest'


let products
let Listtypeproducts
let listtrademarks
let listimageproduct
let listclassify
let listpromotions
let listevaluates

async function initList() {
    products = await ListProducts();
    Listtypeproducts = await ListTypeProducts();
    listtrademarks = await ListTrademarks();
    listimageproduct = await ListImageProducts();
    listclassify = await ListClassify();
    listpromotions = await ListPromotions();
    listevaluates = await listEvaluates();
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
        countEvaluate: (parent, args) => {
            let data = listevaluates.filter(item => item.idProduct === parent.id);
            return data.length
        },
        persentElevate: (parent, args) => {
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