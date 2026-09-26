const User = require('../models/User');


const addEmergencyContact = async (req, res) => {
  try {
    const { name, phone, relation } = req.body;
    const userId = req.userId;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.emergencyContacts.push({ name, phone, relation });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Emergency contact added',
      emergencyContacts: user.emergencyContacts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getEmergencyContacts = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      emergencyContacts: user.emergencyContacts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const deleteEmergencyContact = async (req, res) => {
  try {
    const userId = req.userId;
    const { contactId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.emergencyContacts = user.emergencyContacts.filter(
      (contact) => contact._id.toString() !== contactId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Emergency contact deleted',
      emergencyContacts: user.emergencyContacts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addEmergencyContact, getEmergencyContacts, deleteEmergencyContact };