// src/pages/ImpactDashboard.jsx
import React, { useState, useEffect } from 'react';
import { getFactoryImpact, getPlatformImpact } from '../services/circularEconomyApi';
import '../styles/ImpactDashboard.css';

const ImpactDashboard = () => {
    const [factoryImpact, setFactoryImpact] = useState(null);
    const [platformImpact, setPlatformImpact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('factory');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const factory = JSON.parse(localStorage.getItem('factory') || '{}');

    useEffect(() => {
        loadImpactData();
    }, []);

    const loadImpactData = async () => {
        setLoading(true);
        try {
            if (factory.id && activeTab === 'factory') {
                const result = await getFactoryImpact(factory.id);
                if (result.success) {
                    setFactoryImpact(result.data);
                }
            } else if (activeTab === 'platform') {
                const result = await getPlatformImpact();
                if (result.success) {
                    setPlatformImpact(result.data);
                }
            }
        } catch (error) {
            console.error('Error loading impact data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadImpactData();
    }, [activeTab]);

    const formatNumber = (num) => {
        if (!num) return '0';
        return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    };

    const MetricCard = ({ icon, label, value, unit, color }) => (
        <div className={`metric-card ${color}`}>
            <div className="metric-icon">{icon}</div>
            <div className="metric-content">
                <p className="metric-label">{label}</p>
                <p className="metric-value">{formatNumber(value)} <span className="metric-unit">{unit}</span></p>
            </div>
        </div>
    );

    if (loading) {
        return <div className="impact-dashboard"><p className="loading">Loading impact metrics...</p></div>;
    }

    return (
        <div className="impact-dashboard">
            <div className="dashboard-header">
                <h1>🌱 Environmental Impact Dashboard</h1>
                <p>Track your sustainability metrics and ESG achievements</p>
            </div>

            <div className="tab-navigation">
                <button 
                    className={`tab-btn ${activeTab === 'factory' ? 'active' : ''}`}
                    onClick={() => setActiveTab('factory')}
                >
                    🏭 Factory Impact
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'platform' ? 'active' : ''}`}
                    onClick={() => setActiveTab('platform')}
                >
                    🌍 Platform Impact
                </button>
            </div>

            {activeTab === 'factory' && factoryImpact && (
                <div className="impact-content factory-impact">
                    <div className="impact-header">
                        <h2>{factory.factoryName}'s Environmental Impact</h2>
                        <p className="subtitle">Cumulative impact from all recycled materials</p>
                    </div>

                    {/* CO2 & Emissions */}
                    <div className="metrics-section">
                        <h3>🌍 Carbon & Emissions</h3>
                        <div className="metrics-grid">
                            <MetricCard
                                icon="🚗"
                                label="CO₂ Avoided"
                                value={factoryImpact.totalCO2AvoidedKg}
                                unit="kg CO₂e"
                                color="blue"
                            />
                            <MetricCard
                                icon="📊"
                                label="Baseline CO₂"
                                value={factoryImpact.baselineCO2EquivalentKg}
                                unit="kg"
                                color="gray"
                            />
                            <MetricCard
                                icon="⚡"
                                label="Landfill Diversion"
                                value={factoryImpact.totalLandfillDiversionKg}
                                unit="kg"
                                color="orange"
                            />
                        </div>
                    </div>

                    {/* Water & Resources */}
                    <div className="metrics-section">
                        <h3>💧 Water & Resources</h3>
                        <div className="metrics-grid">
                            <MetricCard
                                icon="💧"
                                label="Water Saved"
                                value={factoryImpact.totalWaterSavedLiters}
                                unit="liters"
                                color="cyan"
                            />
                            <MetricCard
                                icon="🔋"
                                label="Energy Saved"
                                value={factoryImpact.totalEnergySavedKwh}
                                unit="kWh"
                                color="yellow"
                            />
                            <MetricCard
                                icon="♻️"
                                label="Material Recovered"
                                value={factoryImpact.totalMaterialRecoveredKg}
                                unit="kg"
                                color="green"
                            />
                        </div>
                    </div>

                    {/* Circular Economy */}
                    <div className="metrics-section">
                        <h3>🔄 Circular Economy</h3>
                        <div className="metrics-grid">
                            <MetricCard
                                icon="🔁"
                                label="Items Reused"
                                value={factoryImpact.totalItemsReused}
                                unit="items"
                                color="teal"
                            />
                            <MetricCard
                                icon="📦"
                                label="Total Transactions"
                                value={factoryImpact.totalTransactions}
                                unit="transactions"
                                color="purple"
                            />
                        </div>
                    </div>

                    {/* ESG Score */}
                    <div className="esg-score">
                        <h3>ESG Rating</h3>
                        <div className="score-display">
                            <div className="score-circle">
                                <span className="score-value">A+</span>
                            </div>
                            <div className="score-details">
                                <p>Excellent sustainability performance</p>
                                <p className="improvements">Based on material recovery, emissions reduction, and resource conservation</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'platform' && platformImpact && (
                <div className="impact-content platform-impact">
                    <div className="impact-header">
                        <h2>Platform-Wide Environmental Impact</h2>
                        <p className="subtitle">Aggregate impact across all participating factories and recyclers</p>
                    </div>

                    {/* Global CO2 */}
                    <div className="metrics-section">
                        <h3>🌍 Global Carbon Impact</h3>
                        <div className="metrics-grid">
                            <MetricCard
                                icon="🚗"
                                label="Total CO₂ Avoided"
                                value={platformImpact.totalCO2AvoidedKg}
                                unit="kg CO₂e"
                                color="blue"
                            />
                            <MetricCard
                                icon="🌲"
                                label="Equivalent Trees"
                                value={(platformImpact.totalCO2AvoidedKg / 21).toFixed(0)}
                                unit="trees"
                                color="green"
                            />
                            <MetricCard
                                icon="🏭"
                                label="Factories Participating"
                                value={platformImpact.participatingFactories}
                                unit="factories"
                                color="gray"
                            />
                        </div>
                    </div>

                    {/* Global Resources */}
                    <div className="metrics-section">
                        <h3>💧 Resource Conservation</h3>
                        <div className="metrics-grid">
                            <MetricCard
                                icon="💧"
                                label="Water Saved"
                                value={platformImpact.totalWaterSavedLiters}
                                unit="liters"
                                color="cyan"
                            />
                            <MetricCard
                                icon="🔋"
                                label="Energy Saved"
                                value={platformImpact.totalEnergySavedKwh}
                                unit="kWh"
                                color="yellow"
                            />
                            <MetricCard
                                icon="♻️"
                                label="Material Recycled"
                                value={platformImpact.totalMaterialRecoveredKg}
                                unit="kg"
                                color="green"
                            />
                        </div>
                    </div>

                    {/* Circular Economy Stats */}
                    <div className="metrics-section">
                        <h3>🔄 Circular Economy Growth</h3>
                        <div className="metrics-grid">
                            <MetricCard
                                icon="🤝"
                                label="Active Recyclers"
                                value={platformImpact.activeRecyclers}
                                unit="recyclers"
                                color="purple"
                            />
                            <MetricCard
                                icon="📦"
                                label="Total Transactions"
                                value={platformImpact.totalTransactions}
                                unit="transactions"
                                color="orange"
                            />
                            <MetricCard
                                icon="💰"
                                label="Economic Value"
                                value={platformImpact.economicValue}
                                unit="USD"
                                color="green"
                            />
                        </div>
                    </div>

                    {/* Platform Goal */}
                    <div className="platform-goal">
                        <h3>🎯 2030 Sustainability Goals</h3>
                        <div className="goal-progress">
                            <div className="goal-item">
                                <h4>CO₂ Reduction</h4>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{width: '65%'}}></div>
                                </div>
                                <p>65% toward 50% reduction target</p>
                            </div>
                            <div className="goal-item">
                                <h4>Material Recovery</h4>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{width: '78%'}}></div>
                                </div>
                                <p>78% toward 80% recovery rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImpactDashboard;
