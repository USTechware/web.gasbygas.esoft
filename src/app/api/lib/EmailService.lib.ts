import brevo, { TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';

class EmailService {
    private apiInstance: brevo.TransactionalEmailsApi;

    constructor() {
        this.apiInstance = new brevo.TransactionalEmailsApi();
        this.apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, String(process.env.BREVO_EMAIL_API_KEY));
    }

    /**
     * Sends a transactional email using Brevo
     * @param subject Email subject
     * @param htmlContent Email body as HTML
     * @param sender Sender information (name and email)
     * @param recipients List of recipient objects with name and email
     * @param replyTo (Optional) Reply-to information
     * @param headers (Optional) Custom headers
     * @param params (Optional) Dynamic parameters for the email content
     * @returns Promise<any> API response or error
     */
    async sendEmail(
        subject: string,
        htmlContent: string,
        recipients: { name: string; email: string }[],
        replyTo?: { name?: string; email: string },
        headers?: Record<string, string>,
        params?: Record<string, any>
    ): Promise<any> {
        // Create an instance of the email object
        const sendSmtpEmail = new brevo.SendSmtpEmail();

        // Populate the email details
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = htmlContent;
        sendSmtpEmail.sender = { name: "GasByGas Support", email: 'mohamedsakirhassan@gmail.com'};
        sendSmtpEmail.to = recipients;
        if (replyTo) sendSmtpEmail.replyTo = replyTo;
        if (headers) sendSmtpEmail.headers = headers;
        if (params) sendSmtpEmail.params = params;

        try {
            const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            console.log('Email sent successfully:', response);
            return response;
        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }


    static async sendOutletCreationEmail(name: string, email: string, password: string) {
        // HTML content for the email
        const htmlContent = `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
              <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #333;">Welcome to Our Platform, ${name}!</h2>
                <p>We're excited to have you on board as an outlet manager. Below are your account details:</p>
                <ul style="list-style-type: none; padding: 0;">
                  <li><strong>Email:</strong> ${email}</li>
                  <li><strong>Password:</strong> ${password}</li>
                </ul>
                <p>
                  Please log in to your account using the credentials provided and update your password after your first login.
                </p>
                <p>
                  If you have any questions, feel free to reply to this email or contact our support team.
                </p>
                <p style="margin-top: 20px;">Best regards,<br />The Team</p>
              </div>
            </body>
          </html>
        `;
      
        // Email details
        const subject = "Welcome to Our Platform!";
        const recipients = [{ name, email }];
        const replyTo = { name: "GasByGas Support", email: "mohamedsakirhassan@gmail.com" };
        const headers = { "X-Priority": "1 (Highest)" };
      
        try {
          // Call the EmailService to send the email
          const emailService = new EmailService();
          const response = await emailService.sendEmail(
            subject,
            htmlContent,
            recipients,
            replyTo,
            headers
          );
          console.log("Email sent successfully:", response);
        } catch (error) {
          console.error("Failed to send outlet creation email:", error);
          throw error;
        }
      }
      
}

export default EmailService;
