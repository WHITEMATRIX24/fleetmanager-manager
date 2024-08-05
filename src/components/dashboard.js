import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'; // Add this line
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import Sidebar from './sidebar';
import Header from './header';
import PerformanceMetrics from './performancemetrics';
import Planner from './planner';
import Trips from './trips';
import TripPopup from './TripPopup';
import Table from './table';
import SuccessPopup from './SuccessPopup';
import KeyCustody from './keycustody';
import Settings from './settings'; // Import the Settings component
import { ReactComponent as Edited } from '../assets/images/edit-3-svgrepo-com.svg';
import { ReactComponent as ScratchIcon } from '../assets/images/car-repair-svgrepo-com (1).svg'
import { ReactComponent as CarLocation } from '../assets/images/car-location-svgrepo-com.svg';
import { ReactComponent as Identity } from '../assets/images/id-card-svgrepo-com.svg';
import { ReactComponent as ServiceIcon } from '../assets/images/car-repairing-svgrepo-com.svg'
import { ReactComponent as GarageIcon } from '../assets/images/car-garage-vehicle-svgrepo-com.svg'
import { ReactComponent as CarFav } from '../assets/images/car-svgrepo-com.svg';
import { ReactComponent as Driver } from '../assets/images/truck-driver-svgrepo-com.svg'
import carGarage from '../assets/images/car-service-icon.svg';
import carService from '../assets/images/garage-icon.svg';
import './dashboard.css';
import carImage from '../assets/images/car2.jpeg';
import { fabric } from 'fabric';
import Modal from './Modal';
import ScratchModal from './ScratchModal';
import './styles.css';
import DriverNote from './drivernote';
import AddNote from './addnote';
import NotesDisplay from './Notes';
import StatusPopup from './StatusPopup';
import cardefault from '../assets/images/s.jpeg'
import NotesDisplayPlanner from './plannernote';
import imageCompression from 'browser-image-compression';
import LocationInput from './LocationInput';

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
};
const defaultCarModel = Object.keys(carImages)[0];
function Dashboard() {
    const [vehicleData, setVehicleData] = useState({
        vehiclename: '',
        vehiclenumber: '',
        insurancedue: '',
        isthimaradue: '',
        vehicletype: '',
        odometerreading: '',
        vehiclephoto: null,
    });
    const [driverData, setDriverData] = useState({
        drivername: '',
        driverid: '',
        driverpassword: '',
        drivermobile: '',
        driverlicenceno: '',
        driverlicenceexp: '',
    });
    const [driverCountID, setDriverCountID] = useState(0);
    const generateDriverID = () => {
        const newDriverID = `DR${String(driverCount).padStart(3, '0')}`;
        setDriverData((prevData) => ({ ...prevData, driverid: newDriverID }));
        setDriverCountID(driverCount + 1);
    };
    const handleClick = () => {
        // Navigate to the section with id 'scratches'
        const scratchesSection = document.getElementById('scratches');
        if (scratchesSection) {
            scratchesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const handleClickAssign = () => {
        // Navigate to the section with id 'scratches'
        const tripsSection = document.getElementById("trip");
        if (tripsSection) {
            tripsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const [fileName, setFileName] = useState('');

    const handleFileNameChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName('');
        }
    };

    // Combined handler for the onChange event


    const handleDriverChange = (e) => {
        const { name, value, files } = e.target;
        setDriverData({
            ...driverData,
            [name]: files ? files[0] : value,
        });
    };

    const [popupMessage, setPopupMessage] = useState('');

    const [showSucessPopup, setShowSucessPopup] = useState(false);
    const [showSucessDriverPopup, setShowSucessDriverPopup] = useState(false);
    const [showSucessTripPopup, setShowSucessTripPopup] = useState(false);
    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    const handleVehicleSubmit = async (e) => {
        e.preventDefault();

        if (!vehicleData.vehiclephoto) {
            alert("Please upload an image.");
            return;
        }

        const options = {
            maxSizeMB: 0.1,           // Initial maximum file size in MB (100 KB)
            maxWidthOrHeight: 300,    // Maximum width or height in pixels
            useWebWorker: true,       // Use web worker to improve performance
        };

        try {
            // Compress the image
            console.log('Compressing image...');
            let compressedFile = await imageCompression(vehicleData.vehiclephoto, options);
            console.log('Image compressed successfully.');

            // Log original and compressed file sizes
            console.log('Original file size:', vehicleData.vehiclephoto.size / 1024, 'KB');
            console.log('Compressed file size:', compressedFile.size / 1024, 'KB');

            // Ensure the compressed file size is within the desired limit
            while (compressedFile.size > 70 * 1024) { // 200 KB = 204800 bytes
                console.log('Re-compressing to meet size requirement...');
                options.maxSizeMB /= 2; // Reduce the maxSizeMB to further compress
                compressedFile = await imageCompression(compressedFile, options);
                console.log('Compressed file size:', compressedFile.size / 1024, 'KB');
            }

            // Convert the compressed image file to base64
            console.log('Converting image to base64...');
            let base64Image = await toBase64(compressedFile);
            console.log('Image converted to base64.');


            // Remove the base64 prefix
            base64Image = base64Image.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

            const formData = {
                vehiclename: vehicleData.vehiclename,
                vehiclenumber: vehicleData.vehiclenumber,
                insurancedue: vehicleData.insurancedue,
                isthimaradue: vehicleData.isthimaradue,
                vehicletype: vehicleData.vehicletype,
                odometerreading: vehicleData.odometerreading,
                vehiclephoto: base64Image,
                scratchLSV: '',
                scratchRSV: '',
                scratchFV: '',
                scratchBV: '',
                scratchTV: ''
            };

            const images = carImages[vehicleData.vehicletype.toLowerCase()];
            if (images) {
                formData.scratchLSV = images[0] || '';
                formData.scratchRSV = images[1] || '';
                formData.scratchFV = images[2] || '';
                formData.scratchBV = images[3] || '';
                formData.scratchTV = images[4];
            }

            console.log('Sending request...');
            const response = await fetch('http://localhost:5000/api/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Vehicle added successfully!');
                setPopupMessage('Vehicle added successfully!');
                setShowSucessPopup(true);
                setVehicleData({
                    vehiclename: '',
                    vehiclenumber: '',
                    insurancedue: '',
                    isthimaradue: '',
                    vehicletype: '',
                    odometerreading: '',
                    vehiclephoto: null,
                });
            } else {
                const errorText = await response.text();
                console.error(`Error adding vehicle: ${errorText}`);
                alert(`Error adding vehicle: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleChange = (event) => {
        handleVehicleChange(event);
        handleFileNameChange(event);
    };

    const handleVehicleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'vehiclephoto' && files) {
            const file = files[0];
            const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (validImageTypes.includes(file.type)) {
                setVehicleData({
                    ...vehicleData,
                    [name]: file,
                });
            } else {
                alert("Invalid file type. Please upload a JPG or PNG image.");
            }
        } else {
            setVehicleData({
                ...vehicleData,
                [name]: value,
            });
        }
    };

    // Helper function to convert a file to a base64 string


    const handleDriverSubmit = async (e) => {
        e.preventDefault();

        const driverData = {
            drivername: e.target.drivername.value,
            driverid: e.target.driverid.value,
            driverpassword: e.target.driverpassword.value,
            drivermobile: e.target.drivermobile.value,
            driverlicenceno: e.target.driverlicenceno.value,
            driverlicenceexp: e.target.driverlicenceexp.value,
        };

        try {
            const response = await fetch('http://localhost:5000/api/drivers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(driverData),
            });

            if (response.ok) {
                setPopupMessage('Driver added successfully!');
                setShowSucessDriverPopup(true);
                setDriverData({
                    drivername: '',
                    driverid: '',
                    driverpassword: '',
                    drivermobile: '',
                    driverlicenceno: '',
                    driverlicenceexp: '',
                })
            } else {
                const errorText = await response.text();
                alert(`Error adding driver: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the driver.');
        }
    };

    const [driverCount, setDriverCount] = useState(0);
    useEffect(() => {
        const fetchDriverCount = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/driverCount');
                const data = await response.json();
                setDriverCount(data.count);
                console.log(driverCount);
            } catch (error) {
                console.error('Error fetching driver count:', error);
            }
        };
        fetchDriverCount();
    }, []);

    const [tripData, setTripData] = useState({
        tripStartLocation: '',
        tripDestination: '',
        vehicleNumber: '',
        driverId: '',
        tripDate: '',
        tripEndDate: '',
        tripType: '',
        odometerReading: '',
        remunarationType: '',
        tripRemunaration: '',
    });
    const [tripCount, setTripCount] = useState(0);

    useEffect(() => {
        const fetchTripCount = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/tripCount');
                const data = await response.json();
                setTripCount(data.count);
            } catch (error) {
                console.error('Error fetching trip count:', error);
            }
        };
        fetchTripCount();
    }, []);

    const generateTripNumber = () => {
        const newTripNumber = `TR${String(tripCount).padStart(3, '0')}`;
        setTripData((prevData) => ({ ...prevData, tripNumber: newTripNumber }));
        setTripCount(tripCount + 1);
    };

    const handleTripSubmit = async (e) => {
        e.preventDefault();
        const newTripNumber = generateTripNumber(tripCount);
        const tripDataWithNumber = { ...tripData, tripNumber: newTripNumber };

        try {
            const response = await fetch('http://localhost:5000/api/trips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tripDataWithNumber),
            });

            if (response.ok) {
                setPopupMessage('Trip added successfully!');
                setShowSucessTripPopup(true);
                const result = await response.json();
                console.log('Trip assigned successfully:', result);
                // Reset form after successful submission
                setTripData({
                    tripStartLocation: '',
                    tripDestination: '',
                    vehicleNumber: '',
                    driverId: '',
                    tripDate: '',
                    tripEndDate: '',
                    tripType: '',
                    odometerReading: '',
                    remunarationType: '',
                    tripRemunaration: '',
                });
                setTripCount(tripCount + 1); // Increment trip count
            } else {
                console.error('Failed to assign trip');
            }
        } catch (error) {
            console.error('Error assigning trip:', error);
        }
    };
    const handleTripChange = (e) => {
        const { name, value } = e.target;
        setTripData({
            ...tripData,
            [name]: value,
        });
    };

    const [carCounts, setCarCounts] = useState({
        onTrip: 0,
        inYard: 0,
        inWorkshop: 0,
    });

    const fetchCarCounts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/vehicles');
            console.log('Response Status:', response.status);
            console.log('Response Headers:', response.headers);

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const contentType = response.headers.get('content-type');
            console.log('Content Type:', contentType);

            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.log('Response Text:', textResponse);
                throw new Error('Response is not JSON');
            }

            const vehicles = await response.json();
            console.log('Vehicles Data:', vehicles);

            // Process vehicles data as needed
            const counts = {
                onTrip: 0,
                inYard: 0,
                inWorkshop: 0,
            };

            vehicles.forEach(vehicle => {
                if (vehicle.vehicleStatus === 'On Trip') {
                    counts.onTrip += 1;
                } else if (vehicle.vehicleStatus === 'In Garage') {
                    counts.inYard += 1;
                } else if (vehicle.vehicleStatus === 'In Workshop') {
                    counts.inWorkshop += 1;
                }
            });

            return counts;
        } catch (error) {
            console.error('Error fetching car counts:', error);
            return { onTrip: 0, inYard: 0, inWorkshop: 0 };
        }
    };
    const handleLocationSelect = (name, address, latLng) => {
        setTripData({
            ...tripData,
            [name]: address,
            [`${name}LatLng`]: latLng,
        });
    };
    const totalCars = carCounts.onTrip + carCounts.inYard + carCounts.inWorkshop;
    const percentageOnTrip = (carCounts.onTrip / totalCars) * 100;
    const percentageInYard = (carCounts.inYard / totalCars) * 100;
    const percentageInWorkshop = (carCounts.inWorkshop / totalCars) * 100;
    const [showPopup, setShowPopup] = useState(false);
    const [showTripPopup, setShowTripPopup] = useState(false);
    const getCarCounts = async () => {
        try {
            const counts = await fetchCarCounts();
            setCarCounts(counts);
        } catch (error) {
            console.error('Error in getCarCounts:', error);
            // Handle error state or retries if needed
            setCarCounts({ onTrip: 0, inYard: 0, inWorkshop: 0 });
        }
    };

    useEffect(() => {
        getCarCounts();
    }, []);
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeSection, setActiveSection] = useState('');


    const [cars, setCars] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/vehicles');
                const result = await response.json();
                console.log('Fetched vehicles from API:', result);

                // Filter cars with status 'garage'
                const garageCars = result.filter(car => car.vehicleStatus === 'In Garage');
                console.log('Filtered garage cars:', garageCars);
                setCars(garageCars);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };
        fetchData();
    }, []);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? cars.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === cars.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const getCardClassName = (index) => {
        if (index === currentIndex) return "car-card active";
        if (index === (currentIndex + 1) % cars.length) return "car-card next";
        if (index === (currentIndex - 1 + cars.length) % cars.length) return "car-card prev";
        return "car-card";
    };
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('uploads\\') || imagePath.startsWith('uploads/')) {
            return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`;
        } else {
            return `data:image/png;base64,${imagePath}`;
        }
    };


    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section');
            const sidebarLinks = document.querySelectorAll('.sidebar a');

            let currentSection = '';

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop - sectionHeight) {
                    currentSection = section.id;
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Add this line

    const handleEditCarDetailsClick = () => {
        navigate('/editcar'); // Navigate to editcar page
    };
    const handleEditDriverDetailsClick = () => {
        navigate('/editdriver');
    };

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedImages, setSavedImages] = useState([]);
    const [isScratchModalOpen, setIsScratchModalOpen] = useState(false);
    const [showOverlay, setShowOverlay] = useState(true);
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
    }, []); // Only depend on [] for canvas initialization


    useEffect(() => {
        if (fabricCanvas) {
            fabricCanvas.freeDrawingBrush.color = brushColor;
            fabricCanvas.freeDrawingBrush.width = brushWidth;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brushColor, brushWidth]); // Update brush color without affecting canvas

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
    const [clickedImageIndex, setClickedImageIndex] = useState(null);

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

    const handleBrushSizeChange = (event) => {
        const size = parseInt(event.target.value, 10);
        setBrushWidth(size);
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



    const handleCloseScratchModal = () => {
        setIsScratchModalOpen(false);
    };

    const [vehicleNumber, setVehicleNumber] = useState('');
    const [selectedVehi, setSelectedVehi] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [vehiImages, setvehiImages] = useState([]);
    const [originalState, setOriginalState] = useState(null);
    const [currentView, setCurrentView] = useState(null); // LSV, RSV, etc.
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [revertType, setRevertType] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownOptions, setDropdownOptions] = useState([


    ]);



    const handleRevertToPrevious = () => {
        if (fabricCanvas.getObjects().length === 0 && !fabricCanvas.backgroundImage && !showDropdown) {
            console.error('Canvas is empty, revert');
            setStatusMessage('Canvas is empty, cannot revert'); // Display error message to user
            return;
        }
        setRevertType('previous');
        setShowConfirmation(true);
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

    const handleCancelRevert = () => {
        setShowConfirmation(false); // Close the confirmation overlay
        // Optionally, you can handle cancel logic here
    };

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
    useEffect(() => {
        if (statusMessage) {
            setTimeout(() => {
                setStatusMessage(''); // Clear status message after 3 seconds
            }, 3000);
        }
    }, [statusMessage]);

    const handleCarModelChange = (event) => {
        setSelectedCar(event.target.value);
        setShowOverlay(false); // Hide the overlay
    };
    const getImageSrc = (image) => {
        if (!image) return '';
        if (image.startsWith('uploads\\') || image.startsWith('uploads/')) {
            return `http://localhost:5000/${image.replace(/\\/g, '/')}`;
        } else {
            return `data:image/png;base64,${image}`;
        }
    };
    const getLocalImageSrc = (vehicleType, imageName) => {
        return `/assets/${vehicleType.toUpperCase()}/${imageName}.png`;
    };


    return (
        <div className="dashboard">
            <Sidebar activeSection={activeSection} />
            <div className="main-content">
                <div className="header-div">
                    <Header />
                </div>
                <section id='dashboard'>
                    <div className="content-with-header">
                        <div className="content">
                            <div className="left">
                                <div className="car-cards">
                                    <button onClick={goToPrevious} className="carousel-button left">&#9664;</button>
                                    {cars.map((car, index) => (
                                        <div key={index} className={getCardClassName(index)}>
                                            <div className="car-overlay">
                                                <span className="car-status">Available<br />
                                                    Car Number: {car.vehicleNumber}</span>
                                            </div>
                                            <img src={getImageUrl(car.vehiclePhoto)} alt={`Car ${index + 1}`} />
                                            <button className="assign-button" onClick={handleClickAssign}>Assign Trip</button>
                                        </div>
                                    ))}
                                    <button onClick={goToNext} className="carousel-button right">&#9654;</button>
                                </div>
                                <div id="vehicle" className='planner'>
                                    <NotesDisplayPlanner />
                                </div>

                            </div>
                            <div className="right">
                                <PerformanceMetrics />

                                <Trips />

                            </div>
                        </div>
                    </div>
                </section>
                <section id='vehicle' >
                    <div className="vehicle">
                        <div className="contents">
                            <div className="left">
                                <div className="add-car">
                                    <div className="form-container">
                                        <form className="c-form-car" onSubmit={handleVehicleSubmit}>
                                            <h2 className="c-form-car-header">ADD A CAR</h2>
                                            <div className="c-form-field-row-car">
                                                <div className="c-form-field-column-car" style={{ width: '33%' }}>
                                                    <label htmlFor="vehiclename" className="c-form-field-label-car">Vehicle Name</label>
                                                    <input
                                                        type="text"
                                                        name="vehiclename"
                                                        id="vehiclename"
                                                        placeholder="Vehicle Name"
                                                        className="c-input-field-car"
                                                        value={vehicleData.vehiclename}
                                                        onChange={handleVehicleChange}
                                                    />
                                                </div>
                                                <div className="c-form-field-column-car" style={{ width: '33%' }}>
                                                    <label htmlFor="vehiclenumber" className="c-form-field-label-car">Vehicle Number</label>
                                                    <input
                                                        type="text"
                                                        name="vehiclenumber"
                                                        id="vehiclenumber"
                                                        placeholder="Vehicle Number"
                                                        className="c-input-field-car"
                                                        value={vehicleData.vehicleNumber}
                                                        onChange={handleVehicleChange}
                                                    />
                                                </div>
                                                <div className="c-form-field-column-car" style={{ width: '33%' }}>
                                                    <label htmlFor="vehicletype" className="c-form-field-label-car">Vehicle Type</label>
                                                    <select
                                                        name="vehicletype"
                                                        id="vehicletype"
                                                        className="c-input-field-car"
                                                        value={vehicleData.vehicletype}
                                                        onChange={handleVehicleChange}
                                                    >
                                                        <option value="">Select Vehicle Type</option>
                                                        <option value="SUV">SUV</option>
                                                        <option value="MPV">MPV</option>
                                                        <option value="Sedan">Sedan</option>
                                                        <option value="Limousine">Limousine</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="c-form-field-row-car">
                                                <div className="c-form-field-column-car" style={{ width: '75%' }}>
                                                    <label htmlFor="insurancedue" className="c-form-field-label-car">Insurance Due Date</label>
                                                    <input
                                                        type="date"
                                                        name="insurancedue"
                                                        id="insurancedue"
                                                        placeholder="dd-mm-yyyy"
                                                        className="c-input-field-car"
                                                        value={vehicleData.insurancedue}
                                                        onChange={handleVehicleChange}
                                                    />
                                                </div>
                                                <div className="c-form-field-column-car" style={{ width: '50%' }}>
                                                    <label htmlFor="isthimaradue" className="c-form-field-label-car">Isthimara Due Date</label>
                                                    <input
                                                        type="date"
                                                        name="isthimaradue"
                                                        id="isthimaradue"
                                                        placeholder="dd-mm-yyyy"
                                                        className="c-input-field-car"
                                                        value={vehicleData.isthimaradue}
                                                        onChange={handleVehicleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="c-form-field-row-car">
                                                <div className="c-form-field-column-car" style={{ width: '50%' }}>
                                                    <label htmlFor="vehicletype" className="c-form-field-label-car">Odometer Reading</label>
                                                    <input
                                                        type='text'
                                                        name="odometerreading"
                                                        id="odometerreading"
                                                        placeholder='Odometer Reading'
                                                        className="c-input-field-car"
                                                        value={vehicleData.odometerreading}
                                                        onChange={handleVehicleChange}
                                                    />

                                                </div>
                                                <div className="c-form-field-column-car" style={{ width: '75%' }}>
                                                    <label htmlFor="vehiclephoto" className="c-form-field-label-car">Upload Photo</label>
                                                    <input
                                                        type="file"
                                                        name="vehiclephoto"
                                                        id="vehiclephoto"
                                                        className="c-input-field-car"
                                                        onChange={handleChange}
                                                        style={{ display: 'none' }}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="c-input-field-car"
                                                        value={fileName}
                                                        readOnly
                                                        placeholder="Choose a file"
                                                        onClick={() => document.getElementById('vehiclephoto').click()}
                                                    />
                                                </div>
                                            </div>
                                            <button type="submit" className="c-submit-button-car">Submit</button>
                                        </form>
                                        {showSucessPopup && <SuccessPopup message={popupMessage} onClose={() => setShowSucessPopup(false)} />}
                                    </div>
                                </div>
                            </div>
                            <div className="right">
                                {/* <div className="image-section">
                                    <div className="cardss">
                                        <div className="trip-images" style={{ backgroundImage: `url(${carImage})` }}><div className='oveerlay'></div>
                                            <div className='button-container'>
                                                <button className="image-button" onClick={handleEditCarDetailsClick}>Edit Car Details</button>
                                                <button className="image-button">Add Scratches</button>
                                            </div>
                                        </div>
                                    </div>

                                </div> */}

                                <button className="edit-cardd" onClick={handleEditCarDetailsClick}>
                                    <div className="iicon-container">
                                        <Edited className='iicon' />
                                    </div>
                                    <div className="text-container">
                                        <span className="count">EDIT   </span>
                                        <span className="label">Vehicle Details</span>
                                    </div>
                                </button>


                                <button className="edit-cardd" onClick={handleClick}>
                                    <div className="iicon-container">
                                        < ScratchIcon className="iicon" />
                                    </div>
                                    <div className="text-container">
                                        <span className="count">ADD</span>
                                        <span className="label">Scratches</span>
                                    </div>
                                </button>
                                <div>
                                    <button id='scratches' className="edit-cardd" onClick={() => setShowPopup(true)}>
                                        <div className="iicon-container">
                                            <CarLocation />
                                        </div>
                                        <div className="text-container">
                                            <span className="count">CHECK</span>
                                            <span className="label">Vehicle Status</span>
                                        </div>
                                    </button>
                                    {showPopup && <StatusPopup onClose={() => setShowPopup(false)} />}
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
                <section id='scratches'>
                    <div className='bod'>
                        <div className='add-scratch'>
                            <div className='sc'>
                                <div className='add-sc-top'>
                                    <h2>ADD SCRATCHES</h2>
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
                                        <div className="row">
                                            <span>Selected Vehicle</span>
                                            <input
                                                id="car-select"
                                                className="vehicle-type-input"
                                                value={selectedVehi.charAt(0).toUpperCase() + selectedVehi.slice(1)}
                                                readOnly
                                            />
                                        </div>
                                        <div className="options">
                                            <div className='brushh'>
                                                <span>Brush Size</span>
                                                <li className="option">
                                                    <input
                                                        type="range"
                                                        id="size-slider"
                                                        min="1"
                                                        max="5"
                                                        value={brushWidth}
                                                        onChange={handleBrushSizeChange}
                                                    />
                                                </li>
                                            </div>
                                        </div>
                                        <div className="row colors">
                                            <span>Colors</span>
                                            <ul className="options">
                                                <li
                                                    className="option"
                                                    style={{ backgroundColor: '#000000' }}
                                                    onClick={() => setBrushColor('#000000')}
                                                ></li>
                                                <li
                                                    className="option"
                                                    style={{ backgroundColor: '#FFFFFF' }}
                                                    onClick={() => setBrushColor('#FFFFFF')}
                                                ></li>
                                                <li
                                                    className="option"
                                                    style={{ backgroundColor: '#FF0000' }}
                                                    onClick={() => setBrushColor('#FF0000')}
                                                ></li>
                                                <li className="option">
                                                    <input
                                                        type="color"
                                                        id="color-picker"
                                                        defaultValue="#000000"
                                                        onChange={(e) => setBrushColor(e.target.value)}
                                                    />
                                                </li>
                                            </ul>
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
                </section>


                <section id="driver">
                    <div className="vehicle">

                        <div className="contents">
                            <div className="left">
                                <div class="add-car">
                                    <div class="form-container">
                                        <form className="c-form" onSubmit={handleDriverSubmit}>
                                            <div className="header-form">
                                                <h2>ADD A DRIVER</h2>
                                                <button
                                                    type="button"
                                                    className="generate-id-button"
                                                    onClick={generateDriverID}
                                                >
                                                    Generate Driver ID
                                                </button>
                                            </div>
                                            <div className="c-form-field-row">
                                                <div className="c-form-field-column">
                                                    <label htmlFor="drivername">Driver Name</label>
                                                    <input
                                                        type="text"
                                                        name="drivername"
                                                        id="drivername"
                                                        placeholder="Driver Name"
                                                        className="c-input-field"
                                                        value={driverData.drivername}
                                                        onChange={handleDriverChange}
                                                    />
                                                </div>
                                                <div className="c-form-field-column">
                                                    <label htmlFor="driverid">Driver ID</label>
                                                    <input
                                                        type="text"
                                                        name="driverid"
                                                        id="driverid"
                                                        placeholder="Driver ID"
                                                        className="c-input-field"
                                                        value={driverData.driverid}
                                                        onChange={handleDriverChange}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="c-form-field-row">
                                                <div className="c-form-field-column">
                                                    <label htmlFor="driverpassword">Password</label>
                                                    <input
                                                        type="text"
                                                        name="driverpassword"
                                                        id="driverpassword"
                                                        placeholder="Password"
                                                        className="c-input-field"
                                                        value={driverData.driverpassword}
                                                        onChange={handleDriverChange}
                                                    />
                                                </div>
                                                <div className="c-form-field-column">
                                                    <label htmlFor="drivermobile">Mobile Number</label>
                                                    <input
                                                        type="text"
                                                        name="drivermobile"
                                                        id="drivermobile"
                                                        placeholder="Mobile Number"
                                                        className="c-input-field"
                                                        value={driverData.drivermobile}
                                                        onChange={handleDriverChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="c-form-field-row">
                                                <div className="c-form-field-column">
                                                    <label htmlFor="driverlicenceno">Driver Licence No</label>
                                                    <input
                                                        type="text"
                                                        name="driverlicenceno"
                                                        id="driverlicenceno"
                                                        placeholder="Driver Licence Number"
                                                        className="c-input-field"
                                                        value={driverData.driverlicenceno}
                                                        onChange={handleDriverChange}
                                                    />
                                                </div>
                                                <div className="c-form-field-column">
                                                    <label htmlFor="driverlicenceexp">Driver Licence Expiry</label>
                                                    <input
                                                        type="date"
                                                        name="driverlicenceexp"
                                                        id="driverlicenceexp"
                                                        placeholder="Expiry DATE"
                                                        className="c-input-field"
                                                        value={driverData.driverlicenceexp}
                                                        onChange={handleDriverChange}
                                                    />
                                                </div>
                                            </div>
                                            <button type="submit" className="c-submit-button">Submit</button>
                                        </form>
                                        {showSucessDriverPopup && <SuccessPopup message={popupMessage} onClose={() => setShowSucessDriverPopup(false)} />}
                                    </div>
                                </div>

                            </div>
                            <div className="right">
                                <button className="edit-cardd" onClick={handleEditDriverDetailsClick}>
                                    <div className="iicon-container">
                                        <Identity className="iicon" />
                                    </div>
                                    <div className="text-container">
                                        <span className="count">EDIT</span>
                                        <span className="label">Drivers Details</span>
                                    </div>
                                </button>


                                <div id="trip"></div>
                                <DriverNote />
                                <button className="edit-cardd">
                                    <div className="iicon-container">
                                        < Driver className="iicon" />
                                    </div>
                                    <div className="text-container">
                                        <span className="count">{driverCount}</span>
                                        <span className="label">Drivers OnBoard</span>
                                    </div>
                                </button>




                            </div>
                        </div>

                    </div>
                </section>
                <section id="trip">


                    <div className="contents">
                        <div className="left">
                            <div class="add-trip">
                                <div class="form-container">
                                    <form className="c-form-trip" onSubmit={handleTripSubmit}>
                                        <div className="header-form">
                                            <h2>ASSIGN TRIP</h2>
                                        </div>
                                        <div className="c-form-field-row-trip">

                                            <div className="c-form-field-column-trip">
                                                <label htmlFor="vehicleNumber">Car Number</label>
                                                <input
                                                    type="text"
                                                    name="vehicleNumber"
                                                    id="vehicleNumber"
                                                    placeholder="Vehicle Number"
                                                    className="c-input-field-trip"
                                                    value={tripData.vehicleNumber}
                                                    onChange={handleTripChange}
                                                />
                                            </div>
                                            <div className="c-form-field-column-trip">
                                                <label htmlFor="driverId">Driver ID</label>
                                                <input
                                                    type="text"
                                                    name="driverId"
                                                    id="driverId"
                                                    placeholder="Driver ID"
                                                    className="c-input-field-trip"
                                                    value={tripData.driverId}
                                                    onChange={handleTripChange}
                                                />
                                            </div>
                                            <div className="c-form-field-column-trip">
                                                <label htmlFor="tripDestination">Trip Destination</label>
                                                <input
                                                    type="text"
                                                    name="tripDestination"
                                                    id="tripDestination"
                                                    placeholder="Trip Destination"
                                                    className="c-input-field-trip"
                                                    value={tripData.tripDestination}
                                                    onChange={handleTripChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="c-form-field-row-trip">
                                            <div className="c-form-field-column-trip">
                                                <label htmlFor="tripStartLocation">Trip Start Location</label>
                                                <input
                                                    type="text"
                                                    name="tripStartLocation"
                                                    id="tripStartLocation"
                                                    placeholder="Trip Start Location"
                                                    className="c-input-field-trip"
                                                    value={tripData.tripStartLocation}
                                                    onChange={handleTripChange}
                                                />
                                            </div>
                                            <div className="c-form-field-column-trip">
                                                <label htmlFor="tripDate">Trip Date</label>
                                                <input
                                                    type="date"
                                                    name="tripDate"
                                                    id="tripDate"
                                                    className="c-input-field-trip"
                                                    value={tripData.tripDate}
                                                    onChange={handleTripChange}
                                                />
                                            </div>
                                            <div className="c-form-field-column-trip">
                                                <label htmlFor="tripEndDate">Trip End Date</label>
                                                <input
                                                    type="date"
                                                    name="tripEndDate"
                                                    id="tripEndDate"
                                                    placeholder="Trip End Date"
                                                    className="c-input-field-trip"
                                                    value={tripData.tripEndDate}
                                                    onChange={handleTripChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="c-form-field-row-trip">
                                            <div className="c-form-field-column-25-trip">
                                                <label htmlFor="odometerReading">Odometer Reading</label>
                                                <input
                                                    type="text"
                                                    name="odometerReading"
                                                    id="odometerReading"
                                                    placeholder="Odometer Reading"
                                                    className="c-input-field-trip"
                                                    value={tripData.odometerReading}
                                                    onChange={handleTripChange}
                                                />
                                            </div>
                                            <div className="c-form-field-column-75-trip">
                                                <label htmlFor="tripType">Trip Type</label>
                                                <select
                                                    name="tripType"
                                                    id="tripType"
                                                    className="c-input-field-trip"
                                                    value={tripData.tripType}
                                                    onChange={handleTripChange}
                                                >
                                                    <option value="">Select Trip Type</option>
                                                    <option value="revenue">Revenue</option>
                                                    <option value="non-revenue">Non Revenue</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="c-form-field-row-trip">
                                            <div className="c-form-field-column-75-trip">
                                                <label htmlFor="remunarationType">Remuneration Type</label>
                                                <select
                                                    name="remunarationType"
                                                    id="remunarationType"
                                                    className="c-input-field-trip"
                                                    value={tripData.remunarationType}
                                                    onChange={handleTripChange}
                                                >
                                                    <option value="">Select Remuneration Type</option>
                                                    <option value="fully_paid">Fully Paid</option>
                                                    <option value="pay_after_trip">Pay After Trip</option>
                                                    <option value="advance_paid">Advance Paid</option>
                                                </select>
                                            </div>
                                            <div className="c-form-field-column-25-trip">
                                                <label htmlFor="tripRemunaration">Remuneration</label>
                                                <input
                                                    type="text"
                                                    name="tripRemunaration"
                                                    id="tripRemunaration"
                                                    placeholder="Remuneration"
                                                    className="c-input-field-trip"
                                                    value={tripData.tripRemunaration}
                                                    onChange={handleTripChange}
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="c-submit-button">Submit</button>
                                    </form>
                                    {showSucessTripPopup && <SuccessPopup message={popupMessage} onClose={() => setShowSucessTripPopup(false)} />}
                                </div>
                            </div>

                        </div>
                        <div className="right">
                            <div>
                                <button className="edit-cardd-trip" onClick={() => setShowTripPopup(true)}>
                                    <div className="iicon-container">
                                        <Identity className="iicon" />

                                    </div>
                                    <div className="text-container">
                                        <span className="count">EXTEND</span>
                                        <span className="label">Trips</span>
                                    </div>
                                </button>

                                {showTripPopup && <TripPopup onClose={() => setShowTripPopup(false)} />}
                            </div>

                            <button className="ccard-button">
                                <div className="iicon-container">
                                    <CarFav className='iicon' />
                                </div>
                                <div className="text-container">
                                    <span className="count">{carCounts.onTrip}</span>
                                    <span className="label">Cars on Trip</span>
                                </div>
                            </button>

                            <button className="ccard-button">
                                <div className="iicon-container">
                                    <GarageIcon className='iicon' />
                                </div>
                                <div id="workshop" className="text-container">
                                    <span className="count">{carCounts.inYard}</span>
                                    <span className="label">Cars in Yard</span>
                                </div>
                            </button>
                            <button className="ccard-button">
                                <div className="iicon-container">
                                    <ServiceIcon />
                                </div>
                                <div className="text-container">
                                    <span className="count">{carCounts.inWorkshop}</span>
                                    <span className="label">Cars in Workshop</span>
                                </div>
                            </button>
                        </div>
                    </div>


                </section>
                <section id="workshop">

                    <div classname="contents">
                        <div class='tables'>
                            <Table />
                        </div>

                    </div>
                </section>
                <section id="notes">
                    <div className="vehicle">

                        <div className="content-note">
                            <div className="left">
                                <div className='add-note'>
                                    <AddNote />
                                </div>
                            </div>
                            <div className="right">
                                <div className='display-note'>
                                    <NotesDisplay />
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                <section id="settings">
                    <div className='settings-div'>
                        <Settings />
                    </div>
                </section>
            </div >
        </div >
    );
}

export default Dashboard;
