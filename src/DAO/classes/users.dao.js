import { createHash, isValidPassword } from "../../utils.js";
import usersModel from "../models/user.js";
import logger from "../../controllers/logger.js"
import mongoose from "mongoose";


class usersDao {
    constructor() {
        this.userModel = usersModel;

    }

    async addUser(user) {
        try {
            const newUser = await this.userModel.create(user);
            logger.debug("Usuario creado correctamente:", newUser);
            
            // Asignar el _id al usuario
            newUser._id = newUser._id;
    
            return newUser; // Devolver el usuario creado
        } catch (error) {
            logger.error('Error al crear el usuario:', error);
            return null; // Devolver null en caso de error
        }
    }
    
    async isUserAdmin(userId) {
        try {
            const user = await this.userModel.findById(userId);
            return user && user.rol === 'admin';
        } catch (error) {
            return "Error"; 
        }
    }

        //obtiene a todos los usuarios 
        async getUsers(_id) {
            try {
                const users = await this.userModel.find({});
                logger.debug("Usuarios obtenidos:", users);
                return users;
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
                return [];
            }
        }
    
    async isValidPassword(user, password) {
        return isValidPassword(user, password);
    }
    
    

    //actualiza al usuario que ya existe en la base de datos 
    async updateUser(_id, updatedUser) {
        try {
            const userToUpdate = await this.userModel.findById(_id);

            if (!userToUpdate) {
                return 'Usuario no encontrado';
            }

            userToUpdate.set(updatedUser);

            await userToUpdate.save();
            logger.debug("Usuario actualizado correctamente:", userToUpdate);
            return 'Usuario actualizado correctamente';
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            return 'Error al actualizar el usuario';
        }
    }


    //obtiene a todos los usuarios 
    async getUsers(_id) {
        try {
            const users = await this.userModel.find({});
            logger.debug("Usuarios obtenidos:", users);
            return users;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return [];
        }
    }

    //obtienen usuario por su id 
    async getUserById(_id) {

        try {
            //if (!mongoose.Types.ObjectId.isValidPassword(_id)) {
                console.log("ID recibido:", _id);
                if (!mongoose.Types.ObjectId.isValid(_id)) {
                return "ID de usuario no válido";
                
            }
    
            const user = await userModel.findById(_id).lean();
            
    
            if (!user) {
                return "Usuario no encontrado";
            }
    
            return user;
        } catch (error) {
            return "Error al obtener usuario por ID: 2 " + error.message;
        }
    }

    //borra usuario por su id 
    async deleteUser(_id) {
        try {
            const user = await this.userModel.findById(_id);

            if (!user) {
                return 'Usuario no encontrado';
            }

            await user.remove();
            logger.debug("Usuario eliminado correctamente:", user);
            return 'Usuario eliminado correctamente';
        } catch (error) {
            logger.error('Error al eliminar el usuario:', error);
            return 'Error al eliminar el usuario: ' + error.message;
        }
    }

    async findUser(email) {
        try {
            const user = await this.userModel.findOne({ email }, { email: 1, first_name: 1, last_name: 1, password: 1, age: 1, rol: 1 });

            if (!user) {
                return "Usuario no encontrado";
            }

            return user;
        } catch (error) {
            logger.error('Error al validar usuario', error);
            return 'Error al obtener el usuario';
        }
    }

    async findEmail(param) {
        try {
            const user = await this.userModel.findOne(param)
            logger.debug('Usuario encontrado: dao');
            return user;
        } catch (error) {
            console.error('Error al validar usuario', error);
            return 'Error al obtener el usuario';
        }
    }
    
    saveUser = async (user) => {
        try {
            let result = await this.userModel.create(user) 
            return result 
        } catch (error) { 
            logger.error(error) 
            return null 
        }
    }


}

export default usersDao; 
