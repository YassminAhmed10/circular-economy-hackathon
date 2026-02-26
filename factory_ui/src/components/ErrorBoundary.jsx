import React, { Component } from 'react'
import './ErrorBoundary.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // يمكنك إرسال الخطأ لخدمة مثل Sentry هنا
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" dir="rtl">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            
            <h1 className="error-title">حدث خطأ غير متوقع</h1>
            
            <div className="error-details">
              <p className="error-message">
                عذراً، حدث خطأ في التطبيق. فريقنا يعمل على إصلاح المشكلة.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="debug-info">
                  <details>
                    <summary>تفاصيل الخطأ (للأغراض التقنية)</summary>
                    <pre className="error-stack">
                      {this.state.error.toString()}
                      <br />
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                </div>
              )}
            </div>

            <div className="error-actions">
              <button onClick={this.handleReload} className="error-btn error-btn-primary">
                 إعادة تحميل الصفحة
              </button>
              
              <button onClick={this.handleGoHome} className="error-btn error-btn-secondary">
                 العودة للرئيسية
              </button>
              
              <a 
                href="mailto:support@ecov.com" 
                className="error-btn error-btn-outline"
              >
                التواصل مع الدعم
              </a>
            </div>

            <div className="error-tips">
              <h3>نصائح قد تساعدك:</h3>
              <ul>
                <li>تأكد من اتصالك بالإنترنت</li>
                <li>جرب تحديث الصفحة (F5)</li>
                <li>امسح ذاكرة التخزين المؤقت للمتصفح</li>
                <li>إذا استمرت المشكلة، تواصل مع الدعم الفني</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary