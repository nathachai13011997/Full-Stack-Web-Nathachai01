import React, { useState, useContext } from 'react'
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Login() {
    const { setAuthState } = useContext(AuthContext);
    let navigate  = useNavigate ();
    const [data, setData ] = useState({
        username: "",
        password: ""
    });
    const login = () => {
        axios.post("http://localhost:3001/auth/login", data).then((response)=>{
            if(response.data.error){
                alert(response.data.error);
                // localStorage.clear();
            }else{
                setAuthState({ username: response.data.username, id: response.data.id, status: true });
                console.log("response.data", response.data);
                localStorage.setItem("accessToken", response.data.token);
                navigate("/");
            }
        })
    }

    return (
        <div className='loginContainer'>
            <label>Username:</label>
            <input type="text" onChange={(e)=>{ setData({...data ,username:e.target.value})}}/>
            <label>Password</label>
            <input type="password" onChange={(e)=>{ setData({...data ,password:e.target.value}) }}/>
            <button onClick={login}>Login</button>
        </div>
    )
}

export default Login
