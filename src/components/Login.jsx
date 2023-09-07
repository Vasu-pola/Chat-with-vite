import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import { auth } from "../firbase-config";
import Register from "./Register";
// import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      reset();
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const modalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="main-block ">
        <div className="logIn-Block p-3">
          <h4 className="text-center heading">Chat With You </h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-2">
              <label>Email:</label>
              {/* <input {...register("email")} className="form-control" />
              {errors.email && <p>{errors.email.message}</p>} */}
              <input
                type="email"
                className="form-control"
                {...register("email", {
                  required: true,
                  pattern: /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+\/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)/,
                })}
              />
              <p className="signUpeError ">{errors.email?.type === "required" && "Email is required"}</p>
              <p className="signUpeError ">{errors.email?.type === "pattern" && "Invalid Email Address"}</p>
            </div>
            <div className="p-2">
              <label>Password:</label>
              <input type="password" className="form-control" {...register("password", { required: true })} />
              <p className="signUpeError ">{errors.email?.type === "required" && "Password is required"}</p>
            </div>
            <div className="text-center">
              <Button type="submit" className="login-button m-2">
                Log In
              </Button>
              <p className="p-3">
                You don't have account?{" "}
                <Button className="register-button" onClick={() => setModalOpen(true)}>
                  Register
                </Button>
              </p>
            </div>
          </form>
        </div>
      </div>
      {/* <div className="text-center my-3">
        <Button onClick={handleSubmit}>Submit</Button>
      </div> */}
      {modalOpen && <Register open={modalOpen} close={() => modalClose()} />}
    </>
  );
};

export default Login;
