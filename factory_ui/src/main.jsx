import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'  // Make sure this imports index.css

// ✅ Import test utilities for factory profile debugging
import * as TestFactoryData from './utils/testFactoryData.js'
window.TestFactoryData = TestFactoryData

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)