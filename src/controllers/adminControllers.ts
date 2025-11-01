import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/apiError';
import { deleteCloudinaryImage, uploadToCloudinary } from '../utils/cloudinary';
import prisma from '../DB/db';
import ApiResponse from '../utils/apiResponse';

// upload / create Temple
const createTempleControllers = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { templeName, address, descriptions } = req.body;
  if (!templeName || !address || !descriptions) {
    throw new ApiError(false, 400, 'Required All field');
  }

  const imgFile = req.file.path;
  if (!imgFile) {
    throw new ApiError(false, 400, 'Image is required');
  }

  const imageUrl = await uploadToCloudinary(imgFile);

  if (!imageUrl) {
    throw new ApiError(false, 400, 'Image is not uploaded to cloudinary');
  }

  const uploadTemple = await prisma.temple.create({
    data: {
      templeName,
      address,
      descriptions,
      image: imageUrl,
    },
  });

  if (!uploadTemple) {
    throw new ApiError(false, 400, 'Failed to upload temple at db');
  }

  res.status(201).json(new ApiResponse(true, 201, 'Successfully added temple to DB', uploadTemple));
});

// delete temple
const deleteTempleControllers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(false, 400, 'Temple id is required');
  }

  const deleteTemple = await prisma.temple.delete({
    where: {
      id,
    },
  });

  if (!deleteTemple) {
    throw new ApiError(false, 400, 'Temple is not deleted');
  }

  res.status(200).json(new ApiResponse(true, 200, 'Temple Deleted Successfully'));
});

// update Temple Details
const updatetempleDetailsControllers = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(false, 400, 'Temple Id is Required');
    }

    const { templeName, address, descriptions } = req.body;

    if (!templeName || !address || !descriptions) {
      throw new ApiError(false, 400, 'All Field is Required');
    }

    const updateTempleDetails = await prisma.temple.update({
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
      throw new ApiError(false, 400, 'Failed to update temple details');
    }

    res
      .status(200)
      .json(
        new ApiResponse(true, 200, 'Successfully Update temple Details to DB', updateTempleDetails)
      );
  }
);

// create news and events
const createNewsAndEventsControllers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { title, eventDate } = req.body;

    if (!title) {
      throw new ApiError(false, 400, 'Title is required');
    }

    const createNewsAndEvents = await prisma.newsAndEvent.create({
      data: {
        title,
        eventDate: new Date(`${eventDate}T00:00:00.000Z`),
      },
    });
    if (!createNewsAndEvents) {
      throw new ApiError(false, 400, 'Failed to create news and events');
    }

    res
      .status(201)
      .json(
        new ApiResponse(true, 201, 'Successfully create news and event to DB', createNewsAndEvents)
      );
  }
);

// delete News and Events
const deleteNewsAndEventsControllers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(false, 400, 'News And Event id is required');
    }

    const deleteTemple = await prisma.newsAndEvent.delete({
      where: {
        id,
      },
    });

    if (!deleteTemple) {
      throw new ApiError(false, 400, 'News And Event is not deleted');
    }

    res.status(200).json(new ApiResponse(true, 200, 'News and Event Deleted Successfully'));
  }
);

// update News and Event Details
const updateNewsAndEventsControllers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, eventDate } = req.body;

    if (!id) {
      throw new ApiError(false, 400, 'News and Event id is required');
    }

    // Prepare update data
    const updateData: any = {};
    if (title) updateData.title = title;
    if (eventDate) updateData.eventDate = new Date(`${eventDate}T00:00:00.000Z`); // ✅ safe conversion

    const updateNews = await prisma.newsAndEvent.update({
      where: { id },
      data: updateData,
    });

    if (!updateNews) {
      throw new ApiError(false, 400, 'Failed to update News and Event');
    }

    res
      .status(200)
      .json(new ApiResponse(true, 200, 'News and Event Updated Successfully', updateNews));
  }
);

// ================= CREATE =================
const createGalleryAndHighlightsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const imgFile = req.file?.path;
    const { types } = req.body;
    console.log('++++++++++++types', types);
    if (!imgFile) {
      throw new ApiError(false, 400, 'Image is required');
    }

    const imageUrl = await uploadToCloudinary(imgFile);

    if (!imageUrl) {
      throw new ApiError(false, 400, 'Image is not uploaded to Cloudinary');
    }

    const validTypes = [
      'globalconferencesandsummits',
      'humanitarianservicemissions',
      'youthandwomanempowerment',
      'culturalandtemplecelebrations',
      'environmentalandeducationprojects',
    ] as const;

    if (types && !validTypes.includes(types)) {
      throw new ApiError(false, 400, 'Invalid gallery type provided');
    }

    const newGallery = await prisma.galleryAndHighLights.create({
      data: {
        image: imageUrl,
        types: types || 'globalconferencesandsummits',
      },
    });

    res
      .status(201)
      .json(new ApiResponse(true, 201, 'Gallery item successfully created', newGallery));
  }
);

// ================= UPDATE =================
const updateGalleryAndHighlightsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { types } = req.body;
    const imgFile = req.file?.path;

    const gallery = await prisma.galleryAndHighLights.findUnique({ where: { id } });
    if (!gallery) {
      throw new ApiError(false, 404, 'Gallery item not found');
    }

    let imageUrl = gallery.image;

    // If new image uploaded, upload to Cloudinary & delete old one
    if (imgFile) {
      const uploadedUrl = await uploadToCloudinary(imgFile);
      if (!uploadedUrl) {
        throw new ApiError(false, 400, 'Image failed to upload to Cloudinary');
      }

      // delete old Cloudinary image
      await deleteCloudinaryImage(gallery.image);
      imageUrl = uploadedUrl;
    }

    const updatedGallery = await prisma.galleryAndHighLights.update({
      where: { id },
      data: {
        image: imageUrl,
        types: types || gallery.types,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(true, 200, 'Gallery item successfully updated', updatedGallery));
  }
);

// ================= DELETE =================
const deleteGalleryAndHighlightsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const gallery = await prisma.galleryAndHighLights.findUnique({ where: { id } });
    if (!gallery) {
      throw new ApiError(false, 404, 'Gallery item not found');
    }

    // delete from Cloudinary
    await deleteCloudinaryImage(gallery.image);

    // delete from DB
    await prisma.galleryAndHighLights.delete({ where: { id } });

    res.status(200).json(new ApiResponse(true, 200, 'Gallery item successfully deleted', null));
  }
);

// =================== FETCH ALL USERS ===================
const getAllUsersController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({
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
    throw new ApiError(false, 404, 'No users found');
  }

  res.status(200).json(new ApiResponse(true, 200, 'Fetched all users successfully', users));
});

// =================== UPDATE USER ===================
const updateUserController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { fullName, phoneNumber, address, role, forVounteer } = req.body;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(false, 404, 'User not found');
  }

  const validRoles = ['user', 'admin', 'volunteer'] as const;
  if (role && !validRoles.includes(role)) {
    throw new ApiError(false, 400, 'Invalid role type provided');
  }

  const updatedUser = await prisma.user.update({
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

  res.status(200).json(new ApiResponse(true, 200, 'User updated successfully', updatedUser));
});

// =================== DELETE USER ===================
const deleteUserController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(false, 404, 'User not found');
  }

  await prisma.user.delete({ where: { id } });

  res.status(200).json(new ApiResponse(true, 200, 'User deleted successfully', null));
});

// get all memberships
const getALlMemberShipsControllers = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const getAllMemberships = await prisma.membership.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!getAllMemberships || getAllMemberships.length < 0) {
      throw new ApiError(false, 400, 'Error on get all membership');
    }

    return res
      .status(200)
      .json(new ApiResponse(true, 200, 'Successsfully get all membership data', getAllMemberships));
  }
);

// delete membership
const deleteMemberShipsControllers = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(false, 400, 'Id is required');
    }

    const deleteMembership = await prisma.membership.delete({
      where: {
        id,
      },
    });

    if (!deleteMembership) {
      throw new ApiError(false, 400, 'Error on delete membership');
    }

    return res
      .status(200)
      .json(new ApiResponse(true, 200, 'Successsfully deleted membership ', deleteMembership));
  }
);

export {
  createTempleControllers,
  deleteTempleControllers,
  updatetempleDetailsControllers,
  createNewsAndEventsControllers,
  deleteNewsAndEventsControllers,
  updateNewsAndEventsControllers,
  createGalleryAndHighlightsController,
  updateGalleryAndHighlightsController,
  deleteGalleryAndHighlightsController,
  getAllUsersController,
  updateUserController,
  deleteUserController,
  getALlMemberShipsControllers,
  deleteMemberShipsControllers,
};
