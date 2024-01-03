//CREANDO EL ESQUEMA O ESTRUCTUR DE LOS DATOS QUE SE GUARDARÁN EN ATLAS
import mongoose, { Schema } from "mongoose";

const productCollection = "productos"; // la colección para Atlas

// el schema
const productSchema = mongoose.Schema({
  product: String,
  description: String,
  price: Number,
  owner: { type: Schema.Types.ObjectId, ref: 'User', default: 'admin' },
});

// se crea la constante para exportar
const productModel = mongoose.model(productCollection, productSchema);

export default productModel;

/*

{
    "product": "String",
    "description": "String",
    "price": 1000,
}


*/
