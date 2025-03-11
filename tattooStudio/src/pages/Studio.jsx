import React, {useState} from "react";
import image1 from "../public/studio/image1.jpg";
import image2 from "../public/studio/image2.jpg";
import {PhotoView} from "../components/PhotoView.jsx";

export function Studio() {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);

    const images = [
        {src: image1, alt: "Studio Image 1"},
        {src: image2, alt: "Studio Image 2"},
    ];

    const openModal = (image) => {
        setCurrentImage(image);
        setModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setModalOpen(false);
        document.body.style.overflow = "auto";
    };

    return (
        <div className="content">
            <h1 className="websiteTitle">TATTOO STUDIO</h1>
            <div className="studio-photos">
                <div className="studio__gallery">
                    {images.map((image, index) => (
                        <div className="studio__photo" key={index}>
                            <img
                                src={image.src}
                                alt={image.alt}
                                onClick={() => openModal(image)}
                                style={{cursor: "pointer"}} // Add pointer cursor to indicate clickable
                            />
                        </div>
                    ))}
                </div>
            </div>
            {modalOpen && (
                <PhotoView
                    src={currentImage.src}
                    alt={currentImage.alt}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
}
