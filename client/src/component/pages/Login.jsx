import { useState } from "react";
import { auth, db, storage } from "../../firebase/Firebase.js";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

function RegisterAndLogin() {
  const [login, setLogin] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [showForm, setShowForm] = useState(true);

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const addUser = async (email, password) => {
    try {
      const imgRef = ref(storage, `files/${v4()}`);
      const snapshot = await uploadBytes(imgRef, photo);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("File available at", downloadURL);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);
      // Add additional user data to Firestore
      await addDoc(collection(db, "users"), {
        Uid: user.uid,
        Email: email,
        Name: name,
        Password: password,
        Description: description,
        ProfilePicture: downloadURL,
        Sanskrit_point: 0,
        Hindi_point: 0,
        English_point: 0,
        Gujarati_point: 0,
        Total_Point_Earned: 0,
      });
      setLogin(true);
      toast.success("User added successfully");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Error adding user");
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (type === "Register") {
      try {
        await addUser(email, password);
        navigate("/login");
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        // Store user id in local storage
        console.log(user);
        localStorage.setItem("userId", user.email);
        navigate("/homepage");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="mb-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-purple-700">
            Learning Languages
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div
              className={`${
                !login
                  ? "text-blue-500 font-bold border-b-2 border-blue-500"
                  : "text-gray-500"
              } cursor-pointer mr-4 pb-2`}
              onClick={() => setLogin(false)}
            >
              Register
            </div>
            <div
              className={`${
                login
                  ? "text-blue-500 font-bold border-b-2 border-blue-500"
                  : "text-gray-500"
              } cursor-pointer pb-2`}
              onClick={() => setLogin(true)}
            >
              Sign In
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-6 text-center">
            {login ? "Sign In" : "Register"}
          </h1>
          {/* Show the form only if showForm is true */}
          {showForm && (
            <form
              onSubmit={(e) => handleSubmit(e, login ? "signin" : "Register")}
              className="space-y-4"
            >
              {!login && (
                <>
                  <div className="flex items-center justify-center">
                    <img
                      className="w-32 h-32 rounded-full object-cover"
                      src={
                        photo
                          ? URL.createObjectURL(photo)
                          : "https://via.placeholder.com/150"
                      }
                      alt="Profile"
                    />
                    <label
                      htmlFor="photo"
                      className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md cursor-pointer"
                    >
                      Upload Photo
                    </label>
                    <input
                      id="photo"
                      type="file"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </div>
                  <input
                    name="name"
                    placeholder="Name"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </>
              )}
              <input
                name="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full mt-4 bg-blue-500 text-white font-bold py-2 rounded-md focus:outline-none focus:bg-blue-600 hover:bg-blue-600 transition-colors duration-300"
              >
                {login ? "Sign In" : "Register"}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default RegisterAndLogin;
