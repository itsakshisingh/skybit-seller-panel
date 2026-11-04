import JoinUs from '../models/JoinUs.js';

// Get howWeWork
export const getHowWeWork = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.joinUsId);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    res.json(joinUs.howWeWork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update howWeWork
export const updateHowWeWork = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.joinUsId);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });

    const { title, desp } = req.body;
    if (title) joinUs.howWeWork.title = title;
    if (desp !== undefined) joinUs.howWeWork.desp = desp;
    if (req.file) joinUs.howWeWork.img = `/uploads/${req.file.filename}`;

    await joinUs.save();
    res.json(joinUs.howWeWork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get stats
export const getStats = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.joinUsId);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });
    res.json(joinUs.howWeWork.stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update stats
export const updateStats = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.joinUsId);
    if (!joinUs) return res.status(404).json({ message: 'JoinUs not found' });

    const { totalNo, noOfState, noOfProject, noOfClient } = req.body;
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
