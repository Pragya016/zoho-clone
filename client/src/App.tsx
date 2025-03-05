import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SignInCard from './components/SignInCard'
import Home from './pages/Home';
import SignUpCard from './components/SignUpCard';
import { AdminProvider } from './context/Admin';

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignInCard />}/>
          <Route path='/sign-up' element={<SignUpCard />}/>
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  )
}

export default App
