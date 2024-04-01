"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const context_1 = tslib_1.__importDefault(require("../../middlewares/context"));
const start_1 = require("../../start");
const user_1 = tslib_1.__importDefault(require("../../models/user/user"));
const router = express_1.default.Router();
router.get('/me', context_1.default, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ _id: req.user._id });
    res.status(200).json(user);
}));
router.get('/users', context_1.default, (_, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.find();
    res.status(200).json(user);
}));
router.post('/register', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const user = yield start_1.appContext.services.UserService.registerUser(req, res);
    return res.status(201).json({ user });
}));
router.post('/verify', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const response = yield start_1.appContext.services.UserService.verifyUser(req, res);
    res.status(200).json(response);
}));
router.post('/forgotpassword', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const response = yield start_1.appContext.services.UserService.forgotPassword(req, res);
    res.status(200).json(response);
}));
router.post('/resetpassword', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const response = yield start_1.appContext.services.UserService.resetPassword(req, res);
    res.status(200).json(response);
}));
router.post('/login', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const user = yield start_1.appContext.services.UserService.loginUser(req, res);
    res.status(200).json(user);
}));
router.put('/updateuser', context_1.default, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const user = yield start_1.appContext.services.UserService.updateUser(req, res);
    res.status(200).json(user);
}));
router.delete('/deleteuser', context_1.default, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield start_1.appContext.services.UserService.deleteUser(req, res);
}));
router.get('/getuserrating', context_1.default, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const rating = yield start_1.appContext.services.UserService.getUserRating(req, res);
    res.status(201).json(rating);
}));
exports.default = router;
//# sourceMappingURL=user.router.js.map