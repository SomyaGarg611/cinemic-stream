const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Check if email credentials are configured
    const hasEmailConfig = process.env.EMAIL_USER && 
                          process.env.EMAIL_PASSWORD && 
                          process.env.EMAIL_PASSWORD !== 'your_gmail_app_password_here';
    
    if (hasEmailConfig) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    } else {
      console.log('📧 Email service running in mock mode (no credentials configured)');
      this.transporter = null;
    }
  }

  async sendContactEmail(formData) {
    const { name, email, subject, message } = formData;

    if (!this.transporter) {
      // Mock mode - log the email instead of sending
      console.log('📧 MOCK EMAIL (would be sent in production):');
      console.log('─'.repeat(50));
      console.log(`From: ${name} <${email}>`);
      console.log(`Subject: Contact Form - ${subject}`);
      console.log('Message:');
      console.log(message);
      console.log('─'.repeat(50));
      
      return {
        success: true,
        message: 'Message received successfully! (Currently in demo mode)',
        messageId: 'mock-' + Date.now()
      };
    }

    try {
      // Email to admin
      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `Cinemic Contact Form: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #3B82F6;">New Contact Form Submission</h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h3>Contact Details</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin-top: 15px;">
              <h3>Message</h3>
              <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        `,
        replyTo: email
      };

      // Auto-reply to user
      const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting Cinemic',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <div style="background: linear-gradient(135deg, #1F2937 0%, #3B82F6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">CINEMIC</h1>
              <p style="color: #E5E7EB; margin: 10px 0 0 0;">Your Ultimate Movie Experience</p>
            </div>
            
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333; margin-top: 0;">Thank you for your message!</h2>
              <p>Hi ${name},</p>
              <p>We've received your message about "${subject}" and appreciate you reaching out to us.</p>
              <p>Our team will review your inquiry and get back to you within 24-48 hours.</p>
              
              <div style="margin: 25px 0; padding: 20px; background-color: white; border-radius: 8px;">
                <h3 style="color: #3B82F6; margin-top: 0;">Your Message Summary</h3>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p style="border-left: 3px solid #3B82F6; padding-left: 15px; color: #666;">${message}</p>
              </div>
              
              <p>In the meantime, feel free to explore our latest movies and TV shows!</p>
              <p>Best regards,<br>The Cinemic Team</p>
            </div>
          </div>
        `
      };

      // Send emails
      const adminResult = await this.transporter.sendMail(adminMailOptions);
      const userResult = await this.transporter.sendMail(userMailOptions);

      return {
        success: true,
        message: 'Your message has been sent successfully! We\'ll get back to you soon.',
        adminMessageId: adminResult.messageId,
        userMessageId: userResult.messageId
      };

    } catch (error) {
      console.error('❌ Failed to send contact email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

// Create and export singleton instance
const emailService = new EmailService();
module.exports = emailService;