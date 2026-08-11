"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickerController = void 0;
const tickerService_js_1 = require("../services/tickerService.js");
class TickerController {
    static async getHeadlines(req, res) {
        try {
            const headlines = await tickerService_js_1.TickerService.getHeadlines();
            res.status(200).json({
                success: true,
                data: headlines,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error fetching ticker headlines' });
        }
    }
}
exports.TickerController = TickerController;
