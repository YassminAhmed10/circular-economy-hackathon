import React from 'react'
import './LoadingScreen.css'

function LoadingScreen({ message = 'جاري التحميل...' }) {
  return (
    <div className="loading-screen" dir="rtl">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-inner">
            <div className="spinner-circle spinner-circle-1"></div>
            <div className="spinner-circle spinner-circle-2"></div>
            <div className="spinner-circle spinner-circle-3"></div>
            <div className="spinner-circle spinner-circle-4"></div>
          </div>
        </div>
        
        <div className="loading-text">
          <h2 className="loading-title">ECOv</h2>
          <p className="loading-message">{message}</p>
        </div>
        
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
        
        <div className="loading-tips">
          <p className="tip"> نصيحة: تأكد من اتصالك بالإنترنت</p>
          <p className="tip">يرجى الانتظار قليلاً...</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen