// app/api/create-token/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createIssue, fetchGitHubRepos } from '@/lib/github';

export async function POST(request: Request) {
    try {
        // Get the token from the request headers
        const token = request.headers.get('authorization')?.split(' ')[1];
        const body = await request.json(); // Use request.json() to parse the body
        const { title, message, repo, owner } = body; // Destructure the necessary fields

        if (!token || !title || !message || !repo || !owner) {
            return NextResponse.json({ error: 'Data not provided' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            authType:string,
            data:{
                token:string,
                name:string,
                email:string,
                image:string,
            }
        };
        if(decoded.authType==="github"){

           let githubToken=decoded.data.token;
           let res=await createIssue(githubToken,owner,repo,{title,message});
           return NextResponse.json({ res: res,message:"issue created"}, { status: 200 });
        
        }
        else{
            return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Error in creating issue' }, { status: 403 });
    }
}