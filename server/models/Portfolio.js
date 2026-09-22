const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { getStoreMode } = require('../config/db');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: '',
  },
  description: {
    type: String,
    trim: true,
  },
  techStack: [{
    type: String,
    trim: true,
  }],
  githubLink: {
    type: String,
    trim: true,
  },
  liveDemo: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
}, { _id: true });

const ExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    trim: true,
    default: '',
  },
  role: {
    type: String,
    trim: true,
    default: '',
  },
  duration: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
}, { _id: true });

const EducationSchema = new mongoose.Schema({
  institution: {
    type: String,
    trim: true,
    default: '',
  },
  degree: {
    type: String,
    trim: true,
    default: '',
  },
  fieldOfStudy: {
    type: String,
    trim: true,
    default: '',
  },
  duration: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
}, { _id: true });

const PortfolioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9-_]+$/, 'Username can only contain lowercase letters, numbers, hyphens, and underscores'],
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters'],
  },
  title: {
    type: String,
    trim: true,
    default: 'Software Developer',
  },
  bio: {
    type: String,
    trim: true,
    default: '',
  },
  profileImage: {
    type: String,
    trim: true,
    default: '',
  },
  contact: {
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  skills: [{
    type: String,
    trim: true,
  }],
  projects: [ProjectSchema],
  experience: [ExperienceSchema],
  education: [EducationSchema],
  theme: {
    type: String,
    enum: ['modern-dark', 'minimal-light', 'cyberpunk', 'glassmorphism', 'nordic-forest'],
    default: 'modern-dark',
  },
  views: {
    type: Number,
    default: 0,
  },
  resumeUrl: {
    type: String,
    trim: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const MongooseModel = mongoose.model('Portfolio', PortfolioSchema);

// JSON-persisted store fallback for seamless zero-config local execution
const dataDir = path.join(__dirname, '../data');
const dataFile = path.join(dataDir, 'portfolios.json');

const loadMemoryData = () => {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('[MemoryStore] Read error', e);
  }
  return [];
};

const saveMemoryData = (items) => {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dataFile, JSON.stringify(items, null, 2), 'utf-8');
  } catch (e) {
    console.error('[MemoryStore] Write error', e);
  }
};

class MemoryQuery {
  constructor(items) {
    this.items = items;
    this._sortObj = null;
    this._skip = 0;
    this._limit = items.length;
  }

  sort(sortObj) {
    this._sortObj = sortObj;
    return this;
  }

  skip(skipCount) {
    this._skip = skipCount;
    return this;
  }

  limit(limitCount) {
    this._limit = limitCount;
    return this;
  }

  then(resolve, reject) {
    try {
      let result = [...this.items];
      if (this._sortObj?.views === -1) {
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
      }
      const paged = result.slice(this._skip, this._skip + this._limit);
      return Promise.resolve(paged).then(resolve, reject);
    } catch (err) {
      return Promise.reject(err).then(resolve, reject);
    }
  }
}

// Unified Model Interface
class UnifiedPortfolio {
  constructor(data) {
    this.data = {
      ...data,
      views: data.views || 0,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    };

    if (getStoreMode()) {
      if (!this.data._id) {
        this.data._id = 'pf_' + Date.now() + Math.random().toString(36).substring(2, 7);
      }
    } else {
      if (this.data._id && (!mongoose.Types.ObjectId.isValid(this.data._id) || String(this.data._id).startsWith('pf_'))) {
        delete this.data._id;
      }
    }
  }

