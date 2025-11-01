"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveUserToVolunterUserController = exports.deleteVlogController = exports.createVlogController = exports.deleteMemberShipsControllers = exports.getALlMemberShipsControllers = exports.deleteUserController = exports.updateUserController = exports.getAllUsersController = exports.deleteGalleryAndHighlightsController = exports.updateGalleryAndHighlightsController = exports.createGalleryAndHighlightsController = exports.updateNewsAndEventsControllers = exports.deleteNewsAndEventsControllers = exports.createNewsAndEventsControllers = exports.updatetempleDetailsControllers = exports.deleteTempleControllers = exports.createTempleControllers = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const cloudinary_1 = require("../utils/cloudinary");
const db_1 = __importDefault(require("../DB/db"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
// upload / create Temple
const createTempleControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { templeName, address, descriptions } = req.body;
    if (!templeName || !address || !descriptions) {
        throw new apiError_1.default(false, 400, 'Required All field');
    }
    const imgFile = req.file.path;
    if (!imgFile) {
        throw new apiError_1.default(false, 400, 'Image is required');
    }
    const imageUrl = yield (0, cloudinary_1.uploadToCloudinary)(imgFile);
    if (!imageUrl) {
        throw new apiError_1.default(false, 400, 'Image is not uploaded to cloudinary');
    }
    const uploadTemple = yield db_1.default.temple.create({
        data: {
            templeName,
            address,
            descriptions,
            image: imageUrl,
        },
    });
    if (!uploadTemple) {
        throw new apiError_1.default(false, 400, 'Failed to upload temple at db');
    }
    res.status(201).json(new apiResponse_1.default(true, 201, 'Successfully added temple to DB', uploadTemple));
}));
exports.createTempleControllers = createTempleControllers;
// delete temple
const deleteTempleControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new apiError_1.default(false, 400, 'Temple id is required');
    }
    const deleteTemple = yield db_1.default.temple.delete({
        where: {
            id,
        },
    });
    if (!deleteTemple) {
        throw new apiError_1.default(false, 400, 'Temple is not deleted');
    }
    res.status(200).json(new apiResponse_1.default(true, 200, 'Temple Deleted Successfully'));
}));
exports.deleteTempleControllers = deleteTempleControllers;
// update Temple Details
const updatetempleDetailsControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new apiError_1.default(false, 400, 'Temple Id is Required');
    }
    const { templeName, address, descriptions } = req.body;
    if (!templeName || !address || !descriptions) {
        throw new apiError_1.default(false, 400, 'All Field is Required');
    }
    const updateTempleDetails = yield db_1.default.temple.update({
        where: {
            id,
        },
        data: {
            templeName,
            address,
            descriptions,
        },
    });
    if (!updateTempleDetails) {
        throw new apiError_1.default(false, 400, 'Failed to update temple details');
    }
    res
        .status(200)
        .json(new apiResponse_1.default(true, 200, 'Successfully Update temple Details to DB', updateTempleDetails));
}));
exports.updatetempleDetailsControllers = updatetempleDetailsControllers;
// create news and events
const createNewsAndEventsControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, eventDate } = req.body;
    if (!title) {
        throw new apiError_1.default(false, 400, 'Title is required');
    }
    const createNewsAndEvents = yield db_1.default.newsAndEvent.create({
        data: {
            title,
            eventDate: new Date(`${eventDate}T00:00:00.000Z`),
        },
    });
    if (!createNewsAndEvents) {
        throw new apiError_1.default(false, 400, 'Failed to create news and events');
    }
    res
        .status(201)
        .json(new apiResponse_1.default(true, 201, 'Successfully create news and event to DB', createNewsAndEvents));
}));
exports.createNewsAndEventsControllers = createNewsAndEventsControllers;
// delete News and Events
const deleteNewsAndEventsControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new apiError_1.default(false, 400, 'News And Event id is required');
    }
    const deleteTemple = yield db_1.default.newsAndEvent.delete({
        where: {
            id,
        },
    });
    if (!deleteTemple) {
        throw new apiError_1.default(false, 400, 'News And Event is not deleted');
    }
    res.status(200).json(new apiResponse_1.default(true, 200, 'News and Event Deleted Successfully'));
}));
exports.deleteNewsAndEventsControllers = deleteNewsAndEventsControllers;
// update News and Event Details
const updateNewsAndEventsControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, eventDate } = req.body;
    if (!id) {
        throw new apiError_1.default(false, 400, 'News and Event id is required');
    }
    // Prepare update data
    const updateData = {};
    if (title)
        updateData.title = title;
    if (eventDate)
        updateData.eventDate = new Date(`${eventDate}T00:00:00.000Z`); // ✅ safe conversion
    const updateNews = yield db_1.default.newsAndEvent.update({
        where: { id },
        data: updateData,
    });
    if (!updateNews) {
        throw new apiError_1.default(false, 400, 'Failed to update News and Event');
    }
    res
        .status(200)
        .json(new apiResponse_1.default(true, 200, 'News and Event Updated Successfully', updateNews));
}));
exports.updateNewsAndEventsControllers = updateNewsAndEventsControllers;
// ================= CREATE =================
const createGalleryAndHighlightsController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const imgFile = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    const { types } = req.body;
    if (!imgFile) {
        throw new apiError_1.default(false, 400, 'Image is required');
    }
    const imageUrl = yield (0, cloudinary_1.uploadToCloudinary)(imgFile);
    if (!imageUrl) {
        throw new apiError_1.default(false, 400, 'Image is not uploaded to Cloudinary');
    }
    const validTypes = [
        'globalconferencesandsummits',
        'humanitarianservicemissions',
        'youthandwomanempowerment',
        'culturalandtemplecelebrations',
        'environmentalandeducationprojects',
    ];
    if (types && !validTypes.includes(types)) {
        throw new apiError_1.default(false, 400, 'Invalid gallery type provided');
    }
    const newGallery = yield db_1.default.galleryAndHighLights.create({
        data: {
            image: imageUrl,
            types: types || 'globalconferencesandsummits',
        },
    });
    res
        .status(201)
        .json(new apiResponse_1.default(true, 201, 'Gallery item successfully created', newGallery));
}));
exports.createGalleryAndHighlightsController = createGalleryAndHighlightsController;
// ================= UPDATE =================
const updateGalleryAndHighlightsController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { types } = req.body;
    const imgFile = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    const gallery = yield db_1.default.galleryAndHighLights.findUnique({ where: { id } });
    if (!gallery) {
        throw new apiError_1.default(false, 404, 'Gallery item not found');
    }
    let imageUrl = gallery.image;
    // If new image uploaded, upload to Cloudinary & delete old one
    if (imgFile) {
        const uploadedUrl = yield (0, cloudinary_1.uploadToCloudinary)(imgFile);
        if (!uploadedUrl) {
            throw new apiError_1.default(false, 400, 'Image failed to upload to Cloudinary');
        }
        // delete old Cloudinary image
        yield (0, cloudinary_1.deleteCloudinaryImage)(gallery.image);
        imageUrl = uploadedUrl;
    }
    const updatedGallery = yield db_1.default.galleryAndHighLights.update({
        where: { id },
        data: {
            image: imageUrl,
            types: types || gallery.types,
        },
    });
    res
        .status(200)
        .json(new apiResponse_1.default(true, 200, 'Gallery item successfully updated', updatedGallery));
}));
exports.updateGalleryAndHighlightsController = updateGalleryAndHighlightsController;
// ================= DELETE =================
const deleteGalleryAndHighlightsController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const gallery = yield db_1.default.galleryAndHighLights.findUnique({ where: { id } });
    if (!gallery) {
        throw new apiError_1.default(false, 404, 'Gallery item not found');
    }
    // delete from Cloudinary
    yield (0, cloudinary_1.deleteCloudinaryImage)(gallery.image);
    // delete from DB
    yield db_1.default.galleryAndHighLights.delete({ where: { id } });
    res.status(200).json(new apiResponse_1.default(true, 200, 'Gallery item successfully deleted', null));
}));
exports.deleteGalleryAndHighlightsController = deleteGalleryAndHighlightsController;
// =================== FETCH ALL USERS ===================
const getAllUsersController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.default.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            role: true,
            forVolunteer: true,
            avatar: true,
            address: true,
            createdAt: true,
        },
    });
    if (!users || users.length === 0) {
        throw new apiError_1.default(false, 404, 'No users found');
    }
    res.status(200).json(new apiResponse_1.default(true, 200, 'Fetched all users successfully', users));
}));
exports.getAllUsersController = getAllUsersController;
// =================== UPDATE USER ===================
const updateUserController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { fullName, phoneNumber, address, role, forVounteer } = req.body;
    const user = yield db_1.default.user.findUnique({ where: { id } });
    if (!user) {
        throw new apiError_1.default(false, 404, 'User not found');
    }
    const validRoles = ['user', 'admin', 'volunteer'];
    if (role && !validRoles.includes(role)) {
        throw new apiError_1.default(false, 400, 'Invalid role type provided');
    }
    const updatedUser = yield db_1.default.user.update({
        where: { id },
        data: {
            fullName: fullName || user.fullName,
            phoneNumber: phoneNumber || user.phoneNumber,
            address: address || user.address,
            role: role || user.role,
            forVolunteer: typeof forVounteer === 'boolean' ? forVounteer : user.forVolunteer,
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            role: true,
            forVolunteer: true,
            avatar: true,
            address: true,
            createdAt: true,
        },
    });
    res.status(200).json(new apiResponse_1.default(true, 200, 'User updated successfully', updatedUser));
}));
exports.updateUserController = updateUserController;
// =================== DELETE USER ===================
const deleteUserController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield db_1.default.user.findUnique({ where: { id } });
    if (!user) {
        throw new apiError_1.default(false, 404, 'User not found');
    }
    yield db_1.default.user.delete({ where: { id } });
    res.status(200).json(new apiResponse_1.default(true, 200, 'User deleted successfully', null));
}));
exports.deleteUserController = deleteUserController;
// approve user to volunter
const approveUserToVolunterUserController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield db_1.default.user.findUnique({ where: { id } });
    if (!user) {
        throw new apiError_1.default(false, 404, 'User not found');
    }
    yield db_1.default.user.update({
        where: { id },
        data: {
            role: 'volunteer',
        },
    });
    res.status(200).json(new apiResponse_1.default(true, 200, 'User updated to volunteer successfully'));
}));
exports.approveUserToVolunterUserController = approveUserToVolunterUserController;
// get all memberships
const getALlMemberShipsControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getAllMemberships = yield db_1.default.membership.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
    if (!getAllMemberships || getAllMemberships.length < 0) {
        throw new apiError_1.default(false, 400, 'Error on get all membership');
    }
    return res
        .status(200)
        .json(new apiResponse_1.default(true, 200, 'Successsfully get all membership data', getAllMemberships));
}));
exports.getALlMemberShipsControllers = getALlMemberShipsControllers;
// delete membership
const deleteMemberShipsControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new apiError_1.default(false, 400, 'Id is required');
    }
    const deleteMembership = yield db_1.default.membership.delete({
        where: {
            id,
        },
    });
    if (!deleteMembership) {
        throw new apiError_1.default(false, 400, 'Error on delete membership');
    }
    return res
        .status(200)
        .json(new apiResponse_1.default(true, 200, 'Successsfully deleted membership ', deleteMembership));
}));
exports.deleteMemberShipsControllers = deleteMemberShipsControllers;
// create vlog
const createVlogController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('++++++++++hit');
    const { title, description, mediaType } = req.body;
    const file = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (!file) {
        throw new apiError_1.default(false, 400, 'Media file is required');
    }
    if (!title) {
        throw new apiError_1.default(false, 400, 'Title is required');
    }
    // upload media to Cloudinary
    const uploadedUrl = yield (0, cloudinary_1.uploadToCloudinary)(file);
    // if mediaType is video, generate a thumbnail (optional)
    let thumbnailUrl = null;
    if (mediaType === 'VIDEO') {
        thumbnailUrl = uploadedUrl || null;
    }
    const vlog = yield db_1.default.vlog.create({
        data: {
            title,
            description,
            mediaType: mediaType,
            mediaUrl: uploadedUrl,
            thumbnailUrl,
            isPublished: true,
        },
    });
    res.status(201).json(new apiResponse_1.default(true, 201, 'Vlog created successfully', vlog));
}));
exports.createVlogController = createVlogController;
// delete vlog
const deleteVlogController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const vlog = yield db_1.default.vlog.findUnique({ where: { id } });
    if (!vlog) {
        throw new apiError_1.default(false, 404, 'Vlog not found');
    }
    // delete from Cloudinary (media + optional thumbnail)
    yield (0, cloudinary_1.deleteCloudinaryImage)(vlog.mediaUrl);
    if (vlog.thumbnailUrl) {
        yield (0, cloudinary_1.deleteCloudinaryImage)(vlog.thumbnailUrl);
    }
    // delete from DB
    yield db_1.default.vlog.delete({ where: { id } });
    res.status(200).json(new apiResponse_1.default(true, 200, 'Vlog deleted successfully', null));
}));
exports.deleteVlogController = deleteVlogController;
