import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendResetPasswordEmail(to: string, resetLink: string) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM!,
    subject: "Reset your password",
    html: `
      <div style="font-family: sans-serif; line-height: 1.5">
        <h2>Reset your password</h2>
        <p>We received a request to reset your password</p>
        <p>
          Click the link below to reset your password:<br/>
          <a href="${resetLink}" style="color: #2563eb;">${resetLink}</a>
        </p>
        <p>This link will expire in 1 hour</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Successfully sent reset password email to:", to);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to send reset password email:", error.message);
      throw error;
    }
    console.error("Failed to send reset password email:", error);
    throw error;
  }
}