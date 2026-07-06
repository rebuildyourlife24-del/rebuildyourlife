import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

/**
 * Singleton class to interact with Microsoft 360 Office Graph API.
 * This class requires an active Access Token which should be retrieved via MSAL Auth.
 */
export class Microsoft360Client {
  private client: Client;

  constructor(accessToken: string) {
    this.client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });
  }

  // ==========================================
  // EMAILS
  // ==========================================

  /**
   * Retrieves the most recent emails from the user's inbox.
   */
  async getRecentEmails(limit: number = 10) {
    try {
      const messages = await this.client
        .api('/me/messages')
        .select('id,subject,bodyPreview,from,receivedDateTime,isRead')
        .top(limit)
        .orderby('receivedDateTime desc')
        .get();
      return messages.value;
    } catch (error) {
      console.error('Error fetching emails from Microsoft 360:', error);
      throw error;
    }
  }

  /**
   * Sends an email on behalf of the user.
   */
  async sendEmail(toAddress: string, subject: string, content: string) {
    const message = {
      message: {
        subject: subject,
        body: {
          contentType: 'Text',
          content: content,
        },
        toRecipients: [
          {
            emailAddress: {
              address: toAddress,
            },
          },
        ],
      },
      saveToSentItems: 'true',
    };

    try {
      await this.client.api('/me/sendMail').post(message);
      return { success: true };
    } catch (error) {
      console.error('Error sending email via Microsoft 360:', error);
      throw error;
    }
  }

  // ==========================================
  // CALENDAR
  // ==========================================

  /**
   * Retrieves upcoming calendar events.
   */
  async getUpcomingEvents(limit: number = 10) {
    try {
      const now = new Date().toISOString();
      const events = await this.client
        .api('/me/calendarView')
        .query({
          startDateTime: now,
          endDateTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // next 7 days
        })
        .select('subject,bodyPreview,start,end,location')
        .top(limit)
        .orderby('start/dateTime')
        .get();
      return events.value;
    } catch (error) {
      console.error('Error fetching calendar events from Microsoft 360:', error);
      throw error;
    }
  }

  /**
   * Schedules a new meeting.
   */
  async scheduleMeeting(subject: string, startTime: string, endTime: string, attendeeEmails: string[] = []) {
    const event = {
      subject: subject,
      body: {
        contentType: 'HTML',
        content: 'Meeting scheduled by RYL Sovereign OS.',
      },
      start: {
        dateTime: startTime,
        timeZone: 'Europe/Amsterdam',
      },
      end: {
        dateTime: endTime,
        timeZone: 'Europe/Amsterdam',
      },
      location: {
        displayName: 'Microsoft Teams Meeting',
      },
      attendees: attendeeEmails.map(email => ({
        emailAddress: {
          address: email,
        },
        type: 'required',
      })),
      isOnlineMeeting: true,
      onlineMeetingProvider: 'teamsForBusiness',
    };

    try {
      const result = await this.client.api('/me/events').post(event);
      return result;
    } catch (error) {
      console.error('Error scheduling meeting via Microsoft 360:', error);
      throw error;
    }
  }

  // ==========================================
  // ONEDRIVE / FILES
  // ==========================================

  /**
   * Retrieves files from the root of OneDrive.
   */
  async getDriveFiles() {
    try {
      const files = await this.client
        .api('/me/drive/root/children')
        .select('id,name,size,webUrl,lastModifiedDateTime')
        .get();
      return files.value;
    } catch (error) {
      console.error('Error fetching files from OneDrive:', error);
      throw error;
    }
  }

  /**
   * Uploads a text file to OneDrive.
   */
  async uploadTextFile(fileName: string, content: string) {
    try {
      const result = await this.client
        .api(`/me/drive/root:/${fileName}:/content`)
        .put(content);
      return result;
    } catch (error) {
      console.error('Error uploading file to OneDrive:', error);
      throw error;
    }
  }
}
