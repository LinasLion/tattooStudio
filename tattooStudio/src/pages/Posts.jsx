import React, {useState, useEffect, useRef} from "react";
import {PhotoView} from "../components/PhotoView.jsx";
import apiClient from "../services/api";
import {AdminFeature} from "../components/AdminFeature.jsx";

export function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(null);
    const [photoModalOpen, setPhotoModalOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [newPost, setNewPost] = useState({
        title: "", content: "", previewImage: null
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchPosts().then((data) => {
            setPosts(data);
            setLoading(false);
        }).catch((error) => {
            console.error('Failed to load posts:', error);
        })
    }, [newPost]);

    const fetchPosts = async () => {
        try {
            const response = await apiClient.get('/posts');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            throw new Error('Failed to fetch posts');
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewPost(prev => ({
            ...prev, [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onload = (event) => {
                setNewPost(prev => ({
                    ...prev, previewImage: event.target.result
                }));
            };
            reader.readAsDataURL(e.target.files[0]);
            setUploadStatus("File selected: " + e.target.files[0].name);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newPost.title);
            formData.append('content', newPost.content);

            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            const response = await apiClient.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const createdPost = response.data;
            setPosts(prev => [createdPost, ...prev]);
            setNewPost({title: "", content: "", previewImage: null});
            setSelectedFile(null);
            setUploadStatus("");
            setFormModalOpen(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        } catch (err) {
            alert("Error creating post: " + (err.response?.data?.error || err.message));
            console.error(err);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }

        try {
            await apiClient.delete(`/posts/${postId}`);
            setPosts(prev => prev.filter(post => post._id !== postId));
        } catch (err) {
            alert("Error deleting post: " + (err.response?.data?.error || err.message));
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

    const openFormModal = () => {
        setFormModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeFormModal = () => {
        setFormModalOpen(false);
        document.body.style.overflow = "auto";
        setNewPost({title: "", content: "", previewImage: null});
        setSelectedFile(null);
        setUploadStatus("");
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    if (loading) return <div className="admin-loading">Loading posts...</div>;

    const renderPosts = () => {
        return posts.map(post => (<div key={post._id} className="post-item">
            <div className="post-header">
                <h3>{post.title}</h3>
                <AdminFeature>
                    <button
                        onClick={() => handleDeletePost(post._id)}
                        className="delete-button"
                    >
                        Delete
                    </button>
                </AdminFeature>
            </div>
            <div className="post-image">
                <img
                    src={`data:image/jpeg;base64,${post.imageBlob}`}
                    alt={post.title}
                    onClick={() => openPhotoModal({
                        src: `data:image/jpeg;base64,${post.imageBlob}`, alt: post.title
                    })}
                    style={{cursor: "pointer"}}
                />
            </div>
            <div className="post-content">
                {post.content.substring(0, 150)}
                {post.content.length > 150 ? "..." : ""}
            </div>
            <div className="post-date">
                Posted on: {new Date(post.createdAt).toLocaleDateString()}
            </div>
        </div>));
    };

    return (<div className="content">
        <div className="admin-container">
            <h1 className="websiteTitle">Posts</h1>
            <AdminFeature>
                <div className="admin-actions">
                    <button onClick={openFormModal} className="admin-button create-post-btn">
                        Create New Post
                    </button>
                </div>
            </AdminFeature>
            <div className="posts-list">
                <h2 className="admin-title">Existing Posts</h2>
                {posts.length === 0 ? (<p className="no-posts">No posts available</p>) : (renderPosts())}
            </div>

            {photoModalOpen && currentImage && (<PhotoView
                src={currentImage.src}
                alt={currentImage.alt}
                closeModal={closePhotoModal}
            />)}
            {formModalOpen && (<div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title">Create New Post</h2>
                        <button className="modal-close" onClick={closeFormModal}>×</button>
                    </div>
                    <div className="modal-body">
                        <form className="admin-form" onSubmit={handleCreatePost}>
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newPost.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="content">Content</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={newPost.content}
                                    onChange={handleInputChange}
                                    required
                                    rows="6"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="image">Upload Image</label>
                                <div className="file-upload-container">
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        ref={fileInputRef}
                                        className="file-input"
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
                                {newPost.previewImage && (<div className="image-preview">
                                    <img
                                        src={newPost.previewImage}
                                        alt="Preview"
                                        style={{maxWidth: '200px', marginTop: '10px'}}
                                    />
                                </div>)}
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-button" onClick={closeFormModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-button">
                                    Create Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>)}
        </div>
    </div>);
}