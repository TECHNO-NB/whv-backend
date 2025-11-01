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
exports.getAllVlogsController = exports.verifyUserControllers = exports.getTempleByIdController = exports.getAllTempleController = exports.createMembershipControllers = exports.getAllGalleryAndHighlightsControllers = exports.getAllNewsAndEventsControllers = exports.loginUserControllers = exports.registerVolunteerControllers = exports.registerUserControllers = exports.logoutUserControllers = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const db_1 = __importDefault(require("../DB/db"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const generateJwtTokens_1 = __importDefault(require("../helpers/generateJwtTokens"));
const cookieOption_1 = require("../helpers/cookieOption");
const cloudinary_1 = require("../utils/cloudinary");
const hash_1 = require("../utils/hash");
// user register
const registerUserControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, fullName, address, password } = req.body;
    if (!email || !phoneNumber || !fullName || !password || !address) {
        throw new apiError_1.default(false, 400, 'Please fill the all required field');
    }
    const alreadyRegisterUser = yield db_1.default.user.findUnique({ where: { email: email } });
    if (alreadyRegisterUser) {
        throw new apiError_1.default(false, 409, 'User already register with this email');
    }
    const hashedPassword = yield (0, hash_1.hashPassword)(password);
    if (!hashedPassword) {
        throw new apiError_1.default(false, 500, 'Password hash failed');
    }
    const userData = {
        email: email,
        fullName: fullName,
        phoneNumber,
        address,
        password: hashedPassword,
    };
    const createUser = yield db_1.default.user.create({
        data: userData,
    });
    if (!createUser) {
        throw new apiError_1.default(false, 500, 'User register failed');
    }
    return res.status(201).json(new apiResponse_1.default(true, 201, 'User register successfully', createUser));
}));
exports.registerUserControllers = registerUserControllers;
// volunteer register
const registerVolunteerControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, phoneNumber, fullName, address, password } = req.body;
    const avatar = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    if (!avatar) {
        throw new apiError_1.default(false, 400, 'Avatar is required');
    }
    if (!email || !phoneNumber || !fullName || !password || !address) {
        throw new apiError_1.default(false, 400, 'Please fill the all required field');
    }
    const alreadyRegisterUser = yield db_1.default.user.findUnique({ where: { email: email } });
    if (alreadyRegisterUser) {
        throw new apiError_1.default(false, 409, 'User already register with this email');
    }
    const hashedPassword = yield (0, hash_1.hashPassword)(password);
    if (!hashedPassword) {
        throw new apiError_1.default(false, 500, 'Password hash failed');
    }
    const cloudinaryUrl = yield (0, cloudinary_1.uploadToCloudinary)(avatar);
    if (!cloudinaryUrl) {
        throw new apiError_1.default(false, 500, 'Avatar upload failed');
    }
    const userData = {
        email: email,
        fullName: fullName,
        phoneNumber,
        address,
        avatar: cloudinaryUrl,
        forVolunteer: true,
        password: hashedPassword,
    };
    const createUser = yield db_1.default.user.create({
        data: userData,
    });
    if (!createUser) {
        throw new apiError_1.default(false, 500, 'User register failed');
    }
    return res
        .status(201)
        .json(new apiResponse_1.default(true, 201, 'User register successfully', createUser));
}));
exports.registerVolunteerControllers = registerVolunteerControllers;
// login user
const loginUserControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new apiError_1.default(false, 400, 'Please fill the all required field');
    }
    const user = yield db_1.default.user.findUnique({ where: { email: email } });
    if (!user || !user.password) {
        throw new apiError_1.default(false, 404, 'User not found');
    }
    const isPasswordMatch = yield (0, hash_1.comparePassword)(password, user.password);
    if (!isPasswordMatch) {
        throw new apiError_1.default(false, 400, 'Invalid password');
    }
    const dataOfUser = {
        id: user === null || user === void 0 ? void 0 : user.id,
        email: user === null || user === void 0 ? void 0 : user.email,
        fullName: user === null || user === void 0 ? void 0 : user.fullName,
        phoneNumber: user === null || user === void 0 ? void 0 : user.phoneNumber,
    };
    const generateJwtToken = yield (0, generateJwtTokens_1.default)(dataOfUser);
    if (!generateJwtToken.accessToken || !generateJwtToken.refreshToken) {
        throw new apiError_1.default(false, 500, 'Jwt Token Generate failed');
    }
    return res
        .cookie('accessToken', generateJwtToken.accessToken, cookieOption_1.cookieOptions)
        .cookie('refreshToken', generateJwtToken.refreshToken, cookieOption_1.cookieOptions)
        .status(200)
        .json(new apiResponse_1.default(true, 200, 'User login successfully', user));
}));
exports.loginUserControllers = loginUserControllers;
// logout user
const logoutUserControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res
        .status(200)
        .clearCookie('accessToken', cookieOption_1.cookieOptions)
        .clearCookie('refreshToken', cookieOption_1.cookieOptions)
        .json(new apiResponse_1.default(true, 200, 'User logout successfully'));
}));
exports.logoutUserControllers = logoutUserControllers;
// get All News And Events
const getAllNewsAndEventsControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getAllNewsAndEvents = yield db_1.default.newsAndEvent.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        take: 5,
    });
    if (!getAllNewsAndEvents || getAllNewsAndEvents.length < 0) {
        throw new apiError_1.default(false, 400, 'Nothing event and news found');
    }
    res
        .status(200)
        .json(new apiResponse_1.default(true, 200, 'Successfully get all news and event', getAllNewsAndEvents));
}));
exports.getAllNewsAndEventsControllers = getAllNewsAndEventsControllers;
// get all Gallery And Highlights
const getAllGalleryAndHighlightsControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const types = [
        'globalconferencesandsummits',
        'humanitarianservicemissions',
        'youthandwomanempowerment',
        'culturalandtemplecelebrations',
        'environmentalandeducationprojects',
    ];
    const results = yield Promise.all(types.map((type) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield db_1.default.galleryAndHighLights.findMany({
            where: { types: type },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        return { type, data };
    })));
    const hasData = results.some((item) => item.data.length > 0);
    if (!hasData) {
        throw new apiError_1.default(false, 400, 'No gallery or highlights found');
    }
    res
        .status(200)
        .json(new apiResponse_1.default(true, 200, 'Successfully fetched all gallery and highlights', results));
}));
exports.getAllGalleryAndHighlightsControllers = getAllGalleryAndHighlightsControllers;
// =================== FETCH ALL Temples ===================
const getAllTempleController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const temple = yield db_1.default.temple.findMany({
        orderBy: { createdAt: 'desc' },
    });
    if (!temple || temple.length === 0) {
        throw new apiError_1.default(false, 404, 'No users found');
    }
    res.status(200).json(new apiResponse_1.default(true, 200, 'Fetched all temple successfully', temple));
}));
exports.getAllTempleController = getAllTempleController;
// fetch temple by id
const getTempleByIdController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new apiError_1.default(false, 400, 'Id not found');
    }
    const temple = yield db_1.default.temple.findUnique({
        where: {
            id,
        },
    });
    if (!temple) {
        throw new apiError_1.default(false, 404, 'No temple found');
    }
    res.status(200).json(new apiResponse_1.default(true, 200, 'Fetched  temple successfully', temple));
}));
exports.getTempleByIdController = getTempleByIdController;
// Create membership
const createMembershipControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, fatherName, occupation, address, contactNumber, membershipTier } = req.body;
    const imageurl = req.file.path;
    if (!fullName || !fatherName || !occupation || !address || !contactNumber || !membershipTier) {
        throw new apiError_1.default(false, 400, 'Required to fill all field');
    }
    if (!imageurl) {
        throw new apiError_1.default(false, 400, 'Image is required');
    }
    const cloudinaryUrl = yield (0, cloudinary_1.uploadToCloudinary)(imageurl);
    if (!cloudinaryUrl) {
        throw new apiError_1.default(false, 400, 'Failed to upload in cloudinary');
    }
    const createMembership = yield db_1.default.membership.create({
        data: {
            fullName,
            fatherName,
            occupation,
            address,
            contactNumber,
            membershipTier: membershipTier.toUpperCase(),
            photoUrl: cloudinaryUrl,
        },
    });
    if (!createMembership) {
        throw new apiError_1.default(false, 400, 'Error to create membership');
    }
    return res.status(200).json(new apiResponse_1.default(true, 201, 'Membership created successfully'));
}));
exports.createMembershipControllers = createMembershipControllers;
// verify user
const verifyUserControllers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const user = req.user;
    if (!user.id) {
        throw new apiError_1.default(false, 401, 'Id is required');
    }
    const findUser = yield db_1.default.user.findUnique({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
        select: {
            id: true,
            email: true,
            phoneNumber: true,
            fullName: true,
            avatar: true,
            role: true,
            forVolunteer: true,
        },
    });
    const dataOfUser = {
        id: findUser === null || findUser === void 0 ? void 0 : findUser.id,
        email: findUser === null || findUser === void 0 ? void 0 : findUser.email,
        fullName: findUser === null || findUser === void 0 ? void 0 : findUser.fullName,
        phoneNumber: findUser === null || findUser === void 0 ? void 0 : findUser.phoneNumber,
    };
    const generateJwtToken = yield (0, generateJwtTokens_1.default)(dataOfUser);
    if (!generateJwtToken.accessToken || !generateJwtToken.refreshToken) {
        throw new apiError_1.default(false, 500, 'Jwt Token Generate failed');
    }
    return res
        .cookie('accessToken', generateJwtToken.accessToken, cookieOption_1.cookieOptions)
        .cookie('refreshToken', generateJwtToken.refreshToken, cookieOption_1.cookieOptions)
        .status(201)
        .json(new apiResponse_1.default(true, 201, 'User verify successfully', findUser));
}));
exports.verifyUserControllers = verifyUserControllers;
// get all vlog
const getAllVlogsController = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vlogs = yield db_1.default.vlog.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
    });
    res
        .status(200)
        .json(new apiResponse_1.default(true, 200, "Fetched all vlogs successfully", vlogs));
}));
exports.getAllVlogsController = getAllVlogsController;
