import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Design tokens + reused buyer stylesheet (canonical: --navy-900 #0A1830, --amber #FF8A1F).
import './styles/site.css'
import './styles/tokens.css'
import './styles/app.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
