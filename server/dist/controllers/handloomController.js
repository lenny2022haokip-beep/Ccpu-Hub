"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandloomController = void 0;
const handloomService_js_1 = require("../services/handloomService.js");
class HandloomController {
    static async getProducts(req, res) {
        try {
            const { tribe, category, query } = req.query;
            const products = await handloomService_js_1.HandloomService.getProducts({
                tribe: tribe,
                category: category,
                query: query,
            });
            res.status(200).json({
                success: true,
                count: products.length,
                data: products,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error fetching handloom products' });
        }
    }
    static async logInquiry(req, res) {
        try {
            const { productId, buyerName, buyerPhone, channel } = req.body;
            const result = await handloomService_js_1.HandloomService.logInquiry({ productId, buyerName, buyerPhone, channel });
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error logging inquiry' });
        }
    }
}
exports.HandloomController = HandloomController;
