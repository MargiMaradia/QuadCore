const express = require('express');
const router = express.Router();
const {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation
} = require('../controllers/locationController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getLocations)
  .post(protect, authorize('inventory_manager'), createLocation);

router.route('/:id')
  .get(protect, getLocation)
  .put(protect, authorize('inventory_manager'), updateLocation)
  .delete(protect, authorize('inventory_manager'), deleteLocation);

module.exports = router;

