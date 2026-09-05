const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  toggleServiceStatus,
  deleteService
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', protect('admin'), createService);
router.patch('/:id', protect('admin'), updateService);
router.patch('/:id/status', protect('admin'), toggleServiceStatus);
router.delete('/:id', protect('admin'), deleteService);

module.exports = router;
