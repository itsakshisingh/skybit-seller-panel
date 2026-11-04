import OurTechnology from '../models/OurTechnology.js';

// HeroSection CRUD
export const getHeroSection = async (req, res) => {
  try {
    const doc = await OurTechnology.findOne();
    res.status(200).json(doc ? doc.heroSection : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createHeroSection = async (req, res) => {
  try {
    const { title, descp } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    let doc = await OurTechnology.findOne();
    if (!doc) {
      doc = await OurTechnology.create({ heroSection: { title, descp, img } });
    } else {
      doc.heroSection = { title, descp, img };
      await doc.save();
    }
    res.status(201).json(doc.heroSection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateHeroSection = async (req, res) => {
  try {
    const { title, descp } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await OurTechnology.findOneAndUpdate(
      {},
      { 'heroSection.title': title, 'heroSection.descp': descp, 'heroSection.img': img },
      { new: true }
    );
    res.status(200).json(doc.heroSection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteHeroSection = async (req, res) => {
  try {
    const doc = await OurTechnology.findOneAndUpdate(
      {},
      { $unset: { heroSection: 1 } },
      { new: true }
    );
    res.status(200).json({ message: 'HeroSection deleted', heroSection: doc.heroSection });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// TechItems CRUD
export const getTechItems = async (req, res) => {
  try {
    const doc = await OurTechnology.findOne();
    res.status(200).json(doc ? doc.techItems : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addTechItem = async (req, res) => {
  try {
    const { type, name, desp } = req.body;
    let { list } = req.body;
    if (typeof list === 'string') list = [list];
    if (!Array.isArray(list)) list = [];
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await OurTechnology.findOneAndUpdate(
      {},
      { $push: { techItems: { type, name, desp, list, img } } },
      { new: true }
    );
    res.status(201).json(doc.techItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTechItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { type, name, desp } = req.body;
    let { list } = req.body;
    if (typeof list === 'string') list = [list];
    if (!Array.isArray(list)) list = [];
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await OurTechnology.findOne();
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    const techItem = doc.techItems.id(itemId);
    if (!techItem) return res.status(404).json({ error: 'TechItem not found' });
    techItem.type = type;
    techItem.name = name;
    techItem.desp = desp;
    techItem.list = list;
    techItem.img = img;
    await doc.save();
    res.status(200).json(techItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTechItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const doc = await OurTechnology.findOne();
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    doc.techItems.id(itemId).remove();
    await doc.save();
    res.status(200).json({ message: 'TechItem deleted', techItems: doc.techItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
