import React, { useState, useEffect } from 'react';
import '../styles/RecyclerSuggestionsCard.css';

export const RecyclerSuggestionsCard = ({ listingId, onRecyclerSelected }) => {
  const [recyclers, setRecyclers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('match'); // match, rating, distance

  useEffect(() => {
    if (listingId) {
      fetchSuggestedRecyclers();
    }
  }, [listingId]);

  const fetchSuggestedRecyclers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/packaging-waste/listings/${listingId}/suggested-recyclers`);
      const data = await response.json();
      if (data.success) {
        setRecyclers(data.data);
      } else {
        setError(data.message || 'Failed to fetch recyclers');
      }
    } catch (err) {
      setError('Error fetching suggested recyclers');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 85) return 'match-excellent';
    if (score >= 70) return 'match-good';
    if (score >= 50) return 'match-moderate';
    return 'match-low';
  };

  const getReasonLabel = (reasonCode) => {
    const reasons = {
      'capacity_match': 'Perfect Capacity Match',
      'high_rating': 'Highly Rated Recycler',
      'verified_recycler': 'Verified Partner',
      'specialty_match': 'Specialty in This Waste Type',
      'location_nearby': 'Located Nearby'
    };
    return reasons[reasonCode] || 'Capability Match';
  };

  const getLogoUrl = (logoPath) => {
    if (!logoPath || logoPath.trim() === '') return null;
    if (logoPath.startsWith('data:')) return logoPath;
    if (logoPath.startsWith('/')) return `http://localhost:54465${logoPath}`;
    if (logoPath.startsWith('http')) return logoPath;
    if (logoPath.length > 100 && /^[A-Za-z0-9+/=]+$/.test(logoPath)) return `data:image/png;base64,${logoPath}`;
    if (logoPath && !logoPath.startsWith('http')) return `http://localhost:54465/${logoPath}`;
    return logoPath;
  };

  const formatMatchScore = (score) => {
    return `${Math.round(score)}%`;
  };

  const handleContactRecycler = (recycler) => {
    onRecyclerSelected?.(recycler);
    // Could also open a contact modal or send a message
  };

  const sortedRecyclers = [...recyclers].sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  if (loading) {
    return <div className="recycler-suggestions loading">Loading suggested recyclers...</div>;
  }

  if (error) {
    return <div className="recycler-suggestions error">{error}</div>;
  }

  if (!recyclers.length) {
    return (
      <div className="recycler-suggestions empty">
        <p>No suitable recyclers found for this listing yet.</p>
      </div>
    );
  }

  return (
    <div className="recycler-suggestions">
      <div className="suggestions-header">
        <h3>Suggested Recyclers & Converters 🔄</h3>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="match">Best Match</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="recyclers-list">
        {sortedRecyclers.map((recycler) => (
          <div key={recycler.recyclerId} className={`recycler-card ${getMatchColor(recycler.matchScore)}`}>
            <div className="recycler-header">
              <div className="recycler-info">
                {recycler.logoUrl && (
                  <img src={getLogoUrl(recycler.logoUrl)} alt={recycler.companyName} className="recycler-logo" />
                )}
                <div className="recycler-name-section">
                  <h4>{recycler.companyName}</h4>
                  <p className="recycler-location">📍 {recycler.location}</p>
                </div>
              </div>
              <div className="match-score-badge">
                <div className="score">{formatMatchScore(recycler.matchScore)}</div>
                <div className="score-label">Match</div>
              </div>
            </div>

            <div className="recycler-rating">
              <span className="stars">{'⭐'.repeat(Math.round(recycler.rating))}</span>
              <span className="rating-value">{recycler.rating.toFixed(1)}/5</span>
              {recycler.isVerified && <span className="verified-badge">✓ Verified</span>}
            </div>

            <div className="match-reason">
              <span className="reason-tag">{getReasonLabel(recycler.reasonCode)}</span>
            </div>

            {/* Output Capabilities */}
            <div className="output-capabilities">
              <h5>Conversion Capabilities:</h5>
              <ul>
                {recycler.outputCapabilities?.map((cap) => (
                  <li key={cap.capabilityId}>
                    <strong>{cap.outputMaterialType}</strong>
                    <span className="capacity">
                      {cap.capacityPerMonth} {cap.capacityUnit}/month
                    </span>
                    {cap.costPerUnit && <span className="cost">${cap.costPerUnit}/unit</span>}
                    <span className="leadtime">Lead: {cap.leadTime} days</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Estimated Output */}
            {recycler.estimatedOutputAmount && (
              <div className="estimated-output">
                <p>
                  <strong>Estimated Output:</strong> {recycler.estimatedOutputAmount} {recycler.estimatedOutputUnit}
                  {recycler.estimatedOutputMaterial && ` of ${recycler.estimatedOutputMaterial}`}
                </p>
              </div>
            )}

            <div className="recycler-contact">
              <button
                className="contact-btn"
                onClick={() => handleContactRecycler(recycler)}
              >
                📧 Contact Recycler
              </button>
              {recycler.whatsappNumber && (
                <a
                  href={`https://api.whatsapp.com/send?phone=${recycler.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-btn"
                >
                  💬 WhatsApp
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecyclerSuggestionsCard;
