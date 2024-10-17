// app/api/create-token/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { fetchGitHubRepos } from '@/lib/github';

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
                token:string,
                name:string,
                email:string,
                image:string,
            }
        };
        if(decoded.authType==="github"){

            const repos = await fetchGitHubRepos(decoded.data.token);

            let filteredRepo=[]
            if(repos && repos.length>0){
                
                filteredRepo=repos.map((repo:any)=>{
                    return {
                        name:repo.name,
                        id:repo.id,
                        owner:repo.owner.login
                    }
                })
            }
            return NextResponse.json({ repos: filteredRepo,name:decoded.data.name,email:decoded.data.email,image:decoded.data.image }, { status: 200 });
        }
        else{
            return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }
}