
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { RequestProvider } from './context/request'
import { Toaster } from './components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <RequestProvider>
        <App />
        <Toaster />
        <SonnerToaster position="top-right" />
      </RequestProvider>
    </AuthProvider>
  </BrowserRouter>
);
