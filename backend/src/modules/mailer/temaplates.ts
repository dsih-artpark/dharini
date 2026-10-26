import { RoleType } from 'src/common/enums/roles.enum';

export const emailTemplate = {};

const invitationTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation to join {projectName} on Dharini</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 20px;">
  <p>Hello {userName},</p>
  <p>You have been invited to join <b>{projectName}</b> on Dharini as a <b>{role}</b>. Dharini is a disease surveillance and sample collection platform run by ARTPARK.</p>
  <p>You are receiving this email because an administrator added your email address to this project. To accept the invitation, open this link:</p>
  <p><a href="{inviteLink}">{inviteLink}</a></p>
  <p>If you were not expecting this invitation, you can ignore this email.</p>
  <p>Dharini team, ARTPARK</p>
</body>
</html>
`;

emailTemplate[RoleType.PROJECT_ADMIN] = invitationTemplate;
emailTemplate[RoleType.COLLECTOR_ADMIN] = invitationTemplate;
emailTemplate[RoleType.COLLECTOR] = invitationTemplate;
emailTemplate[RoleType.TEAM_ADMIN] = invitationTemplate;
emailTemplate[RoleType.TEAM_MEMBER] = invitationTemplate;
emailTemplate[RoleType.LAB_ADMIN] = invitationTemplate;
emailTemplate[RoleType.LAB_MEMBER] = invitationTemplate;

emailTemplate['onboarding'] = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You have been added to {teamName} on Dharini</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
  <div style="max-width: 500px; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); margin: auto;">
    <h2 style="color: #284DB6; margin-top: 0;">You have been added to {teamName} on Dharini</h2>
    <p style="color: #555; line-height: 1.6;">Hello {userName},</p>
    <p style="color: #555; line-height: 1.6;">An administrator has added you to the team <b>{teamName}</b> on Dharini as a <b>{roleName}</b>. Dharini is a disease surveillance and sample collection platform run by ARTPARK.</p>
    <p style="color: #555; line-height: 1.6;">You are receiving this email because your email address was used to create your account. You can sign in with this email address at:</p>
    <p style="margin: 25px 0;">
      <a href="{platformLink}" style="display: inline-block; background-color: #284DB6; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Open Dharini</a>
    </p>
    <p style="color: #555; line-height: 1.6;">Link: <a href="{platformLink}">{platformLink}</a></p>
    <p style="color: #555; line-height: 1.6;">If you were not expecting this, or have questions, please contact your team administrator.</p>
    <p style="margin-top: 30px; font-size: 12px; color: #888;">Dharini team, ARTPARK</p>
  </div>
</body>
</html>
`;

emailTemplate['login'] = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Dharini verification code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
        }
        .container {
            max-width: 500px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin: auto;
        }
        h2 {
            color: #333;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #007BFF;
            margin: 20px 0;
        }
        p {
            color: #555;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <p>Hi,</p>
        <p>Use the verification code below to {purpose}:</p>
        <div class="otp">{otp}</div>
        <p>This code will expire in <strong>3 minutes</strong>. For your security, please do not share this code with anyone. The Dharini team will never ask you for it.</p>
        <p>You're receiving this email because {reason} using this email address. If you did not request this code, you can safely ignore this email.</p>
        <p class="footer">Regards,<br>Dharini Team<br>ARTPARK</p>
    </div>
</body>
</html>
`;
