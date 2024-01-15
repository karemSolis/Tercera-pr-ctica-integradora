
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
    
    

    // async addUser(user) {
    //     try {
    //         const { first_name, last_name, email, age, rol } = user;
    //         const password = user.password; // Aquí se obtiene la contraseña

    //         logger.debug("Intentando agregar nuevo usuario:", user);

    //         await this.userModel.create({ first_name, last_name, email, age, rol, password });
    //         // const newUser = await this.userModel.create({ first_name, last_name, email, age, rol, password });
    //         // await newUser

    //         console.log("Nuevo usuario a crear:", {
    //             _id: new mongoose.Types.ObjectId(),
    //             first_name,
    //             last_name,
    //             email,
    //             age,
    //             rol,
    //             password
    //         });
            
    //         const newUser = await this.userModel.create({
    //             _id: new mongoose.Types.ObjectId(), // Asigna un nuevo _id único
    //             first_name,
    //             last_name,
    //             email,
    //             age,
    //             rol,
    //             password
    //         });

    //         logger.debug("Usuario creado correctamente:", newUser);
    //         return 'Usuario creado correctamente';
    //     } catch (error) {
    //         logger.error('Error al crear el usuario:', error);
    //         return 'Error al crear el usuario';
    //     }
    // }
    
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



/*

MÉTODOS USADOS:
-addUser(user): Agrega un nuevo usuario a la base de datos.

-isValidPassword(user, password): Verifica si la contraseña proporcionada coincide con la contraseña almacenada para un usuario específico. 
Este método utiliza una función llamada isValidPassword para realizar la verificación y se encuentra en utils.js.

-updateUser(id, updatedUser): Actualiza la información de un usuario existente en la base de datos. Recibe el id del usuario a actualizar 
y un objeto updatedUser con las nuevas propiedades. Busca al usuario por id, aplica las actualizaciones y guarda los cambios.

-getUsers(): Obtiene todos los usuarios presentes en la base de datos. Retorna un array con la información de cada usuario.

-getUserById(id): Obtiene la información de un usuario específico basándose en su id. Retorna el usuario encontrado o un mensaje indicando 
que no se encontró el usuario.

-deleteUser(id): Elimina un usuario de la base de datos según su id. Busca al usuario por id, lo elimina y retorna un mensaje indicando si 
la operación fue exitosa.

-findUser(email): Busca un usuario por su dirección de correo electrónico. Retorna la información básica del usuario si se encuentra, o un 
mensaje indicando que el usuario no fue encontrado.


-findEmail(param): Busca un usuario basándose en un parámetro específico. Retorna el usuario encontrado o un mensaje indicando que no se 
encontró el usuario.

-saveUser(user):este método se encarga de crear un nuevo usuario en la base de datos y retorna el documento del usuario creado en caso de 
éxito, o null (que significa que no puede proporcionar el documento) en caso de error. La información detallada sobre el error se registra 
mediante el logger para facilitar la depuración. 

*/