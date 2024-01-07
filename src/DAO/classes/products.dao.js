
import productModel from "../models/products.js"


class ProductsDao {
    async addProduct(userId, product) {
        try {
            const userIsAdmin = UsersDao.isUserAdmin(userId);

            // Verifica si el usuario es premium o admin para asignar el owner
            const owner = userIsAdmin ? 'admin' : userId;

            const newProduct = new productModel({ ...product, owner });
            await newProduct.save();

            return "Producto agregado";
        } catch (error) {
            return "No se puede agregar producto";
        }
    }




    async getProducts() {
        try {
            const products = await productModel.find().lean();
            return products;
        } catch (error) {
            return "No se puede obtener producto";
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
        getUserRolFromToken(userId) {
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
                !isUserAdmin(userId)
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


//FUNCIÓNES QUE USABA ANTES DE DEFINIR LOS ROLES: 

    /*async updateProduct(productId, product) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(productId, product, { new: true });
            if (!updatedProduct) return "No se encuentra producto";
            return "Producto actualizado";
        } catch (error) {
            return "Error al actualizar el producto";
        }
    }*/


/*
    async deleteProduct(productId) {
        try {
            const deletedProduct = await productModel.findByIdAndRemove(productId);
            if (!deletedProduct) return "No se encontró el producto";
            return "Producto eliminado";
        } catch (error) {
            return "No se puede eliminar producto";
        }
    }
*/            

//LÍNEA 100 Agrega la lógica para permitir a un admin borrar cualquier producto
//lÍNEA 101 Aquí deberías tener una lógica para determinar si el usuario es un admin