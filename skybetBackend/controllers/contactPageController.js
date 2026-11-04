import ContactPage from '../models/ContactPage.js';

// Create or update the entire ContactPage document
export const upsertContactPage = async (req, res) => {
  try {
    const data = req.body;
    let contactPage = await ContactPage.findOne();
    if (contactPage) {
      await ContactPage.updateOne({}, data);
      contactPage = await ContactPage.findOne();
      return res.status(200).json(contactPage);
    } else {
      contactPage = await ContactPage.create(data);
      return res.status(201).json(contactPage);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get the entire ContactPage document
export const getContactPage = async (req, res) => {
  try {
    const contactPage = await ContactPage.findOne();
    res.status(200).json(contactPage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// HERO SECTION CRUD
export const getHeroSection = async (req, res) => {
  try {
    const contactPage = await ContactPage.findOne();
    res.status(200).json(contactPage ? contactPage.hero : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createHeroSection = async (req, res) => {
  try {
    const { title, description } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    let contactPage = await ContactPage.findOne();
    if (!contactPage) {
      contactPage = await ContactPage.create({ hero: { title, description, img } });
    } else {
      contactPage.hero = { title, description, img };
      await contactPage.save();
    }
    res.status(201).json(contactPage.hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateHeroSection = async (req, res) => {
  try {
    const { title, description } = req.body;
    let img = req.file ? req.file.filename : req.body.img;
    if (img && !img.startsWith('uploads/')) img = 'uploads/' + img;
    const contactPage = await ContactPage.findOneAndUpdate(
      {},
      { 'hero.title': title, 'hero.description': description, 'hero.img': img },
      { new: true }
    );
    res.status(200).json(contactPage.hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteHeroSection = async (req, res) => {
  try {
    const contactPage = await ContactPage.findOneAndUpdate(
      {},
      { $unset: { hero: 1 } },
      { new: true }
    );
    res.status(200).json({ message: 'Hero section deleted', hero: contactPage.hero });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADDRESS CRUD
export const getAddress = async (req, res) => {
  try {
    const contactPage = await ContactPage.findOne();
    res.status(200).json(contactPage ? contactPage.address : null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAddress = async (req, res) => {
  try {
    const { contactNo, email, address } = req.body;
    let contactPage = await ContactPage.findOne();
    if (!contactPage) {
      contactPage = await ContactPage.create({ address: { contactNo, email, address } });
    } else {
      contactPage.address = { contactNo, email, address };
      await contactPage.save();
    }
    res.status(201).json(contactPage.address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { contactNo, email, address } = req.body;
    const contactPage = await ContactPage.findOneAndUpdate(
      {},
      { 'address.contactNo': contactNo, 'address.email': email, 'address.address': address },
      { new: true }
    );
    res.status(200).json(contactPage.address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const contactPage = await ContactPage.findOneAndUpdate(
      {},
      { $unset: { address: 1 } },
      { new: true }
    );
    res.status(200).json({ message: 'Address deleted', address: contactPage.address });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// INFO SECTIONS CRUD
export const addInfoSection = async (req, res) => {
  try {
    const { descp } = req.body;
    let { list } = req.body;
    // Handle list as array or single value
    if (typeof list === 'string') list = [list];
    if (!Array.isArray(list)) list = [];
    let images = req.files ? req.files.map(f => f.filename) : (Array.isArray(req.body.images) ? req.body.images : req.body.images ? [req.body.images] : []);
    images = images.map(img => (img && !img.startsWith('uploads/')) ? 'uploads/' + img : img);
    const contactPage = await ContactPage.findOneAndUpdate(
      {},
      { $push: { infoSections: { images, descp, list } } },
      { new: true }
    );
    res.status(201).json(contactPage.infoSections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateInfoSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { descp } = req.body;
    let { list } = req.body;
    if (typeof list === 'string') list = [list];
    if (!Array.isArray(list)) list = [];
    let images = req.files ? req.files.map(f => f.filename) : (Array.isArray(req.body.images) ? req.body.images : req.body.images ? [req.body.images] : []);
    images = images.map(img => (img && !img.startsWith('uploads/')) ? 'uploads/' + img : img);
    const contactPage = await ContactPage.findOneAndUpdate(
      { 'infoSections._id': sectionId },
      {
        $set: {
          'infoSections.$.images': images,
          'infoSections.$.descp': descp,
          'infoSections.$.list': list,
        },
      },
      { new: true }
    );
    const updatedSection = contactPage.infoSections.id(sectionId);
    res.status(200).json(updatedSection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteInfoSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const contactPage = await ContactPage.findOneAndUpdate(
      {},
      { $pull: { infoSections: { _id: sectionId } } },
      { new: true }
    );
    res.status(200).json(contactPage.infoSections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getInfoSections = async (req, res) => {
  try {
    const contactPage = await ContactPage.findOne();
    res.status(200).json(contactPage ? contactPage.infoSections : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getInfoSectionById = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const contactPage = await ContactPage.findOne();
    if (!contactPage) return res.status(404).json({ error: 'ContactPage not found' });
    const section = contactPage.infoSections.id(sectionId);
    if (!section) return res.status(404).json({ error: 'Info section not found' });
    res.status(200).json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
