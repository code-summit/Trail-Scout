import React from 'react';
import './TrailCard.css';

function TrailCard({ trail }) {
  return (
    <div className="trail-card">
      <div className="trail-image" style={{ backgroundColor: '#ccc' }}>
        <img alt="Trail" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      </div>
      <div className="trail-content">
        <h3 className="trail-name">{trail.name}</h3>
        <p className="trail-location">📍 {trail.location}</p>
        
        <div className="trail-details">
          <span className="difficulty" data-level={trail.difficulty?.toLowerCase()}>
            {trail.difficulty}
          </span>
          <span className="distance">{trail.distance}</span>
        </div>
        
        <div className="trail-rating">
          <span className="stars">⭐ {trail.rating}</span>
        </div>
        
        <button className="view-btn">View Trail</button>
      </div>
    </div>
  );
}

export default TrailCard;
