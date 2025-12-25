import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Register from './pages/Register';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/login" element={ <Login />} />
        <Route path='/products' element={ <Products /> } />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
