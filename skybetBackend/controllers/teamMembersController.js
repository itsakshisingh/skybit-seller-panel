import JoinUs from '../models/JoinUs.js';

// Get all teamMembers
export const getTeamMembers = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.joinUsId);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    res.json(joinUs.teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get teamMember by ID
export const getTeamMemberById = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.joinUsId);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });

    const member = joinUs.teamMembers.id(req.params.memberId);
    if (!member) return res.status(404).json({ message: 'TeamMember not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add teamMember
export const addTeamMember = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.joinUsId);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });

    const { name, designation, description } = req.body;
    if (!name || !designation) {
      return res.status(400).json({ message: 'Name and designation are required' });
    }

    const img = req.file ? `/uploads/${req.file.filename}` : null;
    if (!img) return res.status(400).json({ message: 'Image is required' });

    joinUs.teamMembers.push({ name, img, designation, description });
    await joinUs.save();

    res.status(201).json(joinUs.teamMembers[joinUs.teamMembers.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update teamMember
export const updateTeamMember = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.joinUsId);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });

    const member = joinUs.teamMembers.id(req.params.memberId);
    if (!member) return res.status(404).json({ message: 'TeamMember not found' });

    const { name, designation, description } = req.body;
    if (name) member.name = name;
    if (designation) member.designation = designation;
    if (description !== undefined) member.description = description;
    if (req.file) member.img = `/uploads/${req.file.filename}`;

    await joinUs.save();
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete teamMember
export const deleteTeamMember = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.joinUsId);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });

    const member = joinUs.teamMembers.id(req.params.memberId);
    if (!member) return res.status(404).json({ message: 'TeamMember not found' });

    member.deleteOne();
    await joinUs.save();
    res.json({ message: 'TeamMember deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
