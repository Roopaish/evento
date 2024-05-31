const emailTemplates = {
  verificationRequest: {
    html({ url, host, email }: Record<"url" | "host" | "email", string>) {
      const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`
      const escapedHost = `${host.replace(/\./g, "&#8203;.")}`

      const backgroundColor = "#f9f9f9"
      const textColor = "#444444"
      const mainBackgroundColor = "#ffffff"
      const buttonBackgroundColor = "#346df1"
      const buttonBorderColor = "#346df1"
      const buttonTextColor = "#ffffff"

      return `
    <body style="background: ${backgroundColor};">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            <strong>${escapedHost}</strong>
          </td>
        </tr>
      </table>
      <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
          <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            Sign in as <strong>${escapedEmail}</strong>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            If you did not request this email you can safely ignore it.
          </td>
        </tr>
      </table>
    </body>
    `
    },
    text({ url, host }: Record<"url" | "host", string>) {
      return `Sign in to ${host}\n${url}\n\n`
    },
  },

  invitation: {
    html: ({
      email,
      eventName,
      eventURL,
      url,
    }: Record<"email" | "eventName" | "eventURL" | "url", string>) =>
      `
      <body style="background: #f9f9f9;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
            <strong>${eventName}</strong>
          </td>
        </tr>
      </table>
      <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: #ffffff; max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
          <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
            You have been invited to join the event
          </td>
        </tr>
         <tr>
          <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
            You can join the event by clicking this link <a href=${url}>${url}</a>. <br/>You need to be logged in with <strong>${email}</strong> email.
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="border-radius: 5px;" bgcolor="#346df1"><a href="${eventURL}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #346df1; display: inline-block; font-weight: bold;">View Event</a></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      </body>
      `,
    text: ({ email, url }: Record<"email" | "url", string>) =>
      `You have been invited to join the event. You can join the event by clicking this link ${url}. You need to be logged in with ${email} email.`,
  },
}

export default emailTemplates
