import express from 'express';
import {
  createMembershipControllers,
  getAllGalleryAndHighlightsControllers,
  getAllNewsAndEventsControllers,
  getAllNgos,
  getAllTempleController,
  getAllVlogsController,
  getOneVlogController,
  getTempleByIdController,
  loginUserControllers,
  logoutUserControllers,
  registerUserControllers,
  registerVolunteerControllers,
  verifyUserControllers,
} from '../controllers/userControllers';
import { jwtVerify } from '../middlewares/authMiddleware';
import upload from '../middlewares/multerMiddleware';

const router = express.Router();

router.route('/register').post(registerUserControllers);
router.route('/register-volunteer').post(upload.single('avatar'), registerVolunteerControllers);
router.route('/login').post(loginUserControllers);
router.route('/log-out').get(jwtVerify, logoutUserControllers);
router.route('/getall-galleryhighlights').get(getAllGalleryAndHighlightsControllers);
router.route('/getall-newsandevents').get(getAllNewsAndEventsControllers);
router.route('/verify-user').get(jwtVerify, verifyUserControllers);
router.route('/get-all-temple').get(getAllTempleController);
router.route('/temple-details/:id').get(getTempleByIdController);
router.route('/get-all-vlog').get(getAllVlogsController);
router.route('/membership').post(upload.single('photo'), createMembershipControllers);

router.route('/get-one-vlog/:id').get(getOneVlogController);
router.route("/get-all-ngos").get(getAllNgos)

export default router;
