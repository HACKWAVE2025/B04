const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const multer = require('multer');
const upload = multer();

// Use multer middleware for file upload
router.post('/identifyCrop', upload.single('images'), workflowController.identifyCrop);
router.get('/marketpriceforecasting', workflowController.getCropPrices);
router.get('/getSoilAndWeather', workflowController.getSoilAndWeather);
router.post('/croprecommendation', workflowController.cropRecommendation);
router.post('/fertilizerrecommendation', workflowController.fertilizerRecommendation);
router.post('/plantdiseaseprediction', upload.single('image'), workflowController.plantDiseasePrediction);
router.get('/weatherreport', workflowController.getWeatherReport);
router.get('/weatherforecast', workflowController.getWeatherForecast);
router.post('/chatbot',upload.single('image'), workflowController.chatBot);
router.post('/yieldprediction', workflowController.yieldPrediction);

module.exports = router;
