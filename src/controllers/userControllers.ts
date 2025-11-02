import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/apiError';
import prisma from '../DB/db';
import ApiResponse from '../utils/apiResponse';
import generateRefreshAcessToken from '../helpers/generateJwtTokens';
import { cookieOptions } from '../helpers/cookieOption';
import { uploadToCloudinary } from '../utils/cloudinary';
import { comparePassword, hashPassword } from '../utils/hash';

// user register
const registerUserControllers = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { email, phoneNumber, fullName, address, password } = req.body;

  if (!email || !phoneNumber || !fullName || !password || !address) {
    throw new ApiError(false, 400, 'Please fill the all required field');
  }
  const alreadyRegisterUser = await prisma.user.findUnique({ where: { email: email } });
  if (alreadyRegisterUser) {
    throw new ApiError(false, 409, 'User already register with this email');
  }
  const hashedPassword = await hashPassword(password);
  if (!hashedPassword) {
    throw new ApiError(false, 500, 'Password hash failed');
  }

  const userData = {
    email: email,
    fullName: fullName,
    phoneNumber,
    address,
    password: hashedPassword,
  };
  const createUser = await prisma.user.create({
    data: userData,
  });
  if (!createUser) {
    throw new ApiError(false, 500, 'User register failed');
  }
  return res.status(201).json(new ApiResponse(true, 201, 'User register successfully', createUser));
});

// volunteer register
const registerVolunteerControllers = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { email, phoneNumber, fullName, address, password } = req.body;
    const avatar = req.file?.path;
    if (!avatar) {
      throw new ApiError(false, 400, 'Avatar is required');
    }

    if (!email || !phoneNumber || !fullName || !password || !address) {
      throw new ApiError(false, 400, 'Please fill the all required field');
    }
    const alreadyRegisterUser = await prisma.user.findUnique({ where: { email: email } });
    if (alreadyRegisterUser) {
      throw new ApiError(false, 409, 'User already register with this email');
    }
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      throw new ApiError(false, 500, 'Password hash failed');
    }

    const cloudinaryUrl = await uploadToCloudinary(avatar);

    if (!cloudinaryUrl) {
      throw new ApiError(false, 500, 'Avatar upload failed');
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
    const createUser = await prisma.user.create({
      data: userData,
    });
    if (!createUser) {
      throw new ApiError(false, 500, 'User register failed');
    }
    return res
      .status(201)
      .json(new ApiResponse(true, 201, 'User register successfully', createUser));
  }
);

// login user
const loginUserControllers = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(false, 400, 'Please fill the all required field');
  }
  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user || !user.password) {
    throw new ApiError(false, 404, 'User not found');
  }
  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(false, 400, 'Invalid password');
  }
  const dataOfUser = {
    id: user?.id,
    email: user?.email,
    fullName: user?.fullName,
    phoneNumber: user?.phoneNumber,
  };
  const generateJwtToken = await generateRefreshAcessToken(dataOfUser);
  if (!generateJwtToken.accessToken || !generateJwtToken.refreshToken) {
    throw new ApiError(false, 500, 'Jwt Token Generate failed');
  }
  return res
    .cookie('accessToken', generateJwtToken.accessToken, cookieOptions)
    .cookie('refreshToken', generateJwtToken.refreshToken, cookieOptions)
    .status(200)
    .json(new ApiResponse(true, 200, 'User login successfully', user));
});

// logout user
const logoutUserControllers = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(true, 200, 'User logout successfully'));
});

// get All News And Events
const getAllNewsAndEventsControllers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const getAllNewsAndEvents = await prisma.newsAndEvent.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    if (!getAllNewsAndEvents || getAllNewsAndEvents.length < 0) {
      throw new ApiError(false, 400, 'Nothing event and news found');
    }

    res
      .status(200)
      .json(new ApiResponse(true, 200, 'Successfully get all news and event', getAllNewsAndEvents));
  }
);

