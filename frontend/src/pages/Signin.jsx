import { useState } from "react";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/Subheading";
import { BottomWarning } from "../components/BottomWarning";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signin() {
  const [email, setEmail] =useState('')
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
   const call = async () => {
    await axios.post('http://localhost:3000/api/v1/user/signin',{email, password})
    .then((response)=>{
      const { data } = response;
      if(data.success) {
        localStorage.setItem('token', data.Token);
        navigate('/dashboard');
      }
    })
    .catch((e)=>{
      console.log(e);
    
    })
  }
    return (
      <div className="bg-slate-300 h-screen flex justify-center items-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-4">
                    <Heading label={"Sign in"} />
                    <SubHeading label={"Enter your information to create an account"} />
                    <InputBox placeholder="example@gmail.com" label={"Email"} setState={setEmail} />
                    <InputBox placeholder="123456" label={"Password"} setState={setPassword} />
                    <div className="pt-4">
                        {/* <Button label={"Sign Up"} onClick={call} /> */}
                        <button onClick={call}>signin</button>
                    </div>
                    <BottomWarning label={"Dont have an account?"} buttonText={"Sign Up"} to={"/signup"} />
                </div>
            </div>
        </div>
    )
}