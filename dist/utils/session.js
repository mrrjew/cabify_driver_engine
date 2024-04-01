"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSessionById = exports.signAccessToken = exports.signRefreshToken = void 0;
const tslib_1 = require("tslib");
const session_1 = tslib_1.__importDefault(require("../models/user/session"));
const user_1 = require("../models/user/user");
const token_1 = require("./token");
const lodash_1 = require("lodash");
const createSession = function ({ userId }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return yield session_1.default.create({ userId });
    });
};
function signRefreshToken({ userId }) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const session = createSession({ userId });
        const payload = { session: (yield session)._id };
        const refreshToken = yield (0, token_1.signJwt)(payload, {
            expiresIn: '1y'
        });
        return refreshToken;
    });
}
exports.signRefreshToken = signRefreshToken;
function signAccessToken(user) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const payload = (0, lodash_1.omit)(user.toJSON(), user_1.privateField);
        const accessToken = (0, token_1.signJwt)(payload, {
            expiresIn: '1d',
        });
        console.log(accessToken);
        return accessToken;
    });
}
exports.signAccessToken = signAccessToken;
function findSessionById(id) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return session_1.default.findById(id);
    });
}
exports.findSessionById = findSessionById;
//# sourceMappingURL=session.js.map