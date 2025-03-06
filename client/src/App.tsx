import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SignInCard from './components/SignInCard'
import Home from './pages/Home';
import SignUpCard from './components/SignUpCard';
import { AdminProvider } from './context/Admin';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignInCard />}/>
          <Route path='/sign-up' element={<SignUpCard />}/>
        </Routes>
      </BrowserRouter>
    </AdminProvider>
    </Provider>
  )
}

export default App
