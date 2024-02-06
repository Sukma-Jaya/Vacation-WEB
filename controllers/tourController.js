const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     });
//   }
//   next();
// };


exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
}


exports.getAllTours = async (req, res) => {

  try {
    // eksekusi kueri
    const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    const tours = await features.query;
    
    // const query = await Tour.find()
    // .where('duration')
    // .equals(5)
    // .where('difficulty')
    // .equals('easy');
    
    // Menampilkan respon
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch(err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });  
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
  // const tour = tours.find(el => el.id === id);

};

exports.createTour = async (req, res) => {
  // const newTour = new Tour({})
  // newTour.save();
  try {
    
    const newTour = await Tour.create(req.body)
  
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: "Invalid data sent!"
    })
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch(err) {
    
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
     await Tour.findByIdAndDelete(req.params.id)
     res.status(204).json({
       status: 'success',
       data: null
     });

  } catch(err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};


exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5} }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingQuantity' },
          avgRating: { $avg: '$ratingAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });

  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};