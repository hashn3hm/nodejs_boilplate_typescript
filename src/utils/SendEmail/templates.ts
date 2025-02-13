export const emailTemplateGeneric = (verificationCode: number, reason: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${reason === "registration" ? "Account Registration" : "Password Reset"}</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; color: #333;">
      <div style="max-width: 600px; margin: 50px auto; background: #ffffff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <div style="background-color: #007bff; color: #ffffff; text-align: center; padding: 20px;">
          <h2 style="margin: 0;">Hi there,</h2>
        </div>
        <div style="padding: 20px;">
          ${
            reason === "registration"
              ? `<h4 style="margin: 0 0 15px; font-weight: normal;">Thank you for registering with us. Please use the following code to verify your account:</h4>`
              : `<h4 style="margin: 0 0 15px; font-weight: normal;">Thank you for using our service. Please use the following code to reset your password:</h4>`
          }
          <h1 style="font-size: 36px; color: #007bff; margin: 20px 0; text-align: center;">${verificationCode}</h1>
          <p style="font-size: 14px; line-height: 1.6; margin: 15px 0 0;">If you did not request this, please ignore this email. This code will expire in 10 minutes.</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #888; padding: 10px; border-top: 1px solid #ddd; background: #f1f1f1;">
          &copy; 2024. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};
