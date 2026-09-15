const Portfolio = require('../models/Portfolio');

// @desc    Create a new portfolio
// @route   POST /api/portfolio
// @access  Public
const createPortfolio = async (req, res, next) => {
  try {
    const {
      username,
      fullName,
      title,
      bio,
      profileImage,
      contact,
      skills,
      projects,
      experience,
      theme,
      resumeUrl,
    } = req.body;

    // Check if username already exists
    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }

    const cleanUsername = username.toLowerCase().trim();

    // Regex check for safe URL characters
    if (!/^[a-z0-9-_]+$/.test(cleanUsername)) {
      return res.status(400).json({
        success: false,
        message: 'Username can only contain alphanumeric characters, hyphens, and underscores',
      });
    }

    const existing = await Portfolio.findOne({ username: cleanUsername });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Username "${cleanUsername}" is already taken. Please choose another one.`,
      });
    }

    if (!fullName || fullName.trim() === '') {
      return res.status(400).json({ success: false, message: 'Full name is required' });
    }

    const newPortfolio = new Portfolio({
      username: cleanUsername,
      fullName: fullName.trim(),
      title: title || 'Software Developer',
      bio: bio || '',
      profileImage: profileImage || '',
      contact: contact || {},
      skills: Array.isArray(skills) ? skills.filter(Boolean) : [],
      projects: Array.isArray(projects) ? projects : [],
      experience: Array.isArray(experience) ? experience : [],
      theme: theme || 'modern-dark',
      resumeUrl: resumeUrl || '',
    });

    const saved = await newPortfolio.save();
    return res.status(201).json({
      success: true,
      message: 'Portfolio created successfully',
      data: saved,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A portfolio with this username already exists',
      });
    }
    next(error);
  }
};

// @desc    Get portfolio by username
// @route   GET /api/portfolio/:username
// @access  Public
const getPortfolioByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { incrementView } = req.query;

    const cleanUsername = username.toLowerCase().trim();

    let portfolio;
    // If incrementView is true (or undefined/not explicitly 'false')
    if (incrementView !== 'false') {
      portfolio = await Portfolio.findOneAndUpdate(
        { username: cleanUsername },
        { $inc: { views: 1 } },
        { new: true }
      );
    } else {
      portfolio = await Portfolio.findOne({ username: cleanUsername });
    }

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: `Portfolio with username "${cleanUsername}" not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing portfolio
// @route   PUT /api/portfolio/:username
// @access  Public
const updatePortfolio = async (req, res, next) => {
  try {
    const { username } = req.params;
    const cleanUsername = username.toLowerCase().trim();

    const existing = await Portfolio.findOne({ username: cleanUsername });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Portfolio with username "${cleanUsername}" does not exist.`,
      });
    }

    const {
      fullName,
      title,
      bio,
      profileImage,
      contact,
      skills,
      projects,
      experience,
      theme,
      resumeUrl,
    } = req.body;

    if (fullName !== undefined && (!fullName || fullName.trim() === '')) {
      return res.status(400).json({ success: false, message: 'Full name cannot be empty' });
    }

    const updatedData = {
      ...(fullName !== undefined && { fullName: fullName.trim() }),
      ...(title !== undefined && { title }),
      ...(bio !== undefined && { bio }),
      ...(profileImage !== undefined && { profileImage }),
      ...(contact !== undefined && { contact }),
      ...(skills !== undefined && { skills: Array.isArray(skills) ? skills.filter(Boolean) : [] }),
      ...(projects !== undefined && { projects: Array.isArray(projects) ? projects : [] }),
      ...(experience !== undefined && { experience: Array.isArray(experience) ? experience : [] }),
      ...(theme !== undefined && { theme }),
      ...(resumeUrl !== undefined && { resumeUrl }),
    };

    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { username: cleanUsername },
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Portfolio updated successfully',
      data: updatedPortfolio,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a portfolio
// @route   DELETE /api/portfolio/:username
// @access  Public
const deletePortfolio = async (req, res, next) => {
  try {
    const { username } = req.params;
    const cleanUsername = username.toLowerCase().trim();

    const deleted = await Portfolio.findOneAndDelete({ username: cleanUsername });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Portfolio with username "${cleanUsername}" not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Portfolio "${cleanUsername}" was successfully deleted.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all public portfolios (for showcase & explore)
// @route   GET /api/portfolio or /api/portfolios
// @access  Public
const getAllPortfolios = async (req, res, next) => {
  try {
    const { search, skill, limit = 20, page = 1 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    if (skill) {
      query.skills = { $regex: skill, $options: 'i' };
    }

    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    const [portfolios, total] = await Promise.all([
      Portfolio.find(query)
        .sort({ views: -1, createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit),
      Portfolio.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: portfolios.length,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      data: portfolios,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check username availability
// @route   GET /api/portfolio/check/:username
// @access  Public
const checkUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const cleanUsername = username.toLowerCase().trim();

    if (!cleanUsername || cleanUsername.length < 3) {
      return res.status(200).json({
        available: false,
        message: 'Username must be at least 3 characters long',
      });
    }

    if (!/^[a-z0-9-_]+$/.test(cleanUsername)) {
      return res.status(200).json({
        available: false,
        message: 'Username can only contain alphanumeric characters, hyphens, and underscores',
      });
    }

    const existing = await Portfolio.findOne({ username: cleanUsername });
    return res.status(200).json({
      available: !existing,
      message: existing ? 'Username is already taken' : 'Username is available!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPortfolio,
  getPortfolioByUsername,
  updatePortfolio,
  deletePortfolio,
  getAllPortfolios,
  checkUsername,
};
