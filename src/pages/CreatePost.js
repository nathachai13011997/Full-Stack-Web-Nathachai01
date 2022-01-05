import React, { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import { AuthContext }  from "../helpers/AuthContext";

function CreatePost() {
    const { authState } = useContext(AuthContext);
    let navigate  = useNavigate ();
    const initialValues = {
        title: "",
        postText: "",
        UserId: authState.id
    }

    useEffect(() => {
      // console.log("authState.status", authState.status);
      // console.log("authState.username", authState.username);
      if(!localStorage.getItem("accessToken")){
          navigate("/login");
      }
    }, [])

    const varidateSchema = yup.object().shape({
            title: yup.string().required("กรุณากรอกข้อมูล"),
            postText: yup.string().required("กรุณากรอกข้อมูล"),
          })
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(varidateSchema),
    });
    const onSubmit = (data) => {
        axios.post("http://localhost:3001/posts", data, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((response)=>{
            navigate("/");
          });
    }

  return (
    <>
      <div className="createPostPage">
      <form className="formContainer" onSubmit={handleSubmit(onSubmit)}>
        <label><span>*</span> Title:</label>
        <input id="inputCreatePost" placeholder="(Ex. Title...)" {...register("title")} />
        {errors.title && <span>{errors.title.message}</span>}
        <label><span>*</span> Post:</label>
        <input id="inputCreatePost" placeholder="(Ex. Post...)" {...register("postText")} />
        {errors.postText && <span>{errors.postText.message}</span>}
        <button type="submit">Create Post</button>
      </form>
    </div>
    </>
  );
}

export default CreatePost;
