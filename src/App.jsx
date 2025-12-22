import './App.css'
import { Route, Routes } from 'react-router-dom'
import Header from './components/layout/Header'
import Register from './pages/Register'
import Footer from './components/layout/Footer'

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<div className="p-4">الصفحة الرئيسية</div>} />
        <Route path="/register" element={<Register />} />
        <Footer />
      </Routes>
    </>

  )
}

export default App
