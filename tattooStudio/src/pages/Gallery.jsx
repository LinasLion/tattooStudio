import React, {useState, useEffect, useRef} from "react";
import {PhotoView} from "../components/PhotoView.jsx";

const API_URL = 'http://localhost:5000';

export function Gallery() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(null);
    const [photoModalOpen, setPhotoModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [newPhoto, setNewPhoto] = useState({
        title: "", previewImage: null
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const response = await fetch(`${API_URL}/gallery`);

            if (!response.ok) {
                throw new Error('Failed to fetch photos');
            }

            const data = await response.json();
            console.log("Fetched photos:", data);
            setPhotos(data);
        } catch (error) {
            alert("Error loading gallery: " + error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewPhoto(prev => ({
            ...prev, [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onload = (event) => {
                setNewPhoto(prev => ({
                    ...prev, previewImage: event.target.result
                }));
            };
            reader.readAsDataURL(e.target.files[0]);
            setUploadStatus("File selected: " + e.target.files[0].name);
        }
    };

    const handleUploadPhoto = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert("Please select an image to upload");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', newPhoto.title);
            formData.append('image', selectedFile);

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/gallery`, {
                method: 'POST', headers: {
                    'Authorization': `Bearer ${token}`
                }, body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload photo');
            }

            const uploadedPhoto = await response.json();
            setPhotos(prev => [uploadedPhoto, ...prev]);
            setNewPhoto({title: "", previewImage: null});
            setSelectedFile(null);
            setUploadStatus("");
            setUploadModalOpen(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        } catch (err) {
            alert("Error uploading photo: " + err.message);
            console.error(err);
        }
    };

    const handleDeletePhoto = async (photoId) => {
        if (!window.confirm("Are you sure you want to delete this photo?")) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/gallery/${photoId}`, {
                method: 'DELETE', headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete photo');
            }

            setPhotos(prev => prev.filter(photo => photo._id !== photoId));
        } catch (err) {
            alert("Error deleting photo: " + err.message);
            console.error(err);
        }
    };

    const openPhotoModal = (image) => {
        setCurrentImage(image);
        setPhotoModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closePhotoModal = () => {
        setPhotoModalOpen(false);
        document.body.style.overflow = "auto";
    };

    const openUploadModal = () => {
        setUploadModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeUploadModal = () => {
        setUploadModalOpen(false);
        document.body.style.overflow = "auto";
        // Reset form state
        setNewPhoto({title: "", previewImage: null});
        setSelectedFile(null);
        setUploadStatus("");
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    if (loading) return <div className="gallery-loading">Loading gallery...</div>;

    const isAdmin = localStorage.getItem('token');

    return (<div className="content">
            <div className="gallery-container">
                <h1 className="websiteTitle">Gallery</h1>

                {isAdmin && (<div className="gallery-actions">
                        <button onClick={openUploadModal} className="gallery-button upload-photo-btn">
                            Upload New Photo
                        </button>
                    </div>)}

                {photos.length === 0 ? (<p className="no-photos">No photos available</p>) : (
                    <div className="gallery-grid">
                        {photos.map(photo => (<div key={photo._id} className="gallery-item">
                                {photo.imageBlob ? (<div className="gallery-photo-container">
                                        <img
                                            src={`data:image/jpeg;base64,${photo.imageBlob}`}
                                            alt={photo.title || "Gallery photo"}
                                            onClick={() => openPhotoModal({
                                                src: `data:image/jpeg;base64,${photo.imageBlob}`,
                                                alt: photo.title || "Gallery photo"
                                            })}
                                        />
                                        {photo.title && <p className="gallery-photo-title">{photo.title}</p>}
                                        {isAdmin && (<button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeletePhoto(photo._id);
                                                }}
                                                className="gallery-delete-button"
                                                title="Delete photo"
                                            >
                                                ×
                                            </button>)}
                                    </div>) : (<div className="gallery-photo-placeholder">
                                        Photo loading...
                                    </div>)}
                            </div>))}
                    </div>)}

                {photoModalOpen && currentImage && (<PhotoView
                        src={currentImage.src}
                        alt={currentImage.alt}
                        closeModal={closePhotoModal}
                    />)}

                {/* Modal for Photo Upload */}
                {uploadModalOpen && (<div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Upload New Photo</h2>
                                <button className="modal-close" onClick={closeUploadModal}>×</button>
                            </div>
                            <div className="modal-body">
                                <form className="gallery-form" onSubmit={handleUploadPhoto}>
                                    <div className="form-group">
                                        <label htmlFor="title">Title (Optional)</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={newPhoto.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter a title for this photo"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="image">Select Photo *</label>
                                        <div className="file-upload-container">
                                            <input
                                                type="file"
                                                id="image"
                                                name="image"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                ref={fileInputRef}
                                                className="file-input"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="file-select-button"
                                                onClick={() => fileInputRef.current.click()}
                                            >
                                                Select Photo
                                            </button>
                                            <span className="file-status">{uploadStatus}</span>
                                        </div>
                                        {newPhoto.previewImage && (<div className="image-preview">
                                                <img
                                                    src={newPhoto.previewImage}
                                                    alt="Preview"
                                                    style={{maxWidth: '100%', maxHeight: '200px', marginTop: '10px'}}
                                                />
                                            </div>)}
                                    </div>

                                    <div className="form-actions">
                                        <button type="button" className="cancel-button" onClick={closeUploadModal}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="gallery-button">
                                            Upload Photo
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>)}
            </div>
        </div>);
}