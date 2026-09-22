const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  createPortfolio,
  getPortfolioByUsername,
  updatePortfolio,
  deletePortfolio,
  getAllPortfolios,
  checkUsername,
  sendPortfolioMessage,
} = require('../controllers/portfolioController');

// All Portfolios & Creation
router.route('/')
  .get(getAllPortfolios)
  .post(createPortfolio);

// Check username availability
router.get('/check/:username', checkUsername);

// Send message to portfolio owner via Email
router.post('/:username/contact', sendPortfolioMessage);

// File upload (image/resume)
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file' });
  }

  // Construct accessible URL
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  return res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
});

// Single Portfolio by Username
router.route('/:username')
  .get(getPortfolioByUsername)
  .put(updatePortfolio)
  .delete(deletePortfolio);

module.exports = router;
