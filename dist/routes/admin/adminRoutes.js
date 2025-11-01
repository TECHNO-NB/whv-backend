"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminControllers_1 = require("../../controllers/adminControllers");
const multerMiddleware_1 = __importDefault(require("../../middlewares/multerMiddleware"));
const router = express_1.default.Router();
router.route('/upload-temple').post(multerMiddleware_1.default.single('image'), adminControllers_1.createTempleControllers);
router.route('/update-temple/:id').put(adminControllers_1.updatetempleDetailsControllers);
router.route('/delete-temple/:id').delete(adminControllers_1.deleteTempleControllers);
router.route('/create-news-event').post(adminControllers_1.createNewsAndEventsControllers);
router.route('/delete-news-event/:id').delete(adminControllers_1.deleteNewsAndEventsControllers);
router.route('/update-news-event/:id').put(adminControllers_1.updateNewsAndEventsControllers);
router
    .route('/create-gallery-highlights')
    .post(multerMiddleware_1.default.single('imageurl'), adminControllers_1.createGalleryAndHighlightsController);
router.route('/get-all-user').get(adminControllers_1.getAllUsersController);
router.route("/delete-user/:id").delete(adminControllers_1.deleteUserController);
router.route("/update-user/:id").put(adminControllers_1.updateUserController);
router.route("/approve-user/:id").put(adminControllers_1.approveUserToVolunterUserController);
router.route('/get-all-membership').get(adminControllers_1.getALlMemberShipsControllers);
router.route('/delete-membership/:id').delete(adminControllers_1.deleteMemberShipsControllers);
router.route('/upload-vlog').post(multerMiddleware_1.default.single('file'), adminControllers_1.createVlogController);
router.route('/delete-vlog/:id').delete(adminControllers_1.deleteVlogController);
exports.default = router;
