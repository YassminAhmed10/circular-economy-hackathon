import React, { useState, useEffect } from 'react';
import '../styles/PackagingWasteListingForm.css';

export const PackagingWasteListingForm = ({ onSubmit, factoryId }) => {
  const [formData, setFormData] = useState({
    packageWasteSubtype: '',
    amount: '',
    unit: 'kg',
    price: '',
    currency: 'USD',
    contaminationLevel: 'low',
    foodContactSuitability: false,
    recyclabilityOptions: [],
    description: '',
    descriptionAr: '',
    imageUrl: '',
    expiresAt: '',
    locationNameEn: '',
    locationNameAr: '',
    latitude: null,
    longitude: null
  });

  const [subtypes, setSubtypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const recycleOptions = [
    'Recycled_Pellets',
    'Molded_Fiber',
    'Composite_Materials',
    'Packaging_Films',
    'Granules'
  ];

  const contaminationLevels = [
    { value: 'none', label: 'No Contamination' },
    { value: 'low', label: 'Low - Minimal residue' },
    { value: 'medium', label: 'Medium - Some residue' },
    { value: 'high', label: 'High - Significant contamination' }
  ];

  useEffect(() => {
    fetchSubtypes();
  }, []);

  const fetchSubtypes = async () => {
    try {
      const response = await fetch('/api/packaging-waste/subtypes');
      const data = await response.json();
      if (data.success) {
        setSubtypes(data.data);
      }
    } catch (err) {
      setError('Failed to load packaging waste subtypes');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRecycleOptionChange = (option) => {
    setFormData(prev => ({
      ...prev,
      recyclabilityOptions: prev.recyclabilityOptions.includes(option)
        ? prev.recyclabilityOptions.filter(opt => opt !== option)
        : [...prev.recyclabilityOptions, option]
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const response = await fetch('/api/marketplace/upload-image', {
        method: 'POST',
        body: formDataObj,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          imageUrl: data.data.imageUrl
        }));
      }
    } catch (err) {
      setError('Failed to upload image');
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/packaging-waste/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          packageWasteSubtype: formData.packageWasteSubtype,
          amount: parseFloat(formData.amount),
          unit: formData.unit,
          price: parseFloat(formData.price),
          currency: formData.currency,
          contaminationLevel: formData.contaminationLevel,
          foodContactSuitability: formData.foodContactSuitability,
          recyclabilityOptions: formData.recyclabilityOptions,
          description: formData.description,
          descriptionAr: formData.descriptionAr,
          imageUrl: formData.imageUrl,
          expiresAt: formData.expiresAt,
          locationNameEn: formData.locationNameEn,
          locationNameAr: formData.locationNameAr,
          latitude: formData.latitude,
          longitude: formData.longitude
        })
      });

      const data = await response.json();
      if (data.success) {
        onSubmit(data.data);
        setFormData({
          packageWasteSubtype: '',
          amount: '',
          unit: 'kg',
          price: '',
          currency: 'USD',
          contaminationLevel: 'low',
          foodContactSuitability: false,
          recyclabilityOptions: [],
          description: '',
          descriptionAr: '',
          imageUrl: '',
          expiresAt: '',
          locationNameEn: '',
          locationNameAr: '',
          latitude: null,
          longitude: null
        });
      } else {
        setError(data.message || 'Failed to create listing');
      }
    } catch (err) {
      setError('Error creating listing: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="packaging-waste-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h2>Sustainable Packaging Waste Listing</h2>
        
        {error && <div className="error-message">{error}</div>}

        {/* Waste Type Selection */}
        <div className="form-group">
          <label htmlFor="packageWasteSubtype">Packaging Waste Type *</label>
          <select
            id="packageWasteSubtype"
            name="packageWasteSubtype"
            value={formData.packageWasteSubtype}
            onChange={handleChange}
            required
          >
            <option value="">Select waste type...</option>
            {subtypes.map(subtype => (
              <option key={subtype.id} value={subtype.name}>
                {subtype.icon} {subtype.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount & Unit */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="unit">Unit *</label>
            <select name="unit" value={formData.unit} onChange={handleChange}>
              <option value="kg">Kilograms (kg)</option>
              <option value="ton">Tons</option>
              <option value="pieces">Pieces</option>
              <option value="m3">Cubic meters (m³)</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select name="currency" value={formData.currency} onChange={handleChange}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="AED">AED</option>
              <option value="SAR">SAR</option>
            </select>
          </div>
        </div>

        {/* Contamination Level */}
        <div className="form-group">
          <label htmlFor="contaminationLevel">Contamination Level *</label>
          <select
            id="contaminationLevel"
            name="contaminationLevel"
            value={formData.contaminationLevel}
            onChange={handleChange}
          >
            {contaminationLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          <small>Indicates the level of food residue or contaminants present</small>
        </div>

        {/* Food Contact Suitability */}
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="foodContactSuitability"
            name="foodContactSuitability"
            checked={formData.foodContactSuitability}
            onChange={handleChange}
          />
          <label htmlFor="foodContactSuitability">
            Suitable for Food-Contact Applications
          </label>
          <small>Indicates if material can be used for food-contact recycled applications</small>
        </div>

        {/* Recyclability Options */}
        <div className="form-group">
          <label>Possible Recycling Output Options</label>
          <div className="checkbox-group">
            {recycleOptions.map(option => (
              <div key={option} className="checkbox-item">
                <input
                  type="checkbox"
                  id={option}
                  checked={formData.recyclabilityOptions.includes(option)}
                  onChange={() => handleRecycleOptionChange(option)}
                />
                <label htmlFor={option}>{option.replace(/_/g, ' ')}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description (English) *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descriptionAr">Description (Arabic)</label>
          <textarea
            id="descriptionAr"
            name="descriptionAr"
            value={formData.descriptionAr}
            onChange={handleChange}
            rows="4"
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="locationNameEn">Location (English) *</label>
          <input
            type="text"
            id="locationNameEn"
            name="locationNameEn"
            value={formData.locationNameEn}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="locationNameAr">Location (Arabic)</label>
          <input
            type="text"
            id="locationNameAr"
            name="locationNameAr"
            value={formData.locationNameAr}
            onChange={handleChange}
          />
        </div>

        {/* Coordinates */}
        <div className="form-group">
          <button type="button" onClick={handleGetLocation} className="get-location-btn">
            📍 Get Current Location
          </button>
          {formData.latitude && (
            <p>Coordinates: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label htmlFor="imageUpload">Product Image</label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {formData.imageUrl && (
            <div className="image-preview">
              <img src={formData.imageUrl} alt="Preview" />
            </div>
          )}
        </div>

        {/* Expiration Date */}
        <div className="form-group">
          <label htmlFor="expiresAt">Listing Expiration Date *</label>
          <input
            type="date"
            id="expiresAt"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating Listing...' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
};

export default PackagingWasteListingForm;
