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
const Requests = lazy(() => import('./core/module/requests/requests'));
const Chat = lazy(() => import('./core/module/chat/chat'));
const Archived = lazy(() => import('./core/module/archived/archived'));
const NotFound = lazy(() => import('./core/module/not-found/notfound'));

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
          <Route path="/" element={ <Chat /> } />
          <Route path="/chat/:conversationId" element={ <Chat /> } />
          <Route path="/requests" element={ <Requests /> }/>
          <Route path="/archived" element={ <Archived /> }/>
        </Route>
      </Routes>
    </Suspense>
    </BrowserRouter>
  </Provider>
}

export default App
