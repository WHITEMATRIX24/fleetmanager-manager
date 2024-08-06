import React, { useState, useEffect } from 'react';
import './ScratchModal.css';

const ScratchModal = ({ show, vehicleNumber, onClose }) => {
  const [scratchImages, setScratchImages] = useState([]);
  const [vehicleName, setVehicleName] = useState('');
  const [imageToDelete, setImageToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchScratchImages = async () => {
      try {
        const response = await fetch('https://fleetmanager-manager.onrender.com/api/fetch-scratch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ vehicleNumber }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch scratch images');
        }

        const data = await response.json();
        console.log('Fetched Scratch Images:', data);
        setVehicleName(data.vehicleName);

        // Create an array of image objects with view and base64 data
        const imageObjects = [
          { view: 'LSV', images: Array.isArray(data.scratchLsvData.base64) ? data.scratchLsvData.base64 : [] },
          { view: 'RSV', images: Array.isArray(data.scratchRsvData.base64) ? data.scratchRsvData.base64 : [] },
          { view: 'FV', images: Array.isArray(data.scratchFvData.base64) ? data.scratchFvData.base64 : [] },
          { view: 'TV', images: Array.isArray(data.scratchTvData.base64) ? data.scratchTvData.base64 : [] },
          { view: 'BV', images: Array.isArray(data.scratchBvData.base64) ? data.scratchBvData.base64 : [] },
        ].flatMap(({ view, images }) => images.map(base64 => ({ view, base64 })));

        setScratchImages(imageObjects);
      } catch (error) {
        console.error('Error fetching scratch images:', error);
      }
    };

    if (show && vehicleNumber) {
      fetchScratchImages();
    }
  }, [show, vehicleNumber]);

  const handleDeleteClick = (image) => {
    setImageToDelete(image);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch('https://fleetmanager-manager.onrender.com/api/delete-scratch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vehicleNumber, image: imageToDelete }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setScratchImages(prevImages => prevImages.filter(img => img.base64 !== imageToDelete.base64));
      setShowConfirm(false);
      setImageToDelete(null);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setImageToDelete(null);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h1 className="modal-heading">SCRATCH GALLERY</h1>
        <h2>{`Vehicle: ${vehicleName} (${vehicleNumber})`}</h2>
        <div className="images-container">
          {scratchImages.length > 0 ? (
            scratchImages.map((image, index) => (
              <div key={index} className="saved-image-container">
                <p>{`View: ${image.view}`}  </p>
                <div className="image-wrapper">
                  <button onClick={() => handleDeleteClick(image)} className="delete-scratch-button">X</button>
                  <img src={`data:image/jpeg;base64,${image.base64}`} alt={`Saved ${index}`} className="saved-image" />
                </div>

              </div>
            ))
          ) : (
            <div className="saved-image-container">
              <p>No scratch images found.</p>
            </div>
          )}
        </div>
        {showConfirm && (
          <div className="confirm-popup">
            <p>Are you sure you want to delete this scratch image?</p>
            <button onClick={confirmDelete}>Confirm</button>
            <button onClick={cancelDelete}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScratchModal;