  async save() {
    if (!getStoreMode()) {
      const docData = { ...this.data };
      if (docData._id && (!mongoose.Types.ObjectId.isValid(docData._id) || String(docData._id).startsWith('pf_'))) {
        delete docData._id;
      }
      if (Array.isArray(docData.projects)) {
        docData.projects = docData.projects.map((p) => {
          const pCopy = { ...p };
          if (pCopy._id && (!mongoose.Types.ObjectId.isValid(pCopy._id) || String(pCopy._id).startsWith('pf_'))) {
            delete pCopy._id;
          }
          return pCopy;
        });
      }
      if (Array.isArray(docData.experience)) {
        docData.experience = docData.experience.map((e) => {
          const eCopy = { ...e };
          if (eCopy._id && (!mongoose.Types.ObjectId.isValid(eCopy._id) || String(eCopy._id).startsWith('pf_'))) {
            delete eCopy._id;
          }
          return eCopy;
        });
      }
      if (Array.isArray(docData.education)) {
        docData.education = docData.education.map((ed) => {
          const edCopy = { ...ed };
          if (edCopy._id && (!mongoose.Types.ObjectId.isValid(edCopy._id) || String(edCopy._id).startsWith('pf_'))) {
            delete edCopy._id;
          }
          return edCopy;
        });
      }
      const doc = new MongooseModel(docData);
      return await doc.save();
    }
    const items = loadMemoryData();
    const existingIndex = items.findIndex((i) => i.username === this.data.username);
    if (existingIndex >= 0) {
      items[existingIndex] = { ...items[existingIndex], ...this.data, updatedAt: new Date().toISOString() };
    } else {
      items.push(this.data);
    }
    saveMemoryData(items);
    return this.data;
  }

  static find(query = {}) {
    if (!getStoreMode()) {
      return MongooseModel.find(query);
    }
    let items = loadMemoryData();

    // Query filters
    if (query.skills) {
      const regex = new RegExp(query.skills.$regex || query.skills, 'i');
      items = items.filter((item) => item.skills && item.skills.some((s) => regex.test(s)));
    }

    if (query.$or) {
      items = items.filter((item) => {
        return query.$or.some((condition) => {
          const field = Object.keys(condition)[0];
          const reg = new RegExp(condition[field].$regex, condition[field].$options || 'i');
          return item[field] && reg.test(item[field]);
        });
      });
    }

    return new MemoryQuery(items);
  }

  static async countDocuments(query = {}) {
    if (!getStoreMode()) {
      return await MongooseModel.countDocuments(query);
    }
    const items = loadMemoryData();
    return items.length;
  }

  static async findOne(query) {
    if (!getStoreMode()) {
      return await MongooseModel.findOne(query);
    }
    const items = loadMemoryData();
    if (query.username) {
      return items.find((i) => i.username === query.username.toLowerCase()) || null;
    }
    return items[0] || null;
  }

  static async findOneAndUpdate(query, update, options = {}) {
    if (!getStoreMode()) {
      return await MongooseModel.findOneAndUpdate(query, update, options);
    }
    const items = loadMemoryData();
    const idx = items.findIndex((i) => i.username === query.username.toLowerCase());
    if (idx === -1) return null;

    let target = { ...items[idx] };
    if (update.$inc?.views) {
      target.views = (target.views || 0) + update.$inc.views;
    }
    if (update.$set) {
      target = { ...target, ...update.$set };
    }
    target.updatedAt = new Date().toISOString();
    items[idx] = target;
    saveMemoryData(items);
    return target;
  }

  static async findOneAndDelete(query) {
    if (!getStoreMode()) {
      return await MongooseModel.findOneAndDelete(query);
    }
    const items = loadMemoryData();
    const idx = items.findIndex((i) => i.username === query.username.toLowerCase());
    if (idx === -1) return null;
    const deleted = items.splice(idx, 1)[0];
    saveMemoryData(items);
    return deleted;
  }

  static async insertMany(docs) {
    if (!getStoreMode()) {
      const sanitizedDocs = docs.map((d) => {
        const copy = { ...d };
        if (copy._id && (!mongoose.Types.ObjectId.isValid(copy._id) || String(copy._id).startsWith('pf_'))) {
          delete copy._id;
        }
        return copy;
      });
      return await MongooseModel.insertMany(sanitizedDocs);
    }
    const items = loadMemoryData();
    const formatted = docs.map((d) => ({
      _id: d._id || 'pf_' + Date.now() + Math.random().toString(36).substring(2, 7),
      ...d,
      views: d.views || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    items.push(...formatted);
    saveMemoryData(items);
    return formatted;
  }
}

module.exports = UnifiedPortfolio;
