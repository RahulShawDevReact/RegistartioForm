import { useState } from 'react'
import Register from './components/Register'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Register/>
    </>
  )
}

export default App
