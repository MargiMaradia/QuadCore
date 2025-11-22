const express = require('express');
const router = express.Router();
const {
  getDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  updatePicking,
  updatePacking,
  completeDelivery,
  deleteDelivery
} = require('../controllers/deliveryController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getDeliveries)
  .post(protect, createDelivery);

router.route('/:id')
  .get(protect, getDelivery)
  .put(protect, updateDelivery)
  .delete(protect, deleteDelivery);

router.put('/:id/pick', protect, updatePicking);
router.put('/:id/pack', protect, updatePacking);
router.put('/:id/complete', protect, completeDelivery);

module.exports = router;

