"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sessionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, required: true, default: true }
});
const Session = (0, mongoose_1.model)('Session', sessionSchema);
exports.default = Session;
//# sourceMappingURL=session.js.map