import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import {fetchJiraProjects} from '@/lib/jira'

export async function GET(request: Request) {
    try {
        // Get the token from the request headers
        const token = request.headers.get('authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Token not provided' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            authType:string,
            data:{
                cloud_id:string
                token:string,
                name:string,
                email:string,
                image:string,
            }
        };
        console.log(decoded);
        if(decoded.authType==="jira"){

            const projects = await fetchJiraProjects(decoded.data.token,decoded.data.cloud_id);
            console.log(projects);

            let filteredProjects=[]
            if(projects && projects.length>0){
                
                filteredProjects=projects.map((project:any)=>{
                    return {
                        name:project.name,
                        id:project.id,
                    }
                })
            }
            return NextResponse.json({ projects: filteredProjects,name:decoded.data.name,email:decoded.data.email,image:decoded.data.image }, { status: 200 });
        }
        else{
            return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }
}