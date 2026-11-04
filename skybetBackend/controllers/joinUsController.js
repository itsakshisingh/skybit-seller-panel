import JoinUs from '../models/JoinUs.js';

// Create JoinUs
export const createJoinUs = async (req, res) => {
  try {
    const { heroJoin, howWeWork } = req.body;

    if (!heroJoin || !howWeWork) {
      return res.status(400).json({ message: 'heroJoin and howWeWork are required' });
    }

    const parsedHeroJoin = typeof heroJoin === 'string' ? JSON.parse(heroJoin) : heroJoin;
    const parsedHowWeWork = typeof howWeWork === 'string' ? JSON.parse(howWeWork) : howWeWork;

    // Attach uploaded images if any
    if (req.files) {
      if (req.files.heroJoinImg) {
        parsedHeroJoin.img = `/uploads/${req.files.heroJoinImg[0].filename}`;
      }
      if (req.files.howWeWorkImg) {
        parsedHowWeWork.img = `/uploads/${req.files.howWeWorkImg[0].filename}`;
      }
    }

    const teamMembers = req.body.teamMembers
      ? typeof req.body.teamMembers === 'string'
        ? JSON.parse(req.body.teamMembers)
        : req.body.teamMembers
      : [];

    const joinUs = await JoinUs.create({
      heroJoin: parsedHeroJoin,
      howWeWork: parsedHowWeWork,
      teamMembers,
    });

    res.status(201).json(joinUs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all JoinUs
export const getJoinUs = async (req, res) => {
  try {
    const joinUs = await JoinUs.find().sort({ createdAt: -1 });
    res.json(joinUs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get JoinUs by ID
export const getJoinUsById = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.id);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    res.json(joinUs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update JoinUs
export const updateJoinUs = async (req, res) => {
  try {
    const { heroJoin, howWeWork } = req.body;
    const updateData = {};

    if (heroJoin) {
      updateData.heroJoin = typeof heroJoin === 'string' ? JSON.parse(heroJoin) : heroJoin;
    }
    if (howWeWork) {
      updateData.howWeWork = typeof howWeWork === 'string' ? JSON.parse(howWeWork) : howWeWork;
    }

    if (req.body.teamMembers) {
      updateData.teamMembers = typeof req.body.teamMembers === 'string'
        ? JSON.parse(req.body.teamMembers)
        : req.body.teamMembers;
    }

    if (req.files) {
      if (req.files.heroJoinImg) {
        updateData['heroJoin.img'] = `/uploads/${req.files.heroJoinImg[0].filename}`;
      }
      if (req.files.howWeWorkImg) {
        updateData['howWeWork.img'] = `/uploads/${req.files.howWeWorkImg[0].filename}`;
      }
    }

    const joinUs = await JoinUs.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    res.json(joinUs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete JoinUs
export const deleteJoinUs = async (req, res) => {
  try {
    const joinUs = await JoinUs.findByIdAndDelete(req.params.id);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    res.json({ message: 'JoinUs deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- heroJoin CRUD ---
export const getHeroJoin = async (req, res) => {
  try {
    const joinUs = await JoinUs.findOne();
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    res.json(joinUs.heroJoin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHeroJoin = async (req, res) => {
  try {
    const { title, subtitle, desp } = req.body;
    const joinUs = await JoinUs.findById(req.params.id);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    
    // If heroJoin doesn't exist, create it with required img field
    if (!joinUs.heroJoin) {
      if (!req.file) {
        return res.status(400).json({ message: 'Image is required for new heroJoin' });
      }
      joinUs.heroJoin = {
        title: title || 'Hero Title',
        subtitle: subtitle || '',
        desp: desp || '',
        img: `/uploads/${req.file.filename}`
      };
    } else {
      // Update existing heroJoin
      if (title !== undefined) joinUs.heroJoin.title = title;
      if (subtitle !== undefined) joinUs.heroJoin.subtitle = subtitle;
      if (desp !== undefined) joinUs.heroJoin.desp = desp;
      if (req.file) joinUs.heroJoin.img = `/uploads/${req.file.filename}`;
    }
    
    await joinUs.save();
    res.json(joinUs.heroJoin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createHeroJoin = async (req, res) => {
  try {
    let heroJoinData = req.body;
    if (typeof heroJoinData === 'string') heroJoinData = JSON.parse(heroJoinData);
    if (req.file) {
      heroJoinData.img = `/uploads/${req.file.filename}`;
    }
    const joinUs = await JoinUs.findOne();
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    joinUs.heroJoin = heroJoinData;
    await joinUs.save();
    res.status(201).json(joinUs.heroJoin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHeroJoin = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.id);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    joinUs.heroJoin = undefined;
    await joinUs.save();
    res.json({ message: 'heroJoin deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- howWeWork CRUD ---
export const getHowWeWork = async (req, res) => {
  try {
    const joinUs = await JoinUs.findOne();
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    res.json(joinUs.howWeWork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHowWeWork = async (req, res) => {
  try {
    const { title, desp } = req.body;
    const joinUs = await JoinUs.findById(req.params.id);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    
    // If howWeWork doesn't exist, create it with required img field
    if (!joinUs.howWeWork) {
      if (!req.file) {
        return res.status(400).json({ message: 'Image is required for new howWeWork' });
      }
      joinUs.howWeWork = {
        title: title || 'How We Work',
        desp: desp || '',
        img: `/uploads/${req.file.filename}`,
        stats: {
          totalNo: 0,
          noOfState: 0,
          noOfProject: 0,
          noOfClient: 0
        }
      };
    } else {
      // Update existing howWeWork
      if (title !== undefined) joinUs.howWeWork.title = title;
      if (desp !== undefined) joinUs.howWeWork.desp = desp;
      if (req.file) joinUs.howWeWork.img = `/uploads/${req.file.filename}`;
    }
    
    await joinUs.save();
    res.json(joinUs.howWeWork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createHowWeWork = async (req, res) => {
  try {
    let howWeWorkData = req.body;
    if (typeof howWeWorkData === 'string') howWeWorkData = JSON.parse(howWeWorkData);
    if (req.file) {
      howWeWorkData.img = `/uploads/${req.file.filename}`;
    }
    const joinUs = await JoinUs.findOne();
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    joinUs.howWeWork = howWeWorkData;
    await joinUs.save();
    res.status(201).json(joinUs.howWeWork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHowWeWork = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.id);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    joinUs.howWeWork = undefined;
    await joinUs.save();
    res.json({ message: 'howWeWork deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- stats CRUD ---
export const getStats = async (req, res) => {
  try {
    const joinUs = await JoinUs.findOne();
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    res.json(joinUs.howWeWork.stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStats = async (req, res) => {
  try {
    const { totalNo, noOfState, noOfProject, noOfClient } = req.body;
    const joinUs = await JoinUs.findById(req.params.id);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    if (!joinUs.howWeWork) return res.status(404).json({ message: 'howWeWork not found' });
    if (totalNo !== undefined) joinUs.howWeWork.stats.totalNo = totalNo;
    if (noOfState !== undefined) joinUs.howWeWork.stats.noOfState = noOfState;
    if (noOfProject !== undefined) joinUs.howWeWork.stats.noOfProject = noOfProject;
    if (noOfClient !== undefined) joinUs.howWeWork.stats.noOfClient = noOfClient;
    await joinUs.save();
    res.json(joinUs.howWeWork.stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- teamMembers CRUD ---
export const getTeamMembers = async (req, res) => {
  try {
    const joinUs = await JoinUs.findOne();
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    res.json(joinUs.teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamMemberById = async (req, res) => {
  try {
    const joinUs = await JoinUs.findOne();
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    const member = joinUs.teamMembers.id(req.params.memberId);
    if (!member) return res.status(404).json({ message: 'Team member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTeamMember = async (req, res) => {
  try {
    let memberData = req.body;
    if (typeof memberData === 'string') memberData = JSON.parse(memberData);
    if (req.file) {
      memberData.img = `/uploads/${req.file.filename}`;
    }
    const joinUs = await JoinUs.findOne();
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    joinUs.teamMembers.push(memberData);
    await joinUs.save();
    res.status(201).json(joinUs.teamMembers[joinUs.teamMembers.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeamMember = async (req, res) => {
  try {
    let memberData = req.body;
    if (typeof memberData === 'string') memberData = JSON.parse(memberData);
    if (req.file) {
      memberData.img = `/uploads/${req.file.filename}`;
    }
    const joinUs = await JoinUs.findById(req.params.id);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    const member = joinUs.teamMembers.id(req.params.memberId);
    if (!member) return res.status(404).json({ message: 'Team member not found' });
    Object.assign(member, memberData);
    await joinUs.save();
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeamMember = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.id);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    const member = joinUs.teamMembers.id(req.params.memberId);
    if (!member) return res.status(404).json({ message: 'Team member not found' });
    member.deleteOne();
    await joinUs.save();
    res.json({ message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
