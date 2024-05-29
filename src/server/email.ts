import nodemailer from "nodemailer"
import type SMTPTransport from "nodemailer/lib/smtp-transport"

import { env } from "@/env"

export async function sendEmail({
  identifier: email,
  subject,
  template,
}: {
  identifier: string
  template: { html: string; text: string }
  subject: string
}) {
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const transport = nodemailer.createTransport({
    host: env.EMAIL_SERVER_HOST,
    port: env.EMAIL_SERVER_PORT,
    secure: true,
    auth: { user: env.EMAIL_SERVER_USER, pass: env.EMAIL_SERVER_PASSWORD },
    logger: true,
  } as never as SMTPTransport.Options)

  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  await transport.sendMail({
    to: email,
    from: env.EMAIL_FROM,
    subject: subject,
    text: template.text,
    html: template.html,
  })
}
