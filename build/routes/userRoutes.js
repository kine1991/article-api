"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController = __importStar(require("../controllers/authController"));
const userController = __importStar(require("../controllers/userController"));
const current_user_1 = __importDefault(require("../utils/current-user"));
const router = express_1.default.Router();
router.route('/').get(userController.getUsers);
router.route('/sign-in').post(authController.signIn);
router.route('/sign-up').post(authController.signUp);
router.route('/change-password').patch(authController.protect, userController.changePassword);
router.route('/me').patch(authController.protect, userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);
router.route('/current-user').get(current_user_1.default, authController.currentUser);
router.route('/check-auth').get(authController.checkAuth);
router.route('/logout').get(authController.logout);
router.route('/:id').get(userController.getUser);
exports.default = router;
