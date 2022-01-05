import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from 'axios';
import { useNavigate  } from "react-router-dom";

function Registration() {
  let navigate  = useNavigate ();
  const initialValues = {
    username: "",
    password: "",
  };
  const varidateSchema = yup.object().shape({
    username: yup
      .string()
      .min(3, "กรุณากรอกข้อมูล อย่างน้อย 3 ตัว")
      .max(15, "กรอกข้อมูล ได้ไม่เกิน 15 ตัว")
      .required("กรุณากรอกข้อมูล"),
    password: yup
      .string()
      .min(3, "กรุณากรอกข้อมูล อย่างน้อย 3 ตัว")
      .max(15, "กรอกข้อมูล ได้ไม่เกิน 15 ตัว")
      .required("กรุณากรอกข้อมูล"),
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(varidateSchema),
  });
  const onSubmit = (data) => {
    // console.log(data);
    axios.post("http://localhost:3001/auth", data).then((response)=>{
        // console.log(response.data);
        navigate("/");
        console.log("Success Registration");
      });
  };
  return (
    <div className="createPostPage">
      <form className="formContainer" onSubmit={handleSubmit(onSubmit)}>
        <label>
          <span>*</span> Username:
        </label>
        <input
          autoComplete="off"
          id="inputCreatePost"
          placeholder="(Ex. John123...)"
          {...register("username")}
        />
        {errors.username && <span>{errors.username.message}</span>}
        <label>
          <span>*</span> Password:
        </label>
        <input
          type="password"
          autoComplete="off"
          id="inputCreatePost"
          placeholder="You Password..."
          {...register("password")}
        />
        {errors.password && <span>{errors.password.message}</span>}
        <button type="submit">Registration</button>
      </form>
    </div>
  );
}

export default Registration;
