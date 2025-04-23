import nodemailer from 'nodemailer'
import 'dotenv/config'
import { ApolloClient, InMemoryCache } from '@apollo/client/core/core.cjs'
import { gql } from 'graphql-tag'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
})

const sendApplicationReminderEmail = (application) => {
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
      text: `The application for ${application.title} was 2 weeks ago.\nIt's time to ask ${application.company?.name} for some feedback.`,
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

const sendPendingApplicationReminders = async () => {
  try {
    const { data } = await client.query({
      query: gql`
        query getApplications($status: String, $reminderEmailSent: Boolean) {
          applications(status: $status, reminderEmailSent: $reminderEmailSent) {
            id
            title
            createdAt
            reminderEmailSent
            company {
              name
            }
          }
        }
      `,
      variables: {
        status: 'Pending',
        reminderEmailSent: false,
      },
    })

    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    for (const application of data.applications) {
      if (new Date(application.createdAt) <= twoWeeksAgo) {
        console.log(
          `Trying to send reminder Email for application ${application.title} at ${application.company.name}`
        )
        try {
          await sendApplicationReminderEmail(application)
          try {
            const { data } = await client.mutate({
              mutation: gql`
                mutation updateApplication(
                  $id: ID!
                  $input: EditApplicationInput!
                ) {
                  updateApplication(id: $id, input: $input) {
                    reminderEmailSent
                  }
                }
              `,
              variables: {
                id: application.id,
                input: {
                  reminderEmailSent: true,
                },
              },
            })

            if (data) {
              console.log(
                `ReminderEmailSent updated to ${data.reminderEmailSent} for application: ${application.title}`
              )
            } else {
              console.error(
                `Failed to update ReminderEmailSent for application: ${application.title}`
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

export default sendPendingApplicationReminders
