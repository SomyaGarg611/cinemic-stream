const emailService = require('../services/emailService');

// Send contact form email
const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required (name, email, subject, message)'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Validate message length
    if (message.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 10 characters long'
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Message must be less than 2000 characters'
      });
    }

    console.log(`📧 Processing contact form from: ${name} (${email})`);

    // Send email using service
    const result = await emailService.sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    console.log(`✅ Contact email sent successfully for: ${name}`);

    res.json({
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you soon.',
      result
    });

  } catch (error) {
    console.error('❌ Error sending contact email:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.',
      message: error.message
    });
  }
};

module.exports = {
  sendContactEmail
};