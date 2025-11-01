import express from 'express';

import {
  addNgo,
  approveUserToVolunterUserController,
  createGalleryAndHighlightsController,
  createNewsAndEventsControllers,
  createTempleControllers,
  createVlogController,
  deleteMemberShipsControllers,
  deleteNewsAndEventsControllers,
  deleteNgo,
  deleteTempleControllers,
  deleteUserController,
  deleteVlogController,
  getALlMemberShipsControllers,
  getAllUsersController,
  updateNewsAndEventsControllers,
  updatetempleDetailsControllers,
  updateUserController,
} from '../../controllers/adminControllers';
import upload from '../../middlewares/multerMiddleware';

const router = express.Router();

router.route('/upload-temple').post(upload.single('image'), createTempleControllers);
router.route('/update-temple/:id').put(updatetempleDetailsControllers);
router.route('/delete-temple/:id').delete(deleteTempleControllers);

router.route('/create-news-event').post(createNewsAndEventsControllers);
router.route('/delete-news-event/:id').delete(deleteNewsAndEventsControllers);
router.route('/update-news-event/:id').put(updateNewsAndEventsControllers);
router
  .route('/create-gallery-highlights')
  .post(upload.single('imageurl'), createGalleryAndHighlightsController);

router.route('/get-all-user').get(getAllUsersController);
router.route("/delete-user/:id").delete(deleteUserController)
router.route("/update-user/:id").put(updateUserController)
router.route("/approve-user/:id").put(approveUserToVolunterUserController)


router.route('/get-all-membership').get(getALlMemberShipsControllers);
router.route('/delete-membership/:id').delete(deleteMemberShipsControllers);

router.route('/upload-vlog').post(upload.single('file'), createVlogController);
router.route('/delete-vlog/:id').delete(deleteVlogController)


router.route('/upload-ngos').post(upload.single('image'),addNgo)
router.route('/delete-ngos/:id').delete(deleteNgo)

export default router;
