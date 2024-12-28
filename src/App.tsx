// import GgMap from './core/module/feature/react-google-maps';
// import MapGl from './core/module/feature/visgl-react-google-maps';
// import ComponentMap from './core/module/feature/map/componentmap'
// import GGMap from './core/feature/map/componentmap'

import './App.css'
import { store } from './store'
import { Provider } from 'react-redux'
import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'wini-web-components'
import PrivateRoute from './core/module/auth/PrivateRoute';

const LoginView = lazy(() => import('./core/module/login/login'));
const Home = lazy(() => import('./core/module/home/home'));
const Chat = lazy(() => import('./core/module/chat/chat'));
const Group = lazy(() => import('./core/module/group/group'));
const NotFound = lazy(() => import('./core/module/NotFound/notfound'));

function App() {
  useEffect(() => {
    
  })
  return <Provider  store={store} stabilityCheck="always">  
    <BrowserRouter>
    <Suspense fallback={<div>Loading....</div>}>
    <ToastContainer />
      <Routes>
        {/* Route đăng nhập */}
        <Route path="/login" element={<LoginView />} />
        <Route path="*" element={<NotFound />} />
        {/* Route cần bảo vệ */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={ <Home /> } />
          <Route path="/chat/:conversationId" element={ <Chat /> } />
          <Route path="/group" element={ <Group /> }/>
        </Route>
      </Routes>
    </Suspense>
    </BrowserRouter>
  </Provider>
}

export default App
