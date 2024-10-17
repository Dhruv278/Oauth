"use client";

import { signIn } from "next-auth/react";
import styled, { keyframes } from "styled-components";

import { useEffect, useState } from 'react'
import { getSession, useSession, signOut } from "next-auth/react"
import { redirect, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
let JIRA_API_CALLED=false;
const Homepage = () => {
    const { data: session } = useSession()
    const [loading,setLoading]=useState(false);
    const [isSlack,setIsSlack]=useState(false);
    const router = useRouter();
    const searchParams = useSearchParams()
    const isSlackParams=searchParams.get("isSlack") || false;
    const jiracode = searchParams.get('code')
    if(session){
        console.log(session);
        console.log(isSlackParams);
    }

    const handleClickGitGub=()=>{
        signIn('github')
    }

    useEffect(()=>{
        if(session ){
            getGithubJWTtoken();
        }
    },[session])

    useEffect(()=>{
      if(jiracode && !JIRA_API_CALLED){
        JIRA_API_CALLED=true;
        console.log("jiracode==>" ,jiracode);
        getJiraJWTToken(jiracode).then((data:any)=>{
            if(data.token){
              localStorage.setItem("jiraToken",data.token);
              router.push('/jira')
            }
        }).catch((error:any)=>{
          console.log("error in jira",error);
        })
      }
    },[jiracode])

    const generateJWT=async({data,authType}:{data:any,authType:string})=>{
        setLoading(true);
        const res = await fetch(`/api/jwt`, {
          method:"POST",
          body:JSON.stringify({
            authType,
            data
          })
          });
          setLoading(false);
          return res.json();
    }

    const getGithubJWTtoken=()=>{
        if(session){
            const data={
                token:session.accessToken,
                email:session.user?.email,
                image:session.user?.image,
                name:session.user?.name
            }
            generateJWT({data,authType:"github"}).then((data)=>{
               localStorage.setItem("githubToken",data.token);
               router.push('/github')
                
            }).catch((err)=>{
                console.log("error in generation jwt",err);
            });
        }
    }

    const getJiraJWTToken=async(code:string)=>{
      setLoading(true);
      const res = await fetch('/api/jira/getDataFromCode', {
        method:"POST",
        body:JSON.stringify({
          code
        })
        });
        setLoading(false);
        return res.json();
  }
    const handleClickJira=()=>{
      let randomNum=Math.random()*10000;
       window.location.href=`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=irPbpJVFMkva6rRZsf4RvoAcZk0V4iFc&scope=read%3Ame%20read%3Aaccount%20manage%3Ajira-project%20read%3Ajira-work%20read%3Ajira-user%20write%3Ajira-work&redirect_uri=https%3A%2F%2Fmain.d2luqupuks4wls.amplifyapp.com%2F&state=${randomNum}&response_type=code&prompt=consent`
    }

    // const handleClickSlack=()=>{
    //   setIsSlack(true);
    //   signIn("slack",{callbackUrl:"https://455b-116-73-217-138.ngrok-free.app/?isSlack=true"});
    // }
  return (
    <Container>
      {loading ? <div>loading</div>:<>
        <Heading>OAuth</Heading>
      <ButtonContainer >
        <Button onClick={()=>handleClickGitGub()}>Connect Github</Button>
        <Button onClick={()=>handleClickJira()} style={{marginTop:"30px"}}>Connect Jira</Button>
        {/* <Button onClick={()=>handleClickSlack()} style={{marginTop:"30px"}}>Connect Slack</Button> */}
      </ButtonContainer>
      <SubText>Designed by Dhruv Gopani</SubText>
      </>}
    </Container>
  );
};

export default Homepage;

// Slide in animations
const slideInLeft = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInRight = keyframes`
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f4f8;
`;

const Heading = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: #333;
  animation: ${slideInLeft} 1s ease forwards;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  animation: ${slideInRight} 1.2s ease forwards;
`;

const Button = styled.div`
  width: 150px;
  height: 50px;
  border-radius: 10px;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const SubText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #777;
  margin-top: 40px;
  opacity: 0.8;
`;
