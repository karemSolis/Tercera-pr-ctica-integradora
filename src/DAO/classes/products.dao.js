//IMPORTACIÓN DE MÓDULOS NECESARIOS PARA PRODUCTS.DAO.JS 
import productModel from "../models/products.js" // BASE DE DATOS 
import usersDao from "../classes/users.dao.js"// CLASE DAO PARA MANEJAR LOS USUARIOS


const usersDaoInstance = new usersDao(); //CREACIÓN DE LA CLASE USERSDAO PARA LLAMAR MÉTODOS DE USERS.DAO.JS
class ProductsDao { //ESTA CLASE CONTENDRÁ LOS MÉTODOS PARA INTERACTUAR CON LA COLECCIÓN DE LOS PRODUCTOS EN LA BASE DE DATOS 

    async getProducts() {
        try {
            const products = await productModel.find();
            return products;
        } catch (error) {
            return "No se puede obtener producto";
        }
    }

    async addProduct(userId, product) { //ADDPRODUCT AGREGA UN NUEVO PRODUCTO A LA BASE DE DATOS,
    //TOMA EL ID DEL USER QUE ESTÁ AGREGANDO EL PRODUCTO Y LOS DETALLES DEL PRODUCTO COMO PARÁMETROS 
        try { //TRY Y CATCH SE UNSAN PARA MANEJAR ERRORES POTENCIALES QUE PUEDEN OCURRIR DURANTE LA EJECUCIÓN DEL CÓDIGO DENTRO DEL BLOQUE. 
            const userIsAdmin = usersDaoInstance.isUserAdmin(userId);////NO EXISTE EL MÉTODO ISuSERaDMIN, SI ESTUIERA DEBERÍA VERIFICAR SI EL USUARPIO QUE ESTÁ AGREGANDO 
            //EL PRODUCTO ES ES UN ADMINISTRADOR. ESTO SUGUIERE QUE USERDAOINSTANCE ES UNA INSTANCIA DE UN DAO QUE MANEJA USUARIOS Y SU LÓGICA. 
            // Verifica si el usuario es premium o admin para asignar el owner
            const owner = userIsAdmin ? 'admin' : userId;

            const newProduct = new productModel({ ...product, owner });
            await newProduct.save();

            return "Producto agregado";
        } catch (error) {
            return "No se puede agregar producto";
        }
    }

    async getProductById(productId) {
        try {
            const product = await productModel.findById(productId).lean();
            if (!product) return "No se encontró el producto";
            return product;
        } catch (error) {
            return "No se puede obtener producto";
        }
    }

        // Función para verificar si un usuario es un administrador
        isUserAdmin(userId) {
            // Aquí debes implementar la lógica para obtener el rol del usuario desde tu base de datos o desde el token.
            // Por ejemplo, si el rol está almacenado en el token:
            const userRol = getUserRolFromToken(userId);
            return userRol === 'admin';
        }
        
        // Función para obtener el rol del usuario desde el token (ejemplo)
        getUserRolFromToken(token) {
            const decodedToken = jwt.verify(token, 'tu_secreto');
            return decodedToken.user.rol;
        }

    async updateProduct(userId, productId, updatedProduct) {
        try {
            // Busca el producto existente por su ID
            const existingProduct = await productModel.findById(productId);
    
            if (!existingProduct) {
                return "No se encuentra producto";
            }
    
            // Verifica los permisos del usuario
            if (
                userId.toString() !== existingProduct.owner.toString() &&
                // Agrega la lógica para permitir a un admin editar cualquier producto
                !ProductsDao.isUserAdminStatic(userId)
            ) {
                return "No tienes permisos para actualizar este producto";
            }
    
            // Realiza la actualización del producto
            const updatedProductResult = await productModel.findByIdAndUpdate(
                productId,
                updatedProduct,
                { new: true }
            );
    
            if (!updatedProductResult) {
                return "No se encuentra producto"; // Manejar el caso donde no se actualiza el producto
            }
    
            return "Producto actualizado";
        } catch (error) {
            return "Error al actualizar el producto";
        }

    }

    async deleteProduct(userId, productId) {
        try {
            const existingProduct = await productModel.findById(productId);

            if (!existingProduct) {
                return "No se encontró el producto";
            }

            // Verificar permisos
            if (
                userId.toString() !== existingProduct.owner.toString() &&
   
                !userIsAdmin
            ) {
                return "No tienes permisos para eliminar este producto";
            }

            const deletedProduct = await productModel.findByIdAndRemove(productId);

            return "Producto eliminado";
        } catch (error) {
            return "No se puede eliminar producto";
        }
    }

    async exist(productId) {
        try {
            const product = await productModel.findById(productId).lean();
            return !!product; // Devolverá true si el producto existe, de lo contrario, false.
        } catch (error) {
            return false; // En caso de error, asumimos que el producto no existe.
        }
    }
}

export default ProductsDao;
