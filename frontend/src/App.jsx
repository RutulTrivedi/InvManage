import './App.css'
import LoginPage from './auth/LoginPage';
import LayoutPage from './components/LayoutPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage';
import LocationPage from './pages/LocationPage';
import ProductPage from './pages/ProductPage';
import LogsPage from './pages/LogsPage';
import StocksPage from './pages/StocksPage';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Routes>
      <Route path='/home' element={<HomePage/>}/>
      <Route path='/login' element={<LoginPage />} />
      <Route element={<LayoutPage/>}>
        <Route path='/' element={<DashboardPage/>} />
        <Route path='/locations' element={<LocationPage/>} />
        <Route path='/categories' element={<CategoryPage/>} />
        <Route path='/products' element={<ProductPage/>} />
        <Route path='/logs' element={<LogsPage/>} />
        <Route path='/stocks' element={<StocksPage/>} />
      </Route>
    </Routes>
  )
}

export default App
