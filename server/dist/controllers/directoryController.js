"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryController = void 0;
const directoryService_js_1 = require("../services/directoryService.js");
class DirectoryController {
    static async getListings(req, res) {
        try {
            const { query, category } = req.query;
            const listings = await directoryService_js_1.DirectoryService.getListings(query, category);
            res.status(200).json({
                success: true,
                count: listings.length,
                data: listings,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error fetching directory listings' });
        }
    }
}
exports.DirectoryController = DirectoryController;
