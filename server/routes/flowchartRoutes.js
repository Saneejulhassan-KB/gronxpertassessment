const express = require('express');
const router = express.Router();
const {
  createFlowchart,
  getFlowcharts,
  getFlowchart,
  updateFlowchart,
  deleteFlowchart
} = require('../controllers/flowchartController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', createFlowchart);
router.get('/', getFlowcharts);
router.get('/:id', getFlowchart);
router.put('/:id', updateFlowchart);
router.delete('/:id', deleteFlowchart);

module.exports = router; 