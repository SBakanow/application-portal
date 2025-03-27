const nodemailer = require('nodemailer')
require('dotenv').config()
const {
  getPendingReminderApplications,
  updateApplicationReminderEmailSent,
} = require('./controllers/applicationController')

const sendReminderEmail = (application) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Application Reminder',
      text: `The application for ${application.title} was 2 weeks ago.\nIt's time to ask ${application.Company?.name} for some feedback.`,
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
      } else {
        resolve(info.response)
      }
    })
  })
}

const sendingEmail = async () => {
  try {
    const pendingApplications = await getPendingReminderApplications()
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    for (const application of pendingApplications) {
      if (new Date(application.createdAt) <= twoWeeksAgo) {
        try {
          await sendReminderEmail(application)
          try {
            const result = await updateApplicationReminderEmailSent(
              application.id,
              {
                reminderEmailSent: 1,
              }
            )

            if (result > 0) {
              console.log(
                `Database updated for application: ${application.title}`
              )
            } else {
              console.error(
                `Failed to update database for application: ${application.title}`
              )
            }
          } catch (updateError) {
            console.error(
              `Error updating database for application: ${application.title}`,
              updateError
            )
          }

          console.log(`Email sent for application: ${application.title}`)
        } catch (emailError) {
          console.error(
            `Error sending email for application: ${application.title}`,
            emailError
          )
        }
      }
    }
  } catch (error) {
    console.error('Error fetching applications: ', error)
  }
}

module.exports = sendingEmail
