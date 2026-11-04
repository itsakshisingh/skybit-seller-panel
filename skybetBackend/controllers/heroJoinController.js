import JoinUs from '../models/JoinUs.js';

// Get heroJoin
export const getHeroJoin = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.joinUsId);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    res.json(joinUs.heroJoin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update heroJoin
export const updateHeroJoin = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.joinUsId);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });

    const { title, subtitle, desp } = req.body;
    if (title) joinUs.heroJoin.title = title;
    if (subtitle !== undefined) joinUs.heroJoin.subtitle = subtitle;
    if (desp !== undefined) joinUs.heroJoin.desp = desp;
    if (req.file) joinUs.heroJoin.img = `/uploads/${req.file.filename}`;

    await joinUs.save();
    res.json(joinUs.heroJoin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
