const ChatHistory = require('../models/ChatHistory');
const { getLegalChatResponse } = require('../services/geminiService');


const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    
    let chat = await ChatHistory.findOne({ userId });
    if (!chat) {
      chat = await ChatHistory.create({ userId, messages: [] });
    }

    
    const aiResponse = await getLegalChatResponse(message, chat.messages);

    
    chat.messages.push({ role: 'user', content: message });
    chat.messages.push({ role: 'assistant', content: aiResponse });
    await chat.save();

    res.status(200).json({
      success: true,
      reply: aiResponse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/legal-chat/history
const getHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const chat = await ChatHistory.findOne({ userId });

    res.status(200).json({
      success: true,
      messages: chat ? chat.messages : [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { sendMessage, getHistory };