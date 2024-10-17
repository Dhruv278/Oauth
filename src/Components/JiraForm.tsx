"use client";

import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import { Select, Input, Form } from "antd";
import Image from "next/image";

import GithubPNG from '@/public/githubIcon.png'
import { useRouter } from "next/navigation";


const { Option } = Select;

const JiraForm = () => {
    const [userData, setUserData] = useState<{ name: string; email: string; image: string } | undefined>();
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [projects, setProjects] = useState([]);
    const [selectedRepo,setSelectedRepo]=useState<{id:number,name:number}|undefined>();
    const [showError,setShowError]=useState(false);
    const router=useRouter()

    useEffect(()=>{
        let token=localStorage.getItem("jiraToken");
        if(token){
            fetch("/api/jira/getData",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }).then(res=>res.json()).then((data)=>{
                console.log(data);
                setUserData({
                    email:data.email,
                    name:data.name,
                    image:data.image
                })
                setProjects(data.projects || [])
            })
        }else{
            handleSignOut()
        }

    },[])

    const handleSignOut=()=>{
        localStorage.removeItem("jiraToken");
        localStorage.removeItem("githubToken");
        router.push("/");
    }

    const handleSubmit=async()=>{
        const token = localStorage.getItem("jiraToken");
        console.log("Title:", title);
        console.log("Message:", message);
        console.log("Selected Repo:", selectedRepo); 
        if(!title || title.trim().length===0 || !message || message.trim().length ===0 || !selectedRepo){
            setShowError(true);
            return;
        }
        const response = await fetch("/api/jira/create-issue", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ title, message,project:selectedRepo?.id }),
        });
        console.log("issue respones",response);

        if (response.ok) {
            alert("Task created successfully!");
            setTitle("");
            setMessage("");
        } else {
            alert("Failed to create issue.");
        }
    }

  return (
    <Container>
           
    {userData ? (
        <>
            <Greeting>
                Hello, {userData.name} <WavingHand>👋</WavingHand>
            </Greeting>
            <ProfileImage src={userData.image} alt="Profile Image" />
            <EmailLabel>Email: {userData.email} <SignOut onClick={()=>handleSignOut()}>Sign out</SignOut> </EmailLabel>
            <SelectContainer>
                <Select
                    placeholder="Select a project"
                    style={{ width: '300px' }} 
                    onChange={(value:any)=>{
                        let selected_project=projects.filter((repo:any)=>{
                            return  repo.name===value;

                        })
                        if(selected_project.length>0){
                            console.log(selected_project)
                            setSelectedRepo(selected_project[0]);
                        }
                    }}
                >
                    {projects.map((project:any) => (
                        <Option key={project.id} value={project.name}>
                            {project.name}
                        </Option>
                    ))}
                </Select>
                {showError && (!selectedRepo) && <span style={{color:"red",fontSize:"12px"}}>Please select project</span>}
            </SelectContainer>

            <FormContainer>
                <Form layout="vertical">
                    <Form.Item label="Title">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter issue title"
                        />
                        {showError && (!title || title.trim().length===0) && <span style={{color:"red",fontSize:"12px"}}>Please provide proper title</span>}
           
                    </Form.Item>
                    <Form.Item label="Message">
                        <Input.TextArea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter issue message"
                        />
                        {showError && (!message && message.trim().length===0) && <span style={{color:"red",fontSize:"12px"}}>Please provide proper message</span>}
           
                    </Form.Item>
                    <Button  onClick={handleSubmit}>
                       
                        Submit
                    </Button>
                </Form>
            </FormContainer>
        </>
    ): <div>Loading</div>}
</Container>
  )
}

export default JiraForm;

// Styled Components
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const waving = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  50% { transform: rotate(-10deg); }
  75% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
`;

const Container = styled.div`
    display: flex;
    width:100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f0f4f8;
    animation: ${fadeIn} 0.5s ease-in-out; // Animation for fade-in effect
`;

const Greeting = styled.h1`
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
`;

const WavingHand = styled.span`
    display: inline-block;
    animation: ${waving} 1s infinite; // Waving animation
    margin-left: 10px; // Space between the name and the emoji
`;

const ProfileImage = styled.img`
    border-radius: 50%;
    width: 150px; // Set the size of the profile image
    height: 150px;
    object-fit: cover;
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const EmailLabel = styled.div`
    font-size: 18px;
    font-weight: 500;
    color: #555;
    margin-bottom: 20px;
    display:flex;
    align-items:center;
    justify-content:center;
    

`;

const SelectContainer = styled.div`
    margin-top: 20px;
`;

const FormContainer = styled.div`
    margin-top: 20px;
    width: 300px; // Adjust the width to fit your layout
`;

const Button = styled.button`
  width: 100%;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background: transparent;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  color: black;
  transition: background-color 0.3s ease, transform 0.3s ease; // Smooth transitions for background and transform
    cursor:pointer;
  &:hover {
    transform: scale(1.05); // Slightly enlarge the button on hover
  }

  &:active {
    transform: scale(0.95); // Scale down when the button is clicked
  }
`;

const SignOut=styled.button`
width:86px;
border: 1px solid red;
display: flex;
align-items: center;
justify-content: center;
height: 36px;
margin-left:20px;
background: transparent;
border-radius: 5px;
font-size: 15px;
font-weight: bold;
color: red;
transition: background-color 0.3s ease, transform 0.3s ease; // Smooth transitions for background and transform
  cursor:pointer;
&:hover {
  transform: scale(1.05); // Slightly enlarge the button on hover
}

&:active {
  transform: scale(0.95); // Scale down when the button is clicked
}
`