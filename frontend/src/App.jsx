import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  async function handleSubmit() {
    let data = await fetch('http://localhost:3000/users',{
      method : 'POST',
      headers : {
        "Content-Type" : "application/json",
      },
      body : JSON.stringify(userData)
    }) 
    let res = await data.json()
    console.log(res)
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <div>
        <input
          onChange={(e) =>
            setUserData((prev) => ({
              ...prev,
              username: e.target.value,
            }))
          }
          type="text"
          name=""
          id=""
          placeholder="Enter Your Username"
        />{" "}
        <br /> <br />
        <input
          onChange={(e) =>
            setUserData((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
          type="email"
          name=""
          id=""
          placeholder="Enter Your Email"
        />{" "}
        <br /> <br />
        <input
          onChange={(e) =>
            setUserData((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          type="password"
          name=""
          id=""
          placeholder="Enter Your Password"
        />{" "}
        <br /> <br />
      </div>
      <button onClick={handleSubmit}>Sign Up</button>
    </div>
  );
}

export default App;
