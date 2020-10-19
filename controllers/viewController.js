const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');

//Functions

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) GET TOUR DATA FROM COLLECTION
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new appError('There is no tour whit that name.', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'log into your account',
  });
};

exports.getMyTours = catchAsync( async (req, res, next) => {
    const bookings = await Booking.find({user: req.user.id})

    const tourIDs = bookings.map((el) => el.tour.id);

    const tours = await Tour.find({ _id:{$in: tourIDs}
    });
    res.status(200).render('overview', {
      title: 'My Tours',
      tours
    })
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUSer = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    title: 'Your Account',
    user: updatedUSer,
  });
});
