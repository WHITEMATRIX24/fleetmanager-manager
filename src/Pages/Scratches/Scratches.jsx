import { fabric } from 'fabric';
import React, { useState, useRef, useEffect } from 'react';
import Modal from '../../components/Modal';
import ScratchModal from '../../components/ScratchModal';
import cardefault from '../../assets/images/s.jpeg';
import imageCompression from 'browser-image-compression';
import './Scratches.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrush } from '@fortawesome/free-solid-svg-icons';
import { faPalette } from '@fortawesome/free-solid-svg-icons/faPalette';
function AddScratches() {
    const [clickedImageIndex, setClickedImageIndex] = useState(null);
    const [isScratchModalOpen, setIsScratchModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [selectedVehi, setSelectedVehi] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [vehiImages, setvehiImages] = useState([]);
    const [originalState, setOriginalState] = useState(null);
    const [currentView, setCurrentView] = useState(null); // LSV, RSV, etc.
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [revertType, setRevertType] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const drawingBoardRef = useRef(null);
    const [fabricCanvas, setFabricCanvas] = useState(null);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [brushColor, setBrushColor] = useState('#000000');
    const [selectedCar, setSelectedCar] = useState('sedan');
    const [brushWidth, setBrushWidth] = useState(1);
    const [zoomLevel, setZoomLevel] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [errorMessage, setErrorMessage] = useState('');
    const [savedImages, setSavedImages] = useState([]);
    const [showOverlay, setShowOverlay] = useState(true);
    const [showBrushSize, setShowBrushSize] = useState(false);
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const carImages = {

        sedan: [
            'assets/SEDAN/LSV.png',
            'assets/SEDAN/RSV.png',
            'assets/SEDAN/FV.png',
            'assets/SEDAN/BV.png',
            'assets/SEDAN/TV.png',
        ],
        suv: [
            'assets/SUV/LSV.png',
            'assets/SUV/RSV.png',
            'assets/SUV/FV.png',
            'assets/SUV/BV.png',
            'assets/SUV/TV.png',
        ],
        mpv: [
            'assets/MPV/LSV.png',
            'assets/MPV/RSV.png',
            'assets/MPV/FV.png',
            'assets/MPV/BV.png',
            'assets/MPV/TV.png',
        ],
        limousine: [
            'assets/LIMO/LSV.png',
            'assets/LIMO/RSV.png',
            'assets/LIMO/FV.png',
            'assets/LIMO/BV.png',
            'assets/LIMO/TV.png',
        ],
        bus: [
            'assets/BUS/LSV.png',
            'assets/BUS/RSV.png',
            'assets/BUS/FV.png',
            'assets/BUS/BV.png',
            'assets/BUS/TV.png',

        ]
    };
    const defaultCarModel = Object.keys(carImages)[0];
    const handleSearchChange = (event) => {
        setVehicleNumber(event.target.value.trim());
    };
    const handleSearchClick = async () => {
        try {
            if (!vehicleNumber.trim()) {
                setStatusMessage('Please enter a vehicle number');
                setSelectedVehi('');

                return;
            }

            const response = await fetch(`http://localhost:5000/api/vehicles?vehicleNumber=${vehicleNumber}`);
            const data = await response.json();

            if (response.ok) {
                if (data.length > 0) {
                    const vehicleName = data[0].vehicleName;
                    const vehicleType = data[0].vehicleType;

                    setStatusMessage(`Vehicle: ${vehicleName} (${vehicleType})`);
                    setSelectedVehi(vehicleType.toLowerCase());
                    setShowOverlay(false);
                    fetchImages(vehicleNumber);
                } else {
                    setStatusMessage('Vehicle not found');
                    setSelectedVehi('');

                }
            } else {
                setStatusMessage('Error finding vehicle');
                setSelectedVehi('');

            }
        } catch (error) {
            setStatusMessage('Error finding vehicle');
            setSelectedVehi('');

        }
    };
    useEffect(() => {
        if (statusMessage) {
            setTimeout(() => {
                setStatusMessage(''); // Clear status message after 3 seconds
            }, 3000);
        }
    }, [statusMessage]);
    useEffect(() => {
        const canvasElement = drawingBoardRef.current;

        if (!canvasElement) return;

        const canvas = new fabric.Canvas(canvasElement, {
            backgroundColor: '#ffffff',
        });

        setFabricCanvas(canvas);
        const firstImage = carImages[defaultCarModel]?.[0];
        if (firstImage) {
            fabric.Image.fromURL(firstImage, (img) => {

            });
        }

        // Set initial brush properties
        const brush = new fabric.PencilBrush(canvas);
        brush.color = brushColor;
        brush.width = brushWidth;

        canvas.freeDrawingBrush = brush;
        canvas.isDrawingMode = true;

        const saveInitialState = () => {
            const json = canvas.toJSON();
            setUndoStack([json]);
        };

        const saveCanvasState = () => {
            const json = canvas.toJSON();
            setUndoStack((prevStack) => [...prevStack, json]);
            setRedoStack([]);
        };

        saveInitialState();
        canvas.on('path:created', saveCanvasState);
        setFabricCanvas(canvas);


        return () => {
            canvas.off('path:created', saveCanvasState);
            canvas.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (fabricCanvas) {
            fabricCanvas.freeDrawingBrush.color = brushColor;
            fabricCanvas.freeDrawingBrush.width = brushWidth;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brushColor, brushWidth]);
    const resizeCanvasToImage = (img, zoomLevel) => {
        const canvasWidth = img.width * zoomLevel;
        const canvasHeight = img.height * zoomLevel;

        // Ensure fabricCanvas is properly defined
        if (!fabricCanvas) {
            console.error('fabricCanvas is not defined');
            return;
        }

        fabricCanvas.setWidth(canvasWidth);
        fabricCanvas.setHeight(canvasHeight);
        fabricCanvas.renderAll();
    };
    const handleBrushSizeChange = (event) => {
        const size = parseInt(event.target.value, 10);
        setBrushWidth(size);
    };

    const toggleBrushSize = () => {
        setShowBrushSize(!showBrushSize);
    };
    const toggleColorPicker = () => {
        setIsColorPickerVisible(!isColorPickerVisible);
    };

    const handleUndo = () => {
        if (undoStack.length < 2 || !fabricCanvas) return;
        const lastState = undoStack.pop();
        setRedoStack((prevStack) => [lastState, ...prevStack]);
        const prevState = undoStack[undoStack.length - 1];
        fabricCanvas.loadFromJSON(prevState, () => {
            const bgImage = fabricCanvas.backgroundImage;
            if (bgImage) {
                resizeCanvasToImage(bgImage, zoomLevel);
            }
            fabricCanvas.renderAll();
        });
        setUndoStack([...undoStack]);
    };

    const handleRedo = () => {
        if (redoStack.length === 0 || !fabricCanvas) return;
        const nextState = redoStack.shift();
        setUndoStack((prevStack) => [...prevStack, nextState]);
        fabricCanvas.loadFromJSON(nextState, () => {
            const bgImage = fabricCanvas.backgroundImage;
            if (bgImage) {
                resizeCanvasToImage(bgImage, zoomLevel);
            }
            fabricCanvas.renderAll();
        });
        setRedoStack([...redoStack]);
    };
    const handleZoomIn = () => {
        if (!fabricCanvas) return;
        if (!fabricCanvas.backgroundImage) {
            setErrorMessage('Cannot zoom on an empty canvas');
            return;
        }
        setErrorMessage('');
        setZoomLevel((prevZoomLevel) => {
            const newZoomLevel = prevZoomLevel * 1.1;
            fabricCanvas.setZoom(newZoomLevel);
            fabricCanvas.forEachObject((obj) => {
                if (obj.type === 'image' && obj._element) {
                    obj.scaleX *= 1.1;
                    obj.scaleY *= 1.1;
                    obj.setCoords();
                }
            });
            resizeCanvasToImage(fabricCanvas.backgroundImage, newZoomLevel);
            fabricCanvas.renderAll();
            return newZoomLevel;
        });
    };

    const handleZoomOut = () => {
        if (!fabricCanvas) return;
        if (!fabricCanvas.backgroundImage) {
            setErrorMessage('Cannot zoom on an empty canvas');
            return;
        }
        setErrorMessage('');
        setZoomLevel((prevZoomLevel) => {
            const newZoomLevel = prevZoomLevel / 1.1;
            fabricCanvas.setZoom(newZoomLevel);
            fabricCanvas.forEachObject((obj) => {
                if (obj.type === 'image' && obj._element) {
                    obj.scaleX /= 1.1;
                    obj.scaleY /= 1.1;
                    obj.setCoords();
                }
            });
            resizeCanvasToImage(fabricCanvas.backgroundImage, newZoomLevel);
            fabricCanvas.renderAll();
            return newZoomLevel;
        });
    };
    const handleClearCanvas = () => {
        if (!fabricCanvas) return;
        const json = fabricCanvas.toJSON();
        setUndoStack((prevStack) => [...prevStack, json]);
        setRedoStack([]);
        fabricCanvas.clear();
        fabricCanvas.backgroundColor = '#ffffff';
        fabricCanvas.renderAll();
        const clearedJson = fabricCanvas.toJSON();
        setUndoStack((prevStack) => [...prevStack, clearedJson]);
    };
    const handleImageClick = (image, index) => {
        if (!fabricCanvas) return;
        setShowOverlay(false); // Hide the overlay
        setClickedImageIndex(index);

        const isBase64 = (str) => {
            try {
                return btoa(atob(str)) === str;
            } catch (err) {
                return false;
            }
        };

        const imageUrl = isBase64(image) ? `data:image/png;base64,${image}` : image;
        console.log(imageUrl)
        fabric.Image.fromURL(imageUrl, (img) => {
            resizeCanvasToImage(img, zoomLevel);
            img.set({
                left: 0,
                top: 0,
                originX: 'left',
                originY: 'top',
            });
            fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
            const json = fabricCanvas.toJSON();
            setUndoStack((prevStack) => [...prevStack, json]);
            setRedoStack([]);
        }, { crossOrigin: 'anonymous' });
    };
    const handleCancelRevert = () => {
        setShowConfirmation(false); // Close the confirmation overlay
        // Optionally, you can handle cancel logic here
    };
    const handleConfirmRevert = async () => {
        setShowConfirmation(false); // Close the confirmation overlay
        try {
            const response = await fetch(`http://localhost:5000/api/vehicles/${vehicleNumber}/clear${revertType === 'previous' ? 'prev' : ''}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clickedImageIndex }),
            });

            if (response.ok) {
                console.log(`Reverted to ${revertType} and cleared latest entry successfully`);
                handleClearCanvas(); // Clear the canvas after saving the image
                setStatusMessage(`Reverted to ${revertType}`);
                fetchImages(vehicleNumber);
            } else {
                console.error('Error clearing latest entry');
            }
        } catch (error) {
            console.error('Error clearing latest entry:', error);
        }
    };
    const handleCloseScratchModal = () => {
        setIsScratchModalOpen(false);
    };
    const handleImageSave = (image, filename, imageName, date) => {
        const newImage = {
            newImage: image,
            filename: filename,
            imageName: imageName,
            date: date,
        };

        setSavedImages((prevImages) => [...prevImages, newImage]);
    };
    const handleRevertToOriginal = () => {
        if (fabricCanvas.getObjects().length === 0 && !fabricCanvas.backgroundImage && !showDropdown) {
            console.error('Canvas is empty, revert');
            setStatusMessage('Canvas is empty, cannot revert'); // Display error message to user
            return;
        }
        setRevertType('original');
        setShowConfirmation(true);
    };
    const handleRevertToPrevious = () => {
        if (fabricCanvas.getObjects().length === 0 && !fabricCanvas.backgroundImage && !showDropdown) {
            console.error('Canvas is empty, revert');
            setStatusMessage('Canvas is empty, cannot revert'); // Display error message to user
            return;
        }
        setRevertType('previous');
        setShowConfirmation(true);
    };
    const formatImagePath = (path) => {
        if (!path) return '';
        if (path.startsWith('uploads\\')) {
            return `http://localhost:5000/${path.replace(/\\/g, '/')}`;
        }

        else {
            return path; // Return base64 string as is
        }

    };
    const fetchImages = async (vehicleNumber) => {
        try {
            const response = await fetch(`http://localhost:5000/api/vehicles/${vehicleNumber}/images`);
            const data = await response.json();

            setvehiImages([
                formatImagePath(data.LSV),
                formatImagePath(data.RSV),
                formatImagePath(data.FV),
                formatImagePath(data.BV),
                formatImagePath(data.TV),
            ]);
        } catch (error) {
            setStatusMessage('Error fetching images');
            setvehiImages([]);
        }
    };
    const getLocalImageSrc = (vehicleType, imageName) => {
        return `/assets/${vehicleType.toUpperCase()}/${imageName}.png`;
    };
    const handleSaveImage = async () => {
        if (!fabricCanvas) return;

        // Check if the canvas is empty
        if (fabricCanvas.getObjects().length === 0 && !fabricCanvas.backgroundImage) {
            console.error('Canvas is empty, cannot save image');
            setStatusMessage('Canvas is empty, cannot save image'); // Display error message to user
            return;
        }

        // Get the data URL from the canvas
        const dataURL = fabricCanvas.toDataURL({
            format: 'png',
            quality: 1,
        });

        // Convert dataURL to Blob
        const blob = await fetch(dataURL).then(res => res.blob());

        // Compress the image
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };

        console.log('Compressing image...');
        let compressedFile = await imageCompression(blob, options);
        console.log('Image compressed successfully.');

        // Ensure the compressed file size is within the desired limit
        while (compressedFile.size > 70 * 1024) { // 200 KB = 204800 bytes
            console.log('Re-compressing to meet size requirement...');
            options.maxSizeMB /= 2; // Reduce the maxSizeMB to further compress
            compressedFile = await imageCompression(compressedFile, options);
            console.log('Compressed file size:', compressedFile.size / 1024, 'KB');
        }

        // Convert compressed file to base64
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
        });

        let fieldToUpdate = '';
        switch (clickedImageIndex) {
            case 0:
                fieldToUpdate = 'scratchLSV';
                break;
            case 1:
                fieldToUpdate = 'scratchRSV';
                break;
            case 2:
                fieldToUpdate = 'scratchFV';
                break;
            case 3:
                fieldToUpdate = 'scratchBV';
                break;
            case 4:
                fieldToUpdate = 'scratchTV';
                break;
            default:
                console.error('Invalid image index');
                return;
        }

        const payload = {
            field: fieldToUpdate,
            image: base64,
        };

        try {
            const response = await fetch(`http://localhost:5000/api/vehicles/${vehicleNumber}/scratch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log('Image saved successfully');
                handleClearCanvas(); // Clear the canvas after saving the image
                setStatusMessage('Image saved successfully');
                fetchImages(vehicleNumber);
            } else {
                console.error('Error saving image');
            }
        } catch (error) {
            console.error('Error saving image:', error);
        }
    };
    return (
        <div className='bod'>
            <div className='add-scratch'>
                <div className='sc'>
                    <div className='add-sc-top'>
                        <h2 style={{color:'#2C2D2D'}}>ADD SCRATCHES</h2>
                        <div className='search-box'>
                            <input
                                type="text"
                                placeholder="Search Vehicle Number"
                                className="search-bar"
                                value={vehicleNumber}
                                onChange={handleSearchChange}
                            />
                            <button onClick={handleSearchClick} className="fas fa-search"></button>
                        </div>
                    </div>
                    <div className='cont'>
                        {statusMessage && (
                            <div className="popup">
                                <p>{statusMessage}</p>
                            </div>
                        )}
                        <section className="tools-board">
                            {/* <div className="row">
                                <span>Selected Vehicle</span>
                                <input
                                    id="car-select"
                                    className="vehicle-type-input"
                                    value={selectedVehi.charAt(0).toUpperCase() + selectedVehi.slice(1)}
                                    readOnly
                                />
                            </div> */}
                            <div className="options">
                                <div className="brush-tool">
                                    <button className="brush-icon" onClick={toggleBrushSize}>
                                        <FontAwesomeIcon icon={faBrush} />
                                    </button>
                                    {showBrushSize && (
                                        <div className="brush-size-slider">
                                            <input
                                                type="range"
                                                id="size-slider"
                                                min="1"
                                                max="5"
                                                value={brushWidth}
                                                onChange={handleBrushSizeChange}
                                            />
                                        </div>
                                    )}
                                </div>

                            </div>
                            <div className="options">
                                <div className="color-picker">
                                    <button className="palette-icon" onClick={toggleColorPicker}>
                                        <FontAwesomeIcon icon={faPalette} />
                                    </button>
                                    {isColorPickerVisible && (
                                        <input
                                            type="color"
                                            id="color-picker"
                                            defaultValue="#000000"
                                            onChange={(e) => setBrushColor(e.target.value)}
                                            onBlur={() => setIsColorPickerVisible(false)} // Hide on focus loss
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="row controls">
                                <button className="undo-btn" onClick={handleUndo}><i className="fas fa-undo"></i></button>
                                <button className="redo-btn" onClick={handleRedo}><i className="fas fa-redo"></i></button>
                            </div>
                            <div className="row zoom-controls">
                                <button className="zoom-in" onClick={handleZoomIn}><i className="fas fa-search-plus"></i><br /></button>
                                <button className="zoom-out" onClick={handleZoomOut}><i className="fas fa-search-minus"></i><br /></button>
                            </div>
                            <div className="row buttons">
                                <button className="clear-canvas" onClick={handleClearCanvas}><i className="fas fa-trash"></i> Clear Canvas</button>
                            </div>
                        </section>
                    </div>
                    <div className='draw'>
                        <div className="conta">
                            <section className="draw-board" onDoubleClick={() => setIsScratchModalOpen(true)}>
                                <canvas ref={drawingBoardRef}>{statusMessage && <div className="status-message">{statusMessage}</div>}</canvas>
                                {showOverlay && (
                                    <div id="overlay"
                                        className='draw-overlay'
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                        }}
                                    >
                                        <h3>Select a car model to mark scratches!!</h3>
                                        <img src={cardefault} alt='cardefault' />
                                    </div>
                                )}
                            </section>
                            <div className='scratch'>
                                <div className='buttons-below'>
                                    <button className="save-img" onClick={handleRevertToOriginal}>Back to Original</button>
                                    <button className="save-img" onClick={handleRevertToPrevious}>Back to Previous</button>
                                    <button className="save-img" onClick={handleSaveImage}><i className="fas fa-save"></i> Update Image</button>
                                    <button className='scratch-gallery' onClick={() => setIsModalOpen(true)}><i className="fas fa-upload"></i> Upload Picture</button>
                                </div>
                            </div>
                        </div>
                        <div className='gallery'>
                            <section className={"image-gallery"}>
                                {vehiImages && vehiImages.length > 0 ? (
                                    vehiImages.map((image, index) => {
                                        if (image) {
                                            const names = ['LSV', 'RSV', 'FV', 'BV', 'TV']; // Custom names
                                            const customName = names[index] || `Image ${index + 1}`; // Fallback for additional images
                                            return (
                                                <div key={index} className="image-container">
                                                    <img
                                                        src={getLocalImageSrc(selectedVehi, customName)}
                                                        alt={`${selectedVehi.charAt(0).toUpperCase() + selectedVehi.slice(1)} ${index + 1}`}
                                                        className="cars-image"
                                                        onClick={() => handleImageClick(image, index)}
                                                    />
                                                    <p className="image-filename">{customName}</p> {/* Display the filename without extension */}
                                                </div>
                                            );
                                        } else {
                                            return null; // Or handle the case where image is null/undefined
                                        }
                                    })
                                ) : (
                                    <p>No images available for this vehicle.</p>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            <div id="driver"></div>
            <div className='dia'>
                {showConfirmation && (
                    <div className="overlay">
                        <div className="confirmation-modal">
                            <p>Are you sure you want to revert to {revertType === 'previous' ? 'previous' : 'original'}?</p>
                            <button onClick={handleConfirmRevert}>Confirm</button>
                            <button onClick={handleCancelRevert}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
            {isModalOpen && (
                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} onImageSave={handleImageSave}>
                    <h2>Scratch Image Upload</h2>
                    <p>Here you can add new scratch images.</p>
                </Modal>
            )}
            {isScratchModalOpen && (
                <ScratchModal
                    show={isScratchModalOpen}
                    vehicleNumber={vehicleNumber}
                    onClose={() => setIsScratchModalOpen(false)}
                />
            )}
        </div>
    )
}

export default AddScratches