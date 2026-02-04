import { useState } from 'react'
import { Factory } from 'lucide-react'
import './Registration.css'

function Registration() {
  const [formData, setFormData] = useState({
    factoryName: '',
    industryType: '',
    location: ''
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="header-logo">
            <Factory className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-slate-800">Dawr Al-Masane</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="section-header">
          <h2 className="section-title">Factory Registration</h2>
        </div>

        <div className="bg-white px-8 py-6 border-b border-slate-200">
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number step-active">1</div>
              <span className="step-label step-label-active">Factory Info</span>
            </div>
            <div className="step-divider" />
            <div className="step-item">
              <div className="step-number step-inactive">2</div>
              <span className="step-label step-label-inactive">Waste Details</span>
            </div>
            <div className="step-divider" />
            <div className="step-item">
              <div className="step-number step-inactive">3</div>
              <span className="step-label step-label-inactive">Verification</span>
            </div>
            <div className="step-divider" />
            <div className="step-item">
              <div className="step-number step-inactive">4</div>
              <span className="step-label step-label-inactive">Complete</span>
            </div>
          </div>
        </div>

        <div className="form-container">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Step 1: Factory Information</h3>
          
          <div className="max-w-2xl space-y-6">
            <div>
              <label className="form-label">
                Factory Name <span className="required-star">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your factory name"
                value={formData.factoryName}
                onChange={(e) => setFormData({...formData, factoryName: e.target.value})}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                Industry Type <span className="required-star">*</span>
              </label>
              <select
                value={formData.industryType}
                onChange={(e) => setFormData({...formData, industryType: e.target.value})}
                className="form-input"
              >
                <option value="">Select industry type</option>
                <option value="textiles">Textiles</option>
                <option value="chemicals">Chemicals</option>
                <option value="construction">Construction</option>
              </select>
            </div>

            <div>
              <label className="form-label">
                Location <span className="required-star">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter city, governorate"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="form-input"
              />
            </div>

            <button className="primary-button">
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registration