import orderModel from "../models/order.js"
import logger from "../../controllers/logger.js"


export default class Order {
    getOrders = async () => {
        try {
            let result =  await orderModel.find()
            return result
        } catch (error) {
            logger.error(error)
            return null
        }
    }

    getOrdersById = async (id) => {
        try {
            let result = await orderModel.findOne({_id: id})
            return result
        } catch (error) {
            logger.error(error)
            return null
        }
    } 

    createOrder = async (order) => {
        try {
            let result = await orderModel.create(order)
            return result
        } catch (error) {
            logger.error(error)
            return null
        }
    } 

    resolveOrder = async (id, order) => {
        try {
            let result = await orderModel.updateOne({ _id: id }, { $set: order })
        } catch (error) {
            logger.error(error)
            return null
        }
    }
}


