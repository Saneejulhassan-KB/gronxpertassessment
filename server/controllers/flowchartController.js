const Flowchart = require('../models/Flowchart');


// create flow chart

exports.createFlowchart = async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    const flowchart = await Flowchart.create({
      name,
      nodes,
      edges,
      user: req.user.id
    });
    res.status(201).json(flowchart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get flowchart

exports.getFlowcharts = async (req, res) => {
  try {
    const flowcharts = await Flowchart.find({ user: req.user.id });
    res.json(flowcharts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFlowchart = async (req, res) => {
  try {
    const flowchart = await Flowchart.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!flowchart) {
      return res.status(404).json({ error: 'Flowchart not found' });
    }
    res.json(flowchart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update flowchart

exports.updateFlowchart = async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    const flowchart = await Flowchart.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, nodes, edges, updatedAt: Date.now() },
      { new: true }
    );
    if (!flowchart) {
      return res.status(404).json({ error: 'Flowchart not found' });
    }
    res.json(flowchart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete flowchart

exports.deleteFlowchart = async (req, res) => {
  try {
    const flowchart = await Flowchart.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!flowchart) {
      return res.status(404).json({ error: 'Flowchart not found' });
    }
    res.json({ message: 'Flowchart deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 