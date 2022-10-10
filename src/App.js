import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// firebase
import { db } from "./Configs/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function App() {
  // states

  // state to store the list of users
  const [users, setUsers] = useState([]);

  // state to store user data for creation or modification
  const [userData, setUserData] = useState({});

  // state to check if update button is clicked
  const [isUpdateUser, setIsUpdateUser] = useState({
    status: false,
    payload: {},
  });

  // refs
  const nameRef = useRef();
  const ageRef = useRef();
  const heightRef = useRef();

  // creating reference to the collection from the firebase database
  const usersCollectionRef = collection(db, "users");

  /*------------------CRUD Operations-------------------*/

  // Display users from database
  const getUsers = async () => {
    // getDocs returns the documents from the firebase firestore
    const data = await getDocs(usersCollectionRef);

    // setting data to users state
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // Create User
  const createUser = async () => {
    setUserData({
      name: nameRef.current.value,
      age: ageRef.current.value,
      height: heightRef.current.value,
    });

    console.log((userData));

    await addDoc(usersCollectionRef, userData);
  };

  // handle Update User details
  const handleUpdate = async (user) => {
    document.querySelector(".name").value = user.name;
    document.querySelector(".age").value = user.age;
    document.querySelector(".height").value = user.height;
    setIsUpdateUser({ status: true, payload: user });
  };

  // updating user details
  const updateUser = async () => {
     setUserData({
      name: nameRef.current.value,
      age: ageRef.current.value,
      height: heightRef.current.value,
      id: isUpdateUser.payload.id,
    });
    const userDoc = doc(db, "users", isUpdateUser.payload.id);
    try {
      await updateDoc(userDoc, userData);
      setIsUpdateUser({ status: false, payload: {} });
      setUserData({});
    } catch (error) {
      console.error(error);
    }
  };

  // Delete User details
  const deleteUser = async (user_id) => {
    const userDoc = await doc(db, "users", user_id);
    await deleteDoc(userDoc);
  };

  // displaying the list of users when page loads
  useEffect(() => {
    getUsers();
  }, [users]);

  return (
    <div className="App">
      <h1>Firebase CRUD using React</h1>
      <br />

      <input className="name" type="text" placeholder="Name" ref={nameRef} />
      <input className="age" type="number" placeholder="Age" ref={ageRef} />
      <input
        className="height"
        type="number"
        placeholder="Height"
        ref={heightRef}
      />
      <button onClick={isUpdateUser.status ? updateUser : createUser}>
        {isUpdateUser.status ? "Update" : "Create New User"}
      </button>

      <br />
      <h2>Users:</h2>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
            <p>Height: {user.height}</p>
            <div>
              <button onClick={() => handleUpdate(user)}> Update</button>
              <button onClick={() => deleteUser(user.id)}> Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
