import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Register from './pages/Register';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import NotFoundPage from './pages/NotFoundPage';
import Offers from './pages/Offers';
import Comparison from './pages/Comparison';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/login" element={ <Login />} />
        <Route path='/products' element={ <Products /> } />
        <Route path='/offers' element={ <Offers /> } />
        <Route path='/comparison' element={ <Comparison /> } />
        <Route path='/cart' element={ <Cart /> } />
        <Route path='/checkout' element={ <Checkout /> } />
        <Route path='*' element={ <NotFoundPage /> } />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
