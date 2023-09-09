import React, { useContext, useEffect, useState } from "react";
import "./page.css";
import { useNavigate } from "react-router";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "../firbase-config";
import { getAuth, updateProfile } from "firebase/auth";
import Modal from "react-bootstrap/Modal";
import { ChatContext } from "./context/ChatContextProvider";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const Navbar = () => {
  const [userName, setUserName] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const { dispatch } = useContext(ChatContext);
  const [updateName, setUpdateName] = useState();
  const [updateImgPre, setUpdateImgPre] = useState(null);
  const [updateImg, setUpdateImg] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUserName(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const navigate = useNavigate();

  const logout = () => {
    signOut(auth);
    dispatch({ type: "RESET" });
    navigate("/login");
  };
  const handleShow = () => {
    setIsOpen(true);
  };

  const imageChanges = () => {
    setUpdateImgPre();
  };

  const handleClose = () => {
    setIsOpen(false);
    setUpdateName("");
    setUpdateImg("");
  };

  const handleInputFile = () => {
    const fileInput = document.getElementById("imgInput");
    fileInput.click();
  };

  const handleImageChanges = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUpdateImgPre(e.target.result);
        setUpdateImg(selectedFile);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const CancleImage = () => {
    setUpdateImgPre(null);
    setUpdateImg(null);
  };

  const NameChange = (e) => {
    setUpdateName(e.target.value);
  };

  // const updateValues = async () => {
  //   // const auth = getAuth();
  //   const date = new Date().getTime();
  //   const storageRef = ref(storage, `${updateName ? updateName : userName?.displayName}_${date}`);
  //   await uploadBytesResumable(storageRef, updateImg ? updateImg : userName?.photoURL).then(() => {
  //     getDownloadURL(storageRef).then(async (downloadURL) => {
  //       try {
  //         await updateProfile(auth.currentUser, {
  //           displayName: updateName ? updateName : userName?.displayName,
  //           photoURL: downloadURL,
  //         })
  //           .then(() => {
  //             alert("profile Updated");
  //             handleClose();
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       } catch (err) {
  //         alert(err);
  //       }
  //     });
  //   });
  // };

  const updateValues = async () => {
    const auth = getAuth();
    const date = new Date().getTime();
    const storageRef = ref(storage, `${updateName ? updateName : userName?.displayName}_${date}`);

    try {
      if (updateImg) {
        // Upload the new image to Firebase Storage
        const uploadTask = uploadBytesResumable(storageRef, updateImg);

        await uploadTask;
        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        // Prepare an object to hold updated profile information
        const updatedProfile = {
          photoURL: downloadURL,
        };

        // Update display name if updateName is provided and not null
        if (updateName !== null && updateName !== undefined) {
          updatedProfile.displayName = updateName;
        }

        const userDocRef = doc(db, "users", auth.currentUser.uid);
        // Update the user's profile only if a new image was uploaded or displayName is updated
        if (downloadURL || updatedProfile.displayName) {
          await updateProfile(auth.currentUser, updatedProfile);
          await setDoc(
            userDocRef,
            {
              photoURL: downloadURL,
            },
            { merge: true }
          );
        }
      } else if (updateName !== null && updateName !== undefined) {
        // Update display name only if updateName is provided and not null
        await updateProfile(auth.currentUser, {
          displayName: updateName,
        });
        // const userDocRef = doc(db, "users", auth.currentUser.uid);
      } else  {
        // Update display name only if updateName is not provided and  null
        await updateProfile(auth.currentUser, {
          displayName: userName?.displayName,
        });
      }
      setUpdateName("");
      setUpdateImg("");
      alert("Profile Updated");
      handleClose();
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <>
      <div className="d-md-flex justify-content-between px-1 py-2 header">
        <p className="name">Chat With You</p>
        <div className="d-flex align-items-center">
          <img src={userName?.photoURL} width={40} className="profileImg" onClick={handleShow} />
          <p className="name pe-2 ps-1">{userName?.displayName}</p>
          <button className="logout-button" onClick={() => logout()}>
            logout
          </button>
        </div>
      </div>

      <Modal size="sm" show={isOpen}>
        <Modal.Header closeButton onHide={handleClose}>
          <Modal.Title className="modalTitle">Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="udProfile">
          <img src={updateImgPre ? updateImgPre : userName?.photoURL} width={"50%"} className="udprofileImg" />
          <div className="btns">
            <input type="file" accept="image/png,image/jpeg" id="imgInput" className="form-control " onChange={handleImageChanges} style={{ display: "none" }} />
            <button className="childbtn" onClick={handleInputFile}>
              upload
            </button>
            <button className="childbtn btn1" onClick={CancleImage}>
              cancel
            </button>
          </div>
          <div className="pt-4">
            <label>Name:</label>
            <input className="form-control" defaultValue={updateName ? updateName : userName?.displayName} id="imgInput" onChange={NameChange} />
          </div>
          <button className="childbtn btn2 mt-3" onClick={updateValues}>
            Update
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Navbar;
