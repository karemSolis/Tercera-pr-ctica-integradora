import mongoose from "mongoose";

const usersCollection = "usuarios";

const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true, //para correo único 
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "carritos", 
    },
    role: { // roll
        type: String,
        default: "user",
    },
});

export const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;
