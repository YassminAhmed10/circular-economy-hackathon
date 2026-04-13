// src/pages/CircularMarketplace.jsx
import React, { useState, useEffect } from 'react';
import { getWasteAssets, createWasteAssetOffer, getWasteAssetOffers } from '../services/circularEconomyApi';
import '../styles/CircularMarketplace.css';

const CircularMarketplace = () => {
    const [wasteAssets, setWasteAssets] = useState([]);
    const [offers, setOffers] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [filterStatus, setFilterStatus] = useState('Available');
    const [showOfferForm, setShowOfferForm] = useState(false);
    const [offerData, setOfferData] = useState({
        offeredPrice: '',
        comment: ''
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        loadMarketplaceAssets();
    }, []);

    const loadMarketplaceAssets = async () => {
        setLoading(true);
        try {
            const result = await getWasteAssets(null, filterStatus);
            if (result.success) {
                setWasteAssets(result.data || []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAsset = async (asset) => {
        setSelectedAsset(asset);
        setShowOfferForm(true);

        // Load existing offers for this asset
        try {
            const result = await getWasteAssetOffers(asset.id);
            if (result.success) {
                setOffers(prev => ({
                    ...prev,
                    [asset.id]: result.data || []
                }));
            }
        } catch (error) {
            console.error('Error loading offers:', error);
        }
    };

    const handleSubmitOffer = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const offerPayload = {
                wasteAssetId: selectedAsset.id,
                offeredPrice: parseFloat(offerData.offeredPrice),
                comment: offerData.comment,
                recyclerId: user.id
            };

            const result = await createWasteAssetOffer(offerPayload);
            if (result.success) {
                alert('Offer submitted successfully!');
                setOfferData({ offeredPrice: '', comment: '' });
                setShowOfferForm(false);
                setSelectedAsset(null);
                loadMarketplaceAssets();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            alert('Error: ' + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="circular-marketplace">
            <div className="marketplace-header">
                <h1>🌍 Circular Economy Marketplace</h1>
                <p>Browse and bid on recyclable waste materials from factories</p>
            </div>

            <div className="marketplace-controls">
                <div className="filter-group">
                    <label>Filter by Status:</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">All</option>
                        <option value="Available">Available</option>
                        <option value="Pending">Pending</option>
                    </select>
                    <button className="btn-primary" onClick={loadMarketplaceAssets}>
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Offer Form Modal */}
            {showOfferForm && selectedAsset && (
                <div className="offer-modal">
                    <div className="offer-modal-content">
                        <button className="close-btn" onClick={() => setShowOfferForm(false)}>✕</button>
                        
                        <h2>Submit Offer for</h2>
                        <div className="asset-summary">
                            <h3>{selectedAsset.wasteTypeName}</h3>
                            <p><strong>Quantity:</strong> {selectedAsset.quantity} {selectedAsset.unit}</p>
                            <p><strong>Current Price:</strong> ${selectedAsset.estimatedPrice?.toFixed(2)}</p>
                            <p><strong>Location:</strong> {selectedAsset.location}</p>
                        </div>

                        <form onSubmit={handleSubmitOffer}>
                            <div className="form-group">
                                <label>Your Offer Price ($) *</label>
                                <input
                                    type="number"
                                    value={offerData.offeredPrice}
                                    onChange={(e) => setOfferData({...offerData, offeredPrice: e.target.value})}
                                    placeholder="Enter your bid"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Comments</label>
                                <textarea
                                    value={offerData.comment}
                                    onChange={(e) => setOfferData({...offerData, comment: e.target.value})}
                                    placeholder="Processing capabilities, pickup schedule, etc."
                                    rows="4"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? 'Submitting...' : '💰 Submit Offer'}
                                </button>
                                <button type="button" className="btn-cancel" onClick={() => setShowOfferForm(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>

                        {/* Existing Offers */}
                        {offers[selectedAsset.id]?.length > 0 && (
                            <div className="existing-offers">
                                <h4>Other Offers ({offers[selectedAsset.id].length})</h4>
                                <div className="offers-list">
                                    {offers[selectedAsset.id].map(offer => (
                                        <div key={offer.id} className="offer-item">
                                            <span className="price">${offer.offeredPrice.toFixed(2)}</span>
                                            <span className="status">{offer.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Waste Assets Grid */}
            <div className="marketplace-content">
                {loading && <p className="loading">Loading assets...</p>}

                {wasteAssets.length === 0 ? (
                    <p className="no-data">No waste assets available in the marketplace</p>
                ) : (
                    <div className="assets-grid">
                        {wasteAssets.map(asset => (
                            <div key={asset.id} className="marketplace-card">
                                <div className="card-header">
                                    <h3>{asset.wasteTypeName}</h3>
                                    <span className={`badge ${asset.status?.toLowerCase()}`}>
                                        {asset.status}
                                    </span>
                                </div>

                                <div className="card-body">
                                    <div className="info-row">
                                        <span className="label">Quantity:</span>
                                        <span className="value">{asset.quantity} {asset.unit}</span>
                                    </div>

                                    <div className="info-row">
                                        <span className="label">Price:</span>
                                        <span className="value price">${asset.estimatedPrice?.toFixed(2)}</span>
                                    </div>

                                    <div className="info-row">
                                        <span className="label">Location:</span>
                                        <span className="value">{asset.location}</span>
                                    </div>

                                    <div className="info-row">
                                        <span className="label">Company:</span>
                                        <span className="value">{asset.factoryName}</span>
                                    </div>

                                    <p className="description">{asset.description}</p>
                                </div>

                                <div className="card-footer">
                                    <button 
                                        className="btn-bid"
                                        onClick={() => handleSelectAsset(asset)}
                                    >
                                        💰 Place Bid
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CircularMarketplace;
