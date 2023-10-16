import express from "express";
import ProductManager from './ProductManager.js'

const app = express()

app.get('/', (req,res) => res.json('ok'))

app.get('/api/products', async (req, res) => {
    const productManager = new ProductManager('./db.json')
    const data = await productManager.getProducts()
    //res.json({data})
    // let products = JSON.parse(data)
    let products = data

    if(req.query.limit) {
        const limit = parseInt(req.query.limit)
        if(!isNaN(limit)){
            products = products.slice(0, limit)
        }
    }
    console.log(products)
    res.json({ data: products })
})
app.get('/api/products/:id', async (req, res) => {
    const productManager = new ProductManager('./db.json')
    const data = await productManager.getProducts()
    let products = data
    if(req.params.id){
        const id = parseInt(req.params.id)
        if(!isNaN(id)){
            products = products.filter(product => product.id === id)
        }
    }
    console.log(products)
    res.json({ data:products })
})

app.listen(8080)
