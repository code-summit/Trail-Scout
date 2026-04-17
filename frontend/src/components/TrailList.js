import React from 'react';
import TrailCard from './TrailCard';
import './TrailList.css';

function TrailList({ trails }) {
  if (!trails || trails.length === 0) {
    return (
      <div className="empty-state">
        <p>No trails found. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="trail-list">
      {trails.map((trail) => (
        <TrailCard key={trail.id} trail={trail} />
      ))}
    </div>
  );
}

export default TrailList;
