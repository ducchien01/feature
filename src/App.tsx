import './App.css'
import { useEffect } from 'react';
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'wini-web-components'
import LoginView from './core/module/login/view'
import { Ultis } from './common/Utils';
import GgMap from './core/module/feature/react-google-maps';
// import MapGl from './core/module/feature/visgl-react-google-maps';
import ComponentMap from './core/module/feature/map/componentmap'
const checkToken = () => {
  const token = Ultis.getCookie('accessToken');
  if (token) return true;
  Ultis.clearCookie()
  return false;
}

function App() {
  useEffect(() => {
    
  })
  return <Provider  store={store} stabilityCheck="always">  
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/*" element={checkToken() ? <ComponentMap/> : <Navigate to={"/login"} replace />} />
      </Routes>
    </BrowserRouter>
  </Provider>
}

export default App
