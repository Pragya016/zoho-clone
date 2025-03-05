import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SignInCard from './components/SignInCard'
import Home from './pages/Home';
import SignUpCard from './components/SignUpCard';
import { UserProvider } from './context/User';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignInCard />}/>
          <Route path='/sign-up' element={<SignUpCard />}/>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
