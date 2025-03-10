import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StartPage from './components/StartPage/StartPage';
import AppBar from './components/AppBar/AppBar';
import Story from './components/Story/Story';
import CreatePersona from './components/CreatePersona/CreatePersona';
import SignIn from './components/SignIn/SignIn';
import { auth, onAuthStateChanged } from "./firebase";
// import CircularProgress from '@mui/material/CircularProgress';

function App() {
  // const [count, setCount] = useState(0)
  const [user, setUser] = useState(null);
  const [gettingUser, setGettingUser] = useState(true);
  const [userPersonas, setUserPersonas] = useState([]);

  // Source: Asked Google AI search: "onauthstatechanged firebase react"
  useEffect(() => {
    const load = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setGettingUser(false);
      // console.log("loaded user from previous session: ", user);
    });
    return () => load();
  }, []);

  return (
    // <>
    //   <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>

    <>
      {!gettingUser && (
        <div className="app-content" style={{marginLeft: "300px"}}>
          <AppBar user={user} setUser={setUser}/>
          {!user ? (
          <SignIn setUser={setUser} />) : (
          <div>
            <CreatePersona user={user} userPersonas={userPersonas} setUserPersonas={setUserPersonas}/>
            <StartPage userPersonas={userPersonas}/>
          </div>
          )}
        </div>
      )}
    </>
  )
}

export default App
