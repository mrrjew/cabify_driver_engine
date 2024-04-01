"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const jwt_token = process.env.JWT_TOKEN;
function signJwt(object, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign(object, jwt_token, Object.assign({}, (options && options)));
    });
}
exports.signJwt = signJwt;
function verifyJwt(token) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, jwt_token);
            return decoded;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.verifyJwt = verifyJwt;
//# sourceMappingURL=token.js.map