import Modal from "react-bootstrap/Modal";
import React from "react";
import { useNavigate } from "react-router";
import Button from "react-bootstrap/Button";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useForm } from "react-hook-form";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, colref, db } from "../firbase-config";
import { addDoc } from "firebase/firestore";
import { storage } from "../firbase-config";

const Register = (props) => {
  const { open, close } = props;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const file = data.image[0];
    const displayName = data.name;
    const email = data.email;
    try {
      const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName}_${date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
          } catch (err) {
            console.log(err);
            // setErr(true);
            // setLoading(false);
          }
        });
      });
      close();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Modal show={open} centered onHide={close}>
        <Modal.Header closeButton >
          {/* <h5 className="text-center heading"> Chat With You</h5> */}
          <h6 className="text-center heading">Register Here</h6>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)} className="p-3">
          <div className="p-2">
            <label>Name:</label>
            <input type="text" placeholder="Name" className="form-control" {...register("name", { required: true })} />
            <p className="signUpeError ">{errors.name?.type === "required" && "Name is required"}</p>
          </div>
          <div className="p-2">
            <label>Email:</label>
            {/* <input {...register("email")} className="form-control" />
              {errors.email && <p>{errors.email.message}</p>} */}
            <input
              type="email"
              placeholder="Email Id"
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
            <input type="password" placeholder="Password" className="form-control" {...register("password", { required: true })} />
            <p className="signUpeError ">{errors.email?.type === "required" && "Password is required"}</p>
          </div>
          <div className="p-2">
            <label>Phone Number:</label>
            <input type="number" placeholder="Phone number" className="form-control" {...register("phonenumber", { required: true })} />
            <p className="signUpeError ">{errors.phonenumber?.type === "required" && "Phone number is required"}</p>
          </div>

          <div className="p-2">
            <label>Profile Image:</label>
            <input type="file" accept="image/png,image/jpeg" placeholder="Phone number" className="form-control" {...register("image", { required: true })} />
            <p className="signUpeError ">{errors.image?.type === "required" && "image is required"}</p>
          </div>
          <div className="text-center ">
            <Button type="submit" className="login-button">
              Register
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Register;
