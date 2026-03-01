// TestListing.js
import React, { useState } from 'react';

const API_BASE_URL = 'https://localhost:54464/api';

const TestListing = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const testMinimalListing = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const factory = JSON.parse(localStorage.getItem('factory') || '{}');

            // Minimal data that matches your database schema
            const testData = {
                type: "plastic",
                typeEn: "plastic",
                amount: 100,
                unit: "kg",
                price: 500,
                factoryId: user.factoryId || 2,
                factoryName: factory.factoryName || "Test Factory",
                location: "Cairo",
                description: "Test listing",
                category: "plastic",
                status: "Active",
                views: 0,
                offers: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                titleAr: "اختبار",
                titleEn: "Test",
                descriptionAr: "وصف تجريبي",
                descriptionEn: "Test description",
                companyNameAr: factory.factoryName || "شركة تجريبية",
                companyNameEn: factory.factoryName || "Test Company",
                locationAr: "Cairo",
                locationEn: "Cairo",
                weightAr: "100 kg",
                weightEn: "100 kg",
                rating: 5.0,
                reviews: 0,
                badge: "new",
                specifications: "{}",
                sellerRating: 5.0,
                sellerTotalSales: 0,
                sellerJoined: new Date().getFullYear().toString(),
                sellerWhatsapp: "01000000000",
                latitude: null,
                longitude: null,
                locationLink: null,
                imageUrl: null
            };

            console.log('Sending test data:', JSON.stringify(testData, null, 2));

            const response = await fetch(`${API_BASE_URL}/marketplace/waste-listings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(testData)
            });

            const data = await response.json();
            console.log('Response:', data);
            setResult({ status: response.status, data });
        } catch (err) {
            console.error('Error:', err);
            setResult({ error: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Test Listing Creation</h2>
            <button
                onClick={testMinimalListing}
                disabled={loading}
                style={{
                    padding: '1rem 2rem',
                    background: '#00e676',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '1rem'
                }}
            >
                {loading ? 'Testing...' : 'Test Create Listing'}
            </button>

            {result && (
                <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
                    {JSON.stringify(result, null, 2)}
                </pre>
            )}
        </div>
    );
};

export default TestListing;