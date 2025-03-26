import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore"; // Importing `doc` and `updateDoc`
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Importing `ref`, `uploadBytes`, and `getDownloadURL`
import { v4 } from "uuid"; // Importing `v4` from UUID
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import { db, storage } from "../../firebase/Firebase"; // Importing `storage`
//import { data } from "autoprefixer";

function ProfileEditPage() {
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userId");
    if (storedEmail) {
      setEmail(storedEmail);
      const q = query(
        collection(db, "users"),
        where("Email", "==", storedEmail)
      );
      getQuery(q);
    }
  }, []);

  const getQuery = async (q) => {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]; // Assuming there's only one user with the specified email
      const userData = doc.data();
      // console.log(doc.id, " => ", userData);
      setData(userData);
      setId(doc.id);
      setName(userData?.Name);
      setEmail(userData?.Email);
      setDescription(userData?.Description);
      setPhoto(userData?.ProfilePicture);
    } else {
      // console.log("No matching documents.");
    }
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Log the ID to see if it's correct
    // console.log("ID:", id);

    let updateData = {
      Name: name,
      Email: email,
      Description: description,
    };

    // Check if a new photo is selected
    if (photo) {
      const imgRef = ref(storage, `files/${v4()}`);
      await uploadBytes(imgRef, photo);
      const downloadURL = await getDownloadURL(imgRef);
      // console.log("New file available at", downloadURL);
      updateData.ProfilePicture = downloadURL;
    } else {
      // Keep the existing profile picture if no new photo is selected
      updateData.ProfilePicture = data.ProfilePicture;
    }

    console.log(updateData);
    // Check if `id` is not null or undefined before updating
    if (id) {
      await updateDoc(doc(db, "users", id), updateData);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } else {
      console.error("Error: ID is null or undefined");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center justify-center mb-4">
              <img
                className="w-32 h-32 rounded-full object-cover"
                src={photo || "https://via.placeholder.com/150"}
                alt="Profile"
              />
              <label
                htmlFor="photo"
                className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md cursor-pointer"
              >
                Change Photo
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
            <button
              type="submit"
              className="w-full mt-4 bg-blue-500 text-white font-bold py-2 rounded-md focus:outline-none focus:bg-blue-600 hover:bg-blue-600 transition-colors duration-300"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default ProfileEditPage;
