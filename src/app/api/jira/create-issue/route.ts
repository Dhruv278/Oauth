// app/api/create-token/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createJiraIssue } from '@/lib/jira';

export async function POST(request: Request) {
    try {
        // Get the token from the request headers
        const token = request.headers.get('authorization')?.split(' ')[1];
        const body = await request.json(); // Use request.json() to parse the body
        const { title, message, project} = body; // Destructure the necessary fields
        console.log(body);
        console.log( request.headers);
        if (!token || !title || !message || !project) {
            return NextResponse.json({ error: 'Data not provided' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            authType:string,
            data:{
                token:string,
                cloud_id:string,
                name:string,
                email:string,
                image:string,
            }
        };
        console.log(decoded);
        console.log(title,message,project);
        if(decoded.authType==="jira"){

           let jiraToken=decoded.data.token;
           let res=await createJiraIssue(jiraToken,decoded.data.cloud_id,{project,title,message});
           return NextResponse.json({ res: res,message:"issue created"}, { status: 200 });
        
        }
        else{
            return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Error in creating issue' }, { status: 403 });
    }
}