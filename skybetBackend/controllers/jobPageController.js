import JobPage from '../models/JobPage.js';

// HERO SECTION CRUD
export const getHeroSection = async (req, res) => {
  try {
    const doc = await JobPage.findOne();
    res.status(200).json(doc ? doc.heroSection : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrUpdateHeroSection = async (req, res) => {
  try {
    const { subtitle, heading, description } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    let doc = await JobPage.findOne();
    if (!doc) {
      doc = await JobPage.create({ heroSection: { subtitle, heading, description, img } });
    } else {
      doc.heroSection = { subtitle, heading, description, img };
      await doc.save();
    }
    res.status(201).json(doc.heroSection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// WE OFFER CRUD
export const getWeOffer = async (req, res) => {
  try {
    const doc = await JobPage.findOne();
    res.status(200).json(doc ? doc.weOffer : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addWeOffer = async (req, res) => {
  try {
    const { icon, title, description } = req.body;
    const doc = await JobPage.findOneAndUpdate(
      {},
      { $push: { weOffer: { icon, title, description } } },
      { new: true }
    );
    res.status(201).json(doc.weOffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateWeOffer = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { icon, title, description } = req.body;
    const doc = await JobPage.findOne();
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    const offer = doc.weOffer.id(itemId);
    if (!offer) return res.status(404).json({ error: 'WeOffer item not found' });
    offer.icon = icon;
    offer.title = title;
    offer.description = description;
    await doc.save();
    res.status(200).json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteWeOffer = async (req, res) => {
  try {
    const { itemId } = req.params;
    const doc = await JobPage.findOne();
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    const offer = doc.weOffer.id(itemId);
    if (!offer) return res.status(404).json({ error: 'WeOffer item not found' });
    offer.deleteOne();
    await doc.save();
    res.status(200).json({ message: 'WeOffer item deleted', weOffer: doc.weOffer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADDITIONAL SECTION CRUD
export const getAdditionalSection = async (req, res) => {
  try {
    const doc = await JobPage.findOne();
    res.status(200).json(doc ? doc.additionalSection : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrUpdateAdditionalSection = async (req, res) => {
  try {
    const { title, descp, list, imgHeading, imgdescription } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    let doc = await JobPage.findOne();
    if (!doc) {
      doc = await JobPage.create({ additionalSection: { title, descp, list, img, imgHeading, imgdescription } });
    } else {
      doc.additionalSection = { title, descp, list, img, imgHeading, imgdescription };
      await doc.save();
    }
    res.status(201).json(doc.additionalSection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
