import React from 'react';

const PolymorphicViewer = ({ asset }) => {
  if (!asset) return null;

  const { assetUrl, assetType, title } = asset;

  // Render logic based on asset type
  if (assetType === 'video') {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <video 
          controls 
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          src={assetUrl}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (assetType === 'image') {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
        <img 
          src={assetUrl} 
          alt={title} 
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
        />
      </div>
    );
  }

  if (assetType === 'pdf') {
    // Note: for production, a dedicated PDF viewer library (like react-pdf) is recommended.
    // An iframe works as a simple built-in browser fallback.
    return (
      <iframe 
        src={assetUrl} 
        title={title}
        style={{ width: '100%', height: '80vh', border: 'none' }}
      />
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
      Unsupported asset type: {assetType}
    </div>
  );
};

export default PolymorphicViewer;
