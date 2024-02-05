
import mongoose, { Schema } from "mongoose";
//import mongoose, { Schema } from "mongoose";

const productCollection = "productos"; // la colección para Atlas

// el schema
const productSchema = mongoose.Schema({
  product: String,
  description: String,
  price: Number,
  stock:Number,
  //owner: { type: Schema.Types.ObjectId, ref: 'User', default: null /*'admin'*/ },
  
});

productSchema.pre("save", function (next) {
  if (!this.owner) {
      // Accede al usuario autenticado desde req.user o this._user
      const user = this._user || {};
      console.log("Contenido de this._user:", user);
      // Verifica el rol del usuario
      if (user && user.rol === "premium") {
          this.owner = user.email; // Establece el email del usuario premium como propietario
      } else {
          this.owner = "admin"; // Establece por defecto como "admin" si no es premium
      }
  }
  next();
});

// se crea la constante para exportar
const productModel = mongoose.model(productCollection, productSchema);

export default productModel;

/*
TRAER PRODUCTOS
http://localhost:8080/api/products GET


AGREGAR PRODUCTOS:
http://localhost:8080/api/products POST
{
    "product": "Product 1",
    "description": "Description 1",
    "price": 1000,
    "stock": 10
}
*/
