import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CrudApp from './Components/CrudApp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <CrudApp/>
    </>
  )
}

export default App
