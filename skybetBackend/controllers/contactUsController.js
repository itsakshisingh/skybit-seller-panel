import ContactUs from '../models/ContactUs.js';

// Submit contact form
export const createContact = async (req, res) => {
  const { name, mobile, city, email, country, companyName, organisationName } = req.body;

  if (!name || !mobile || !city || !email || !country) {
    return res.status(400).json({ message: 'Name, mobile, city, email and country are required' });
  }

  try {
    const contact = await ContactUs.create({
      name,
      mobile,
      city,
      email,
      country,
      companyName,
      organisationName,
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all contacts
export const getContacts = async (req, res) => {
  try {
    const contacts = await ContactUs.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get contact by ID
export const getContactById = async (req, res) => {
  try {
    const contact = await ContactUs.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete contact
export const deleteContact = async (req, res) => {
  try {
    const contact = await ContactUs.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
