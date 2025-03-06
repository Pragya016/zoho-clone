import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SignInCard from './components/SignInCard'
import Home from './pages/Home';
import SignUpCard from './components/SignUpCard';
import { AdminProvider } from './context/Admin';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { EmployeesProvider } from './context/Employees';

function App() {
  return (
    <Provider store={store}>
    <AdminProvider>
      <EmployeesProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignInCard />}/>
          <Route path='/sign-up' element={<SignUpCard />}/>
        </Routes>
      </BrowserRouter>
      </EmployeesProvider>
    </AdminProvider>
    </Provider>
  )
}

export default App
