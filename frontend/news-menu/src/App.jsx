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
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { TypeAnimation } from 'react-type-animation';

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
        // <div className="app-content" style={{marginLeft: "300px"}}>
        <Grid container spacing={2}
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
        }}>
          <Grid item xs={12}>
            <AppBar user={user} setUser={setUser}/>
          </Grid>

          <Grid item xs={12}>
            {!user ? (
              <div>
                <Typography variant="h2"
                sx={{
                  marginTop: "100px",
                  marginBottom: "50px"
                  }}>
                Welcome to your made-to-order news experience!
                </Typography>
                
                {/* Source: https://www.npmjs.com/package/react-type-animation */}
                <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '140px',
                  marginTop: 'none',
                  marginBottom: 'none',
                  // right: '500px',
                }}>
                  <Typography sx={{
                    fontSize: '30px',
                    display: 'inline-block',
                    marginBottom: "50px",
                    marginRight: "9px",
                    minWidth: "136px"
                  }}>Hear from</Typography>
                  <Box
                  sx={{
                    textAlign: 'left',
                    width: '600px',
                  }}
                  >
                    <TypeAnimation
                      preRenderFirstString={true}
                      sequence={[
                        // Same substring at the start will only be typed out once, initially
                        'someone who doesn\'t agree with you',
                        1000, // wait 1s before replacing "Mice" with "Hamsters"
                        'someone like you',
                        1000,
                        'someone who is curious',
                        1000,
                        'someone passionate about news',
                        1000
                      ]}
                      wrapper="span"
                      speed={50}
                      style={{ 
                        fontSize: '30px', 
                        display: 'inline-block',
                        marginBottom: "50px",
                        paddingBottom: "2px"
                       }}
                      repeat={Infinity}
                    />
                  </Box>
                </Box>
                <Typography variant="h6"
                sx={{
                  fontSize: "16px",
                  marginBottom: "50px"
                  }}>
                  Sign in to start getting news articles and discussions tailored to your interests.
                </Typography>
                <SignIn setUser={setUser} />
              </div>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={3} sm={3} md={3} lg={3}>  
                  <CreatePersona user={user} userPersonas={userPersonas} setUserPersonas={setUserPersonas}/>
                </Grid>
                <Grid item xs={9} sm={9} md={9} lg={9}>
                  <StartPage userPersonas={userPersonas}/>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
        // </div>
      )}
    </>
  )
}

export default App
