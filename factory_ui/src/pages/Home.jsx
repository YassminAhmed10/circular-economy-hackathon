import { Factory, TrendingUp, Droplet } from 'lucide-react'
import './Home.css'

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="nav-container">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="nav-logo">
              <Factory className="w-7 h-7 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">Dawr Al-Masane</span>
          </div>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Turn Your Industrial Waste into Profit
          </h1>
          <div className="flex gap-4 justify-center mt-8">
            <button className="hero-button hero-button-primary">
              Register Your Factory
            </button>
            <button className="hero-button hero-button-secondary">
              Find Industrial Waste
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="section-heading">Key Statistics</h3>
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon-container" style={{backgroundColor: '#3b82f6'}}>
              <Factory className="w-12 h-12 text-white" />
            </div>
            <div className="stat-value">1.2M Tons</div>
            <div className="stat-label">Annual Waste</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-container" style={{backgroundColor: '#10b981'}}>
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
            <div className="stat-value">45%</div>
            <div className="stat-label">Recyclable</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-container" style={{backgroundColor: '#f97316'}}>
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
            <div className="stat-value">500M EGP</div>
            <div className="stat-label">Market Value</div>
          </div>
        </div>
      </div>

      <div className="success-section">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="section-heading">Success Story</h3>
          <div className="story-card">
            <div className="story-grid">
              <div className="flex items-center justify-center">
                <div className="w-full h-64 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Droplet className="story-icon" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="story-title">Cooking Oil Factory</h4>
                <div className="mb-4">
                  <span className="story-savings">Saved: 13,000 EGP</span>
                </div>
                <p className="text-slate-600 mb-6">
                  By trading waste cooking oil for biofuel production.
                </p>
                <div className="flex gap-4">
                  <button className="action-button" style={{backgroundColor: '#10b981'}}>
                    Learn More
                  </button>
                  <button className="action-button" style={{backgroundColor: '#3b82f6'}}>
                    View Marketplace
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home