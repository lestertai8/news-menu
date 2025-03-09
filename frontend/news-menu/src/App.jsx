import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StartPage from './components/StartPage/StartPage';
import AppBar from './components/AppBar/AppBar';
import Story from './components/Story/Story';
import CreatePersona from './components/CreatePersona/CreatePersona';

function App() {
  const [count, setCount] = useState(0)

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
    <div className="app-content">
      <AppBar/>
      <CreatePersona/>
      <StartPage/>
      {/* <Story
        title="Title"
        date="June 1, 2024"
        text="Once upon a time there were 3 little piggies. One day, a big bad wolf came along and blew them down."
        imageURL="https://picsum.photos/200"
        url="https://google.com"
        source="Google"
      /> */}
    </div>
  )
}

export default App
