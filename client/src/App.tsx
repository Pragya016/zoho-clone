import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SigninCard from './components/SigninCard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sign-in' element={<SigninCard />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
