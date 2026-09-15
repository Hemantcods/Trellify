import { env } from "../../../config/env";

export const inviteTemplate = (
  recipientName: string,
  inviterName: string,
  organizationName: string,
  role: string,
  invitationUrl: string,
) => {
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; color: #172b4d;">

      <h2>You're invited to join {{organizationName}}</h2>

      <p>
        Hi ${recipientName},
      </p>

      <p>
        <strong>${inviterName}</strong> has invited you to join
        <strong>${organizationName}</strong> on <strong>${env.APP_NAME}</strong>.
      </p>

      <p>
        Collaborate with your team, manage boards, and keep your projects organized
        in one place.
      </p>

      <p>
        <strong>Your invitation role:</strong> ${role}
      </p>

      <div style="margin: 32px 0;">
        <a
          href="${invitationUrl}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background: #0c66e4;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          "
        >
          Accept Invitation
        </a>
      </div>

      <p style="font-size: 14px; color: #5e6c84;">
        This invitation will expire in {{expiresIn}}.
      </p>

      <p style="font-size: 14px; color: #5e6c84;">
        If you weren't expecting this invitation, you can safely ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #dfe1e6; margin: 32px 0;">

      <p style="font-size: 13px; color: #6b778c;">
        Thanks,<br>
        The ${env.APP_NAME} Team
      </p>

    </div>`;
};
