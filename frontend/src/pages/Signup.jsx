import axios from "axios"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/Subheading"
import React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const Signup = () => {
const [firstname, setFirstName] = useState('');
const [lastname, setLastName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const navigate = useNavigate();

const call = async () => {
  const response = await axios.post('http://localhost:3000/api/v1/user/signup',{email, password, firstname, lastname})

    if(response.data.success) {
      //console.log(response.data)
      console.log(response.data)
      localStorage.setItem('token', response.data.Token)
      navigate("/dashboard");
    }
    else{
      console.log('user already exists or incorrect details')
    }
}

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />
        <InputBox placeholder="John" label={"First Name"} setState={setFirstName} />
        <InputBox placeholder="Doe" label={"Last Name"} setState={setLastName}/>
        <InputBox placeholder="example@gmail.com" label={"Email"} setState={setEmail}/>
        <InputBox placeholder="123456" label={"Password"} setState={setPassword}/>
        <div className="pt-4">
          <Button label={"Sign up"} onclick={call}/>
          <button onClick={call}>signup</button>
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
}