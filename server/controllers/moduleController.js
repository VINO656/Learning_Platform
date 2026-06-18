import Module from '../models/Module.js';
import User from '../models/User.js';

export const getModules = async (req, res) => {
  try {
    // Basic search/filter functionality
    const keyword = req.query.keyword ? {
      title: { $regex: req.query.keyword, $options: 'i' }
    } : {};

    const track = req.query.track ? { track: req.query.track } : {};

    const modules = await Module.find({ ...keyword, ...track }).populate('instructor', 'name');
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createModule = async (req, res) => {
  try {
    const { title, description, track } = req.body;
    
    // Determine asset types and URLs
    const assets = [];
    if (req.files) {
      for (const file of req.files) {
        let type = 'image';
        if (file.mimetype.includes('pdf')) type = 'pdf';
        if (file.mimetype.includes('video') || file.mimetype.includes('mp4')) type = 'video';
        
        assets.push({
          assetUrl: file.path,
          assetType: type,
          title: file.originalname
        });
      }
    }

    const newModule = new Module({
      title,
      description,
      track,
      instructor: req.user._id,
      assets
    });

    const createdModule = await newModule.save();
    res.status(201).json(createdModule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const moduleItem = await Module.findById(req.params.id);
    if (moduleItem) {
      await moduleItem.deleteOne();
      res.json({ message: 'Module removed' });
    } else {
      res.status(404).json({ message: 'Module not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleModuleCompletion = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const moduleId = req.params.id;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isCompleted = user.completedModules.includes(moduleId);

    if (isCompleted) {
      // Unmark completion
      user.completedModules = user.completedModules.filter(
        id => id.toString() !== moduleId.toString()
      );
    } else {
      // Mark completion
      user.completedModules.push(moduleId);
    }

    await user.save();
    res.json({ completedModules: user.completedModules });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
