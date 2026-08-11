"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticesController = void 0;
const noticesService_js_1 = require("../services/noticesService.js");
class NoticesController {
    static async getNotices(req, res) {
        try {
            const notices = await noticesService_js_1.NoticesService.getNotices();
            res.status(200).json({
                success: true,
                count: notices.length,
                data: notices,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error fetching town notices' });
        }
    }
}
exports.NoticesController = NoticesController;
