// src/pages/WasteAssetManagement.jsx
import React, { useState, useEffect } from 'react';
import { createWasteAsset, getWasteAssets, updateWasteAsset } from '../services/circularEconomyApi';
import '../styles/WasteAssetManagement.css';

const WasteAssetManagement = () => {
    const [wasteAssets, setWasteAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        wasteTypeName: '',
        quantity: '',
        unit: 'kg',
        description: '',
        location: '',
        estimatedPrice: '',
        status: 'Available'
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const factory = JSON.parse(localStorage.getItem('factory') || '{}');

    useEffect(() => {
        loadWasteAssets();
    }, []);

    const loadWasteAssets = async () => {
        setLoading(true);
        try {
            const result = await getWasteAssets(factory.id);
            if (result.success) {
                setWasteAssets(result.data || []);
            } else {
                console.error('Error loading waste assets:', result.error);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                wasteTypeName: formData.wasteTypeName,
                quantity: parseFloat(formData.quantity),
                unit: formData.unit,
                description: formData.description,
                location: formData.location,
                estimatedPrice: parseFloat(formData.estimatedPrice) || 0,
                factoryId: factory.id,
                status: formData.status
            };

            let result;
            if (editingId) {
                result = await updateWasteAsset(editingId, payload);
            } else {
                result = await createWasteAsset(payload);
            }

            if (result.success) {
                alert(editingId ? 'Waste asset updated!' : 'Waste asset created!');
                resetForm();
                loadWasteAssets();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            alert('Error: ' + error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            wasteTypeName: '',
            quantity: '',
            unit: 'kg',
            description: '',
            location: '',
            estimatedPrice: '',
            status: 'Available'
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (asset) => {
        setFormData({
            wasteTypeName: asset.wasteTypeName,
            quantity: asset.quantity,
            unit: asset.unit,
            description: asset.description,
            location: asset.location,
            estimatedPrice: asset.estimatedPrice,
            status: asset.status
        });
        setEditingId(asset.id);
        setShowForm(true);
    };

    return (
        <div className="waste-asset-management">
            <div className="container">
                <h1>♻️ Waste Asset Management</h1>
                <p className="subtitle">Manage your recyclable waste materials</p>

                <button 
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '✕ Cancel' : '+ Create New Asset'}
                </button>

                {/* Form for creating/editing */}
                {showForm && (
                    <form className="waste-asset-form" onSubmit={handleSubmit}>
                        <h2>{editingId ? 'Edit Waste Asset' : 'Create New Waste Asset'}</h2>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Waste Type *</label>
                                <input
                                    type="text"
                                    name="wasteTypeName"
                                    value={formData.wasteTypeName}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Plastic Bottles, Cardboard"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Quantity *</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="Quantity"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Unit *</label>
                                <select name="unit" value={formData.unit} onChange={handleInputChange}>
                                    <option value="kg">kg</option>
                                    <option value="ton">ton</option>
                                    <option value="liter">liter</option>
                                    <option value="piece">piece</option>
                                    <option value="box">box</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Status *</label>
                                <select name="status" value={formData.status} onChange={handleInputChange}>
                                    <option value="Available">Available</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Sold">Sold</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Estimated Price ($)</label>
                                <input
                                    type="number"
                                    name="estimatedPrice"
                                    value={formData.estimatedPrice}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    step="0.01"
                                />
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Storage location"
                                />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the waste material (condition, composition, etc.)"
                                rows="4"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? 'Processing...' : (editingId ? 'Update Asset' : 'Create Asset')}
                            </button>
                            <button type="button" className="btn-cancel" onClick={resetForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Assets List */}
                <div className="waste-assets-list">
                    <h2>Your Waste Assets ({wasteAssets.length})</h2>

                    {loading && <p className="loading">Loading...</p>}

                    {wasteAssets.length === 0 ? (
                        <p className="no-data">No waste assets yet. Create one to get started!</p>
                    ) : (
                        <div className="assets-grid">
                            {wasteAssets.map(asset => (
                                <div key={asset.id} className="asset-card">
                                    <div className="asset-header">
                                        <h3>{asset.wasteTypeName}</h3>
                                        <span className={`status ${asset.status?.toLowerCase()}`}>
                                            {asset.status}
                                        </span>
                                    </div>

                                    <div className="asset-details">
                                        <div className="detail">
                                            <span className="label">Quantity:</span>
                                            <span className="value">{asset.quantity} {asset.unit}</span>
                                        </div>
                                        <div className="detail">
                                            <span className="label">Price:</span>
                                            <span className="value">${asset.estimatedPrice?.toFixed(2)}</span>
                                        </div>
                                        <div className="detail">
                                            <span className="label">Location:</span>
                                            <span className="value">{asset.location || 'N/A'}</span>
                                        </div>
                                        <div className="detail">
                                            <span className="label">Created:</span>
                                            <span className="value">
                                                {new Date(asset.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="description">{asset.description}</p>

                                    <div className="asset-actions">
                                        <button 
                                            className="btn-small btn-edit"
                                            onClick={() => handleEdit(asset)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button className="btn-small btn-view">
                                            👁️ View Offers
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WasteAssetManagement;
