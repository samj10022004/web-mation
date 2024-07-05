import { google } from 'googleapis'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/lib/db'

export async function GET() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.OAUTH2_REDIRECT_URI
  )

  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  try {
    const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
      userId,
      'oauth_google'
    )

    if (!clerkResponse || clerkResponse.length === 0) {
      return NextResponse.json({ message: 'OAuth access token not found' }, { status: 404 })
    }

    const accessToken = clerkResponse[0].token
    oauth2Client.setCredentials({ access_token: accessToken })

    const drive = google.drive({
      version: 'v3',
      auth: oauth2Client,
    })

    const response = await drive.files.list()
    const files = response.data.files

    if (files.length > 0) {
      return NextResponse.json({ message: files }, { status: 200 })
    } else {
      return NextResponse.json({ message: 'No files found' }, { status: 200 })
    }
  } catch (error) {
    console.error('Error retrieving files:', error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
