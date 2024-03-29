import mongoose from "mongoose";

const usersCollection = "usuarios";

const usersSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true, //para correo único 
    },
    age: Number,
    password: {
        type: String,
        required: false,
        minlength: 6, // Longitud mínima de la contraseña
    },
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "carritos", 
    },
    rol: { type: String, enum: ['user', 'admin', 'premium'], default: 'user' },
    
});

export const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;


/*
http://localhost:8080/api/jwt/formRegister POST
{
    "first_name": "All", 
    "last_name": "Might", 
    "email": "allm@gmail.com", 
    "age": "49", 
    "password": "123456",
    "rol": "user"
}
 */

/*
http://localhost:8080/api/jwt/login POST
{
    "email": "allm@gmail.com", 
    "password": "123456"
}
*/