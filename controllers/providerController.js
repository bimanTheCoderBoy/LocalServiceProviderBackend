const Service = require('../models/Service');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createService = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    price,
    location_latitude,
    location_longitude,
    address,
    parent_service
  } = req.body;

  // Validate required fields
  if (!name || !price || !location_latitude || !location_longitude || !address) {
    return next(new AppError('Please provide all required fields', 400));
  }

  // Validate coordinates
  if (isNaN(location_latitude) || isNaN(location_longitude)) {
    return next(new AppError('Invalid coordinates', 400));
  }

  // Validate price
  if (price <= 0) {
    return next(new AppError('Price must be greater than 0', 400));
  }

  // Check parent service exists if provided
  if (parent_service) {
    const parentService = await Service.findById(parent_service);
    if (!parentService) {
      return next(new AppError('Parent service not found', 404));
    }
  }

  // Create new service
  const newService = await Service.create({
    name,
    description,
    price,
    provider: req.user.id,
    location: {
      type: 'Point',
      coordinates: [
        parseFloat(location_longitude),
        parseFloat(location_latitude)
      ]
    },
    address,
    parent_service
  });

  res.status(201).json({
    status: 'success',
    message: 'Service created successfully',
    service_id: newService._id
  });
});