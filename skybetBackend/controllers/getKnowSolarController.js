import GetKnowSolar from '../models/GetKnowSolar.js';

// Whole Document
export const getGetKnowSolar = async (req, res) => {
  try {
    const doc = await GetKnowSolar.findOne();
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const upsertGetKnowSolar = async (req, res) => {
  try {
    const data = req.body;
    let doc = await GetKnowSolar.findOne();
    if (doc) {
      await GetKnowSolar.updateOne({}, data);
      doc = await GetKnowSolar.findOne();
      return res.status(200).json(doc);
    } else {
      doc = await GetKnowSolar.create(data);
      return res.status(201).json(doc);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Hero Section CRUD
export const getHeroSection = async (req, res) => {
  try {
    const doc = await GetKnowSolar.findOne();
    res.status(200).json(doc ? doc.heroSection : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createHeroSection = async (req, res) => {
  try {
    const { title, subtitle, desp } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    let doc = await GetKnowSolar.findOne();
    if (!doc) {
      doc = await GetKnowSolar.create({ heroSection: { title, subtitle, desp, img } });
    } else {
      doc.heroSection = { title, subtitle, desp, img };
      await doc.save();
    }
    res.status(201).json(doc.heroSection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateHeroSection = async (req, res) => {
  try {
    const { title, subtitle, desp } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await GetKnowSolar.findOneAndUpdate(
      {},
      { 'heroSection.title': title, 'heroSection.subtitle': subtitle, 'heroSection.desp': desp, 'heroSection.img': img },
      { new: true }
    );
    res.status(200).json(doc.heroSection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteHeroSection = async (req, res) => {
  try {
    const doc = await GetKnowSolar.findOneAndUpdate(
      {},
      { $unset: { heroSection: 1 } },
      { new: true }
    );
    res.status(200).json({ message: 'Hero section deleted', heroSection: doc.heroSection });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Foundation Section CRUD
export const getFoundation = async (req, res) => {
  try {
    const doc = await GetKnowSolar.findOne();
    res.status(200).json(doc ? doc.foundation : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createFoundation = async (req, res) => {
  try {
    const { title, desp } = req.body;
    let doc = await GetKnowSolar.findOne();
    if (!doc) {
      doc = await GetKnowSolar.create({ foundation: [{ title, desp }] });
    } else {
      doc.foundation.push({ title, desp });
      await doc.save();
    }
    res.status(201).json(doc.foundation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateFoundation = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { title, desp } = req.body;
    const doc = await GetKnowSolar.findOne();
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    const foundation = doc.foundation.id(itemId);
    if (!foundation) return res.status(404).json({ error: 'Foundation item not found' });
    foundation.title = title;
    foundation.desp = desp;
    await doc.save();
    res.status(200).json(foundation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteFoundation = async (req, res) => {
  try {
    const { itemId } = req.params;
    const doc = await GetKnowSolar.findOne();
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    doc.foundation.id(itemId).remove();
    await doc.save();
    res.status(200).json({ message: 'Foundation item deleted', foundation: doc.foundation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ChooseSolar CRUD (Array)
export const getChooseSolar = async (req, res) => {
  try {
    const doc = await GetKnowSolar.findOne();
    res.status(200).json(doc ? doc.chooseSolar : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addChooseSolar = async (req, res) => {
  try {
    const { name, desp } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await GetKnowSolar.findOneAndUpdate(
      {},
      { $push: { chooseSolar: { img, name, desp } } },
      { new: true }
    );
    res.status(201).json(doc.chooseSolar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateChooseSolar = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, desp } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await GetKnowSolar.findOneAndUpdate(
      { 'chooseSolar._id': itemId },
      {
        $set: {
          'chooseSolar.$.img': img,
          'chooseSolar.$.name': name,
          'chooseSolar.$.desp': desp,
        },
      },
      { new: true }
    );
    const updated = doc.chooseSolar.id(itemId);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteChooseSolar = async (req, res) => {
  try {
    const { itemId } = req.params;
    const doc = await GetKnowSolar.findOneAndUpdate(
      {},
      { $pull: { chooseSolar: { _id: itemId } } },
      { new: true }
    );
    res.status(200).json(doc.chooseSolar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// WhereSolarFits CRUD (Single)
export const getWhereSolarFits = async (req, res) => {
  try {
    const doc = await GetKnowSolar.findOne();
    res.status(200).json(doc ? doc.whereSolarFits : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createWhereSolarFits = async (req, res) => {
  try {
    let { list } = req.body;
    if (typeof list === 'string') list = [list];
    if (!Array.isArray(list)) list = [];
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    let doc = await GetKnowSolar.findOne();
    if (!doc) {
      doc = await GetKnowSolar.create({ whereSolarFits: { list, img } });
    } else {
      doc.whereSolarFits = { list, img };
      await doc.save();
    }
    res.status(201).json(doc.whereSolarFits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateWhereSolarFits = async (req, res) => {
  try {
    let { list } = req.body;
    if (typeof list === 'string') list = [list];
    if (!Array.isArray(list)) list = [];
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const doc = await GetKnowSolar.findOneAndUpdate(
      {},
      { 'whereSolarFits.list': list, 'whereSolarFits.img': img },
      { new: true }
    );
    res.status(200).json(doc.whereSolarFits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteWhereSolarFits = async (req, res) => {
  try {
    const doc = await GetKnowSolar.findOneAndUpdate(
      {},
      { $unset: { whereSolarFits: 1 } },
      { new: true }
    );
    res.status(200).json({ message: 'WhereSolarFits deleted', whereSolarFits: doc.whereSolarFits });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
