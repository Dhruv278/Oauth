"use client";

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Select, Input, Form } from "antd";
import GithubPNG from '@/public/githubIcon.png'
import styled, { keyframes } from "styled-components";
import Image from "next/image";
import { signOut } from "next-auth/react";

const { Option } = Select;

const GithubForm = () => {
    const [repo, setRepo] = useState([]);
    const [userData, setUserData] = useState<{ name: string; email: string; image: string } | undefined>();
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [selectedRepo,setSelectedRepo]=useState<{id:number,name:string,owner:string}|undefined>();
    const [showError,setShowError]=useState(false);
    const router=useRouter();

    useEffect(() => {
        const token = localStorage.getItem("githubToken");
        if (token) {
            try {
                fetchUserData(token).then((data) => {
                    if(data && data.repos && data.repos.length>0){

                        setRepo(data.repos);
                        setUserData({
                            name: data.name,
                            email: data.email,
                            image: data.image,
                        });
                    }
                }).catch((err:any)=>{
                    console.log("error",err);
                });
            } catch (err) {
                console.log(err)
               

            }
        } else {
            redirect("/");
        }
    }, []);

    const fetchUserData = async (token: string) => {
        try{

            const res = await fetch("/api/github/data", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if(res.status==200){
                return res.json();
            }else if(res.status==403){
                handleSignOut();
            }else{
                alert( "Something went wrong please try again!") 
            };
        }catch(error){
            console.log("hello error",error)
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("githubToken");
        console.log("Title:", title);
        console.log("Message:", message);
        console.log("Selected Repo:", repo); 
        if(!title || title.trim().length===0 || !message || message.trim().length ===0 || !selectedRepo){
            setShowError(true);
            return;
        }
        // Example API call to create an issue (replace with your API endpoint)
        const response = await fetch("/api/github/create-issue", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ title, message,repo:selectedRepo?.name,owner:selectedRepo?.owner }), // Include selected repo if needed
        });
        console.log("issue respones",response);

        if (response.ok) {
            alert("Issue created successfully!");
            // Reset fields after submission
            setTitle("");
            setMessage("");
        } else {
            alert("Failed to create issue.");
        }
    };
const handleSignOut=()=>{
    localStorage.removeItem("githubToken");
    localStorage.removeItem("jiraToken");
    signOut();
}
    return (
        <Container>
           
            {userData && (
                <>
                    <Greeting>
                        Hello, {userData.name} <WavingHand>👋</WavingHand>
                    </Greeting>
                    <ProfileImage src={userData.image} alt="Profile Image" />
                    <EmailLabel>Email: {userData.email} <SignOut onClick={()=>handleSignOut()}>Sign out</SignOut> </EmailLabel>
                    <SelectContainer>
                        <Select
                            placeholder="Select a repository"
                            style={{ width: '300px' }} 
                            onChange={(value:any)=>{
                                let selectedrepo=repo.filter((repo:any)=>{
                                    return  repo.name===value;

                                })
                                if(selectedrepo.length>0){
                                    setSelectedRepo(selectedrepo[0]);
                                }
                            }}
                        >
                            {repo.map((repository:any) => (
                                <Option key={repository.id} value={repository.name}>
                                    {repository.name}
                                </Option>
                            ))}
                        </Select>
                        {showError && (!selectedRepo) && <span style={{color:"red",fontSize:"12px"}}>Please select repository</span>}
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
                                <div >

                                <Image src={GithubPNG} alt="github Icon" style={{width:"30px",height:"30px",marginRight:"5px"}} />
                                </div>
                                Submit
                            </Button>
                        </Form>
                    </FormContainer>
                </>
            )}
        </Container>
    );
};

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

export default GithubForm;
