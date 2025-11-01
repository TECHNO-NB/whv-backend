import express from 'express';

import {
  createGalleryAndHighlightsController,
  createNewsAndEventsControllers,
  createTempleControllers,
  deleteMemberShipsControllers,
  deleteNewsAndEventsControllers,
  deleteTempleControllers,
  getALlMemberShipsControllers,
  getAllUsersController,
  updateNewsAndEventsControllers,
  updatetempleDetailsControllers,
} from '../../controllers/adminControllers';
import upload from '../../middlewares/multerMiddleware';
import { getAllTempleController } from '../../controllers/userControllers';

const router = express.Router();

router.route('/upload-temple').post(upload.single('image'), createTempleControllers);

router.route('/update-temple/:id').put(updatetempleDetailsControllers)
router.route('/delete-temple/:id').delete(deleteTempleControllers);

router.route('/create-news-event').post(createNewsAndEventsControllers);
router.route('/delete-news-event/:id').delete(deleteNewsAndEventsControllers);
router.route('/update-news-event/:id').put(updateNewsAndEventsControllers);
router
  .route('/create-gallery-highlights')
  .post(upload.single('imageurl'), createGalleryAndHighlightsController);
router.route('/get-all-user').get(getAllUsersController);
router.route('/get-all-membership').get(getALlMemberShipsControllers);
router.route('/delete-membership/:id').delete(deleteMemberShipsControllers);

export default router;
