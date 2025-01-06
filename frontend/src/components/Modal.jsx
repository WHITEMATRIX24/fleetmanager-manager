import React, { useState } from "react";
import "./Modal.css";
import imageCompression from "browser-image-compression";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Modal = ({ show, onClose, onImageSave }) => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [view, setView] = useState("LSV");
  const [images, setImages] = useState([]);
  const [filename, setFilename] = useState("");
  const [imageName, setImageName] = useState("");
  const [vehicleFound, setVehicleFound] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.1, // Maximum file size in MB (100 KB)
          maxWidthOrHeight: 300, // Maximum width or height in pixels
          useWebWorker: true, // Use web worker to improve performance
        };

        console.log("Compressing image...");
        let compressedFile = await imageCompression(file, options);
        console.log("Image compressed successfully.");

        // Ensure the compressed file size is within the desired limit
        while (compressedFile.size > 70 * 1024) {
          // 200 KB = 204800 bytes
          console.log("Re-compressing to meet size requirement...");
          options.maxSizeMB /= 2; // Reduce the maxSizeMB to further compress
          compressedFile = await imageCompression(compressedFile, options);
          console.log(
            "Compressed file size:",
            compressedFile.size / 1024,
            "KB"
          );
        }

        const base64Image = await toBase64(compressedFile);
        const cleanedBase64Image = base64Image.replace(
          /^data:image\/[a-zA-Z]+;base64,/,
          ""
        );

        setImages((prevImages) => [...prevImages, cleanedBase64Image]);
        setFilename(file.name);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  const handleSave = async () => {
    const currentDate = new Date().toLocaleString();
    if (images.length > 0 && filename) {
      try {
        const data = {
          vehicleNumber,
          view,
          images, // This should be an array of base64 encoded images
        };

        console.log("Sending data to server:", data);

        const response = await fetch(
          "http://13.50.175.179:5000/api/upload-image",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const responseData = await response.json();
        console.log("Server response:", responseData);

        if (response.ok) {
          console.log("Images uploaded successfully");
        } else {
          console.error("Failed to upload images:", responseData);
        }
      } catch (error) {
        console.error("Error uploading images:", error);
      }

      onClose();
    } else if (!imageName.trim() || images.length === 0) {
      return;
    }
    onImageSave(imageName, currentDate);
    setImageName("");
    onClose();
  };

  const handleVerify = async () => {
    try {
      const response = await fetch(
        "http://13.50.175.179:5000/api/verify-vehicle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vehicleNumber }),
        }
      );
      const data = await response.json();
      if (data.found) {
        setVehicleFound(true);
        setVerifyMsg("Vehicle found");
      } else {
        setVehicleFound(false);
        setVerifyMsg("Vehicle not found");
      }
    } catch (error) {
      console.error("Error verifying vehicle:", error);
    }
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
        <h2>UPLOAD IMAGE</h2>
        <input
          type="text"
          placeholder="Enter vehicle number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />
        <select
          value={view}
          className="c-input-field"
          style={{ width: "50%" }}
          onChange={(e) => setView(e.target.value)}
        >
          <option value="LSV">LSV</option>
          <option value="RSV">RSV</option>
          <option value="FV">FV</option>
          <option value="TV">TV</option>
          <option value="BV">BV</option>
        </select>
        <button
          className="c-submit-button"
          style={{ alignSelf: "center", marginTop: "10px" }}
          onClick={handleVerify}
        >
          Verify
        </button>
        <p>{verifyMsg}</p>
        <input
          type="file"
          onChange={handleImageChange}
          disabled={!vehicleFound}
        />
        <label htmlFor="image-name">
          <span className="mandatory"> </span>
        </label>
        <input
          type="text"
          placeholder="Enter image name"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
        />
        {images.length > 0 && (
          <div className="image-preview">
            <h3>Preview</h3>
            {images.map((img, index) => (
              <img
                key={index}
                src={`data:image/jpeg;base64,${img}`}
                alt="Preview"
              />
            ))}
          </div>
        )}
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={!imageName.trim() || !vehicleFound}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Modal;
