import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    // Check if the code is provided
    if (!code) {
      return NextResponse.json({ error: "code not found" }, { status: 404 });
    }

    // Fetch access token from Atlassian
    const tokenResponse = await fetch('https://auth.atlassian.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.JIRA_CLIENT_ID,
        client_secret: process.env.JIRA_CLIENT_SECRET,
        code: code,
        redirect_uri: `${process.env.NEXTAUTH_URL}/`,
      }),
    });

    // Check for token response status
    if (!tokenResponse.ok) {
      return NextResponse.json({ error: "Failed to obtain access token." }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();

    // Check if access token is present
    if (!tokenData.access_token) {
      return NextResponse.json({ error: "Access token not found." }, { status: 500 });
    }

    console.log("Access token:", tokenData.access_token);

    // Fetch user profile data
    const userResponse = await fetch('https://api.atlassian.com/me', {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    const userData = await userResponse.json();
    const { name, email, picture: image } = userData;

    // Fetch cloud ID to access project and create issues
    const cloudResponse = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    const cloudData = await cloudResponse.json();
    console.log(cloudData);
    const cloud_id = cloudData[0].id;
   
    // Generate JWT token with user data
    const token = jwt.sign(
      {
        authType: "jira",
        data: {
          cloud_id,
          name,
          email,
          image,
          token: tokenData.access_token,
        },
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    // Return the final JWT token
    return NextResponse.json({ token }, { status: 200 });

  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: 'An error occurred while creating the token.' }, { status: 500 });
  }
}
