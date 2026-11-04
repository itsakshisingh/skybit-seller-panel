// HeroAction CRUD
export const getHeroAction = async (req, res) => {
  try {
    const doc = await InstallationAction.findOne();
    res.status(200).json(doc ? doc.heroAction : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createHeroAction = async (req, res) => {
  try {
    const { subtitle, title, desp } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    let doc = await InstallationAction.findOne();
    if (!doc) {
      doc = await InstallationAction.create({ heroAction: { subtitle, title, desp, img } });
    } else {
      doc.heroAction = { subtitle, title, desp, img };
      await doc.save();
    }
    res.status(201).json(doc.heroAction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateHeroAction = async (req, res) => {
  try {
    const { subtitle, title, desp } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await InstallationAction.findOneAndUpdate(
      {},
      { 'heroAction.subtitle': subtitle, 'heroAction.title': title, 'heroAction.desp': desp, 'heroAction.img': img },
      { new: true }
    );
    res.status(200).json(doc.heroAction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteHeroAction = async (req, res) => {
  try {
    const doc = await InstallationAction.findOneAndUpdate(
      {},
      { $unset: { heroAction: 1 } },
      { new: true }
    );
    res.status(200).json({ message: 'HeroAction deleted', heroAction: doc.heroAction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GalleryImgs CRUD
export const getGalleryImgs = async (req, res) => {
  try {
    const doc = await InstallationAction.findOne();
    res.status(200).json(doc ? doc.galleryImgs : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addGalleryImg = async (req, res) => {
  try {
    const { name } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await InstallationAction.findOneAndUpdate(
      {},
      { $push: { galleryImgs: { img, name } } },
      { new: true }
    );
    res.status(201).json(doc.galleryImgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateGalleryImg = async (req, res) => {
  try {
    const { imgId } = req.params;
    const { name } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await InstallationAction.findOne();
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    const galleryImg = doc.galleryImgs.id(imgId);
    if (!galleryImg) return res.status(404).json({ error: 'GalleryImg not found' });
    galleryImg.img = img;
    galleryImg.name = name;
    await doc.save();
    res.status(200).json(galleryImg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGalleryImg = async (req, res) => {
  try {
    const { imgId } = req.params;
    const doc = await InstallationAction.findOne();
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    doc.galleryImgs.id(imgId).remove();
    await doc.save();
    res.status(200).json({ message: 'GalleryImg deleted', galleryImgs: doc.galleryImgs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VideoBanner CRUD
export const getVideoBanner = async (req, res) => {
  try {
    const doc = await InstallationAction.findOne();
    res.status(200).json(doc ? doc.videoBanner : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createVideoBanner = async (req, res) => {
  try {
    const { title, description } = req.body;
    let video = req.file ? req.file.filename : req.body.video;
    if (video && !video.startsWith('uploads/videos/')) video = 'uploads/videos/' + video;
    let doc = await InstallationAction.findOne();
    if (!doc) {
      doc = await InstallationAction.create({ videoBanner: { video, title, description } });
    } else {
      doc.videoBanner = { video, title, description };
      await doc.save();
    }
    res.status(201).json(doc.videoBanner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateVideoBanner = async (req, res) => {
  try {
    const { title, description } = req.body;
    let video = req.file ? req.file.filename : req.body.video;
    if (video && !video.startsWith('uploads/videos/')) video = 'uploads/videos/' + video;
    const doc = await InstallationAction.findOneAndUpdate(
      {},
      { 'videoBanner.video': video, 'videoBanner.title': title, 'videoBanner.description': description },
      { new: true }
    );
    res.status(200).json(doc.videoBanner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteVideoBanner = async (req, res) => {
  try {
    const doc = await InstallationAction.findOneAndUpdate(
      {},
      { $unset: { videoBanner: 1 } },
      { new: true }
    );
    res.status(200).json({ message: 'VideoBanner deleted', videoBanner: doc.videoBanner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
import InstallationAction from '../models/InstallationAction.js';

// Stats CRUD
export const getStats = async (req, res) => {
  try {
    const doc = await InstallationAction.findOne();
    res.status(200).json(doc ? doc.stats : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createStats = async (req, res) => {
  try {
    const { cities, installations, mw, states } = req.body;
    let doc = await InstallationAction.findOne();
    if (!doc) {
      doc = await InstallationAction.create({ stats: { cities, installations, mw, states } });
    } else {
      doc.stats = { cities, installations, mw, states };
      await doc.save();
    }
    res.status(201).json(doc.stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStats = async (req, res) => {
  try {
    const { cities, installations, mw, states } = req.body;
    const doc = await InstallationAction.findOneAndUpdate(
      {},
      { 'stats.cities': cities, 'stats.installations': installations, 'stats.mw': mw, 'stats.states': states },
      { new: true }
    );
    res.status(200).json(doc.stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteStats = async (req, res) => {
  try {
    const doc = await InstallationAction.findOneAndUpdate(
      {},
      { $unset: { stats: 1 } },
      { new: true }
    );
    res.status(200).json({ message: 'Stats deleted', stats: doc.stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