// get all Gallery And Highlights
const getAllGalleryAndHighlightsControllers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const types = [
      'globalconferencesandsummits',
      'humanitarianservicemissions',
      'youthandwomanempowerment',
      'culturalandtemplecelebrations',
      'environmentalandeducationprojects',
    ] as const;

    const results = await Promise.all(
      types.map(async (type) => {
        const data = await prisma.galleryAndHighLights.findMany({
          where: { types: type as any },
          orderBy: { createdAt: 'desc' },
          take: 5,
        });
        return { type, data };
      })
    );

    const hasData = results.some((item) => item.data.length > 0);
    if (!hasData) {
      throw new ApiError(false, 400, 'No gallery or highlights found');
    }

    res
      .status(200)
      .json(new ApiResponse(true, 200, 'Successfully fetched all gallery and highlights', results));
  }
);

// =================== FETCH ALL Temples ===================
const getAllTempleController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const temple = await prisma.temple.findMany({
    orderBy: { createdAt: 'desc' },
  });

  if (!temple || temple.length === 0) {
    throw new ApiError(false, 404, 'No users found');
  }

  res.status(200).json(new ApiResponse(true, 200, 'Fetched all temple successfully', temple));
});

// fetch temple by id
const getTempleByIdController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(false, 400, 'Id not found');
  }
  const temple = await prisma.temple.findUnique({
    where: {
      id,
    },
  });

  if (!temple ) {
    throw new ApiError(false, 404, 'No temple found');
  }

  res.status(200).json(new ApiResponse(true, 200, 'Fetched  temple successfully', temple));
});

// Create membership
const createMembershipControllers = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { fullName, fatherName, occupation, address, contactNumber, membershipTier } = req.body;
    const imageurl = req.file.path;

    if (!fullName || !fatherName || !occupation || !address || !contactNumber || !membershipTier) {
      throw new ApiError(false, 400, 'Required to fill all field');
    }

    if (!imageurl) {
      throw new ApiError(false, 400, 'Image is required');
    }

    const cloudinaryUrl = await uploadToCloudinary(imageurl);

    if (!cloudinaryUrl) {
      throw new ApiError(false, 400, 'Failed to upload in cloudinary');
    }

    const createMembership = await prisma.membership.create({
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
      throw new ApiError(false, 400, 'Error to create membership');
    }

    return res.status(200).json(new ApiResponse(true, 201, 'Membership created successfully'));
  }
);

// verify user
const verifyUserControllers = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  // @ts-ignore
  const user = req.user;
  if (!user.id) {
    throw new ApiError(false, 401, 'Id is required');
  }

  const findUser = await prisma.user.findUnique({
    where: {
      id: user?.id,
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
    id: findUser?.id,
    email: findUser?.email,
    fullName: findUser?.fullName,
    phoneNumber: findUser?.phoneNumber,
  };
  const generateJwtToken = await generateRefreshAcessToken(dataOfUser);
  if (!generateJwtToken.accessToken || !generateJwtToken.refreshToken) {
    throw new ApiError(false, 500, 'Jwt Token Generate failed');
  }
  return res
    .cookie('accessToken', generateJwtToken.accessToken, cookieOptions)
    .cookie('refreshToken', generateJwtToken.refreshToken, cookieOptions)
    .status(201)
    .json(new ApiResponse(true, 201, 'User verify successfully', findUser));
});


// get all vlog
const getAllVlogsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const vlogs = await prisma.vlog.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });

    res
      .status(200)
      .json(new ApiResponse(true, 200, "Fetched all vlogs successfully", vlogs));
  }
);

// get one vlog
const getOneVlogController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json(new ApiResponse(false, 400, "Vlog ID is required"));
      return;
    }

    const vlog = await prisma.vlog.findUnique({
      where: { id },
    });

    if (!vlog || !vlog.isPublished) {
      res.status(404).json(new ApiResponse(false, 404, "Vlog not found"));
      return;
    }

    res
      .status(200)
      .json(new ApiResponse(true, 200, "Fetched vlog successfully", vlog));
  }
);


// ✅ Fetch NGOs
const getAllNgos = async (req: Request, res: Response) => {
  try {
    const ngos = await prisma.ngo.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ success: true, data: ngos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch NGOs" });
  }
};

export {
  logoutUserControllers,
  registerUserControllers,
  registerVolunteerControllers,
  loginUserControllers,
  getAllNewsAndEventsControllers,
  getAllGalleryAndHighlightsControllers,
  createMembershipControllers,
  getAllTempleController,
  getTempleByIdController,
  verifyUserControllers,
  getAllVlogsController,
  getOneVlogController,
  getAllNgos
};
