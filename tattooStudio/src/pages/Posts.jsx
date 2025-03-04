import React, {useState, useEffect, useRef} from "react";
import {PhotoView} from "../components/PhotoView.jsx";

const API_URL = 'http://localhost:5000';

export function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [newPost, setNewPost] = useState({
        title: "",
        content: "",
        previewImage: null
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_URL}/posts`);

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data = await response.json();
            console.log("Fetched posts:", data);
            setPosts(data);
        } catch (error) {
            alert("Error loading posts: " + error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewPost(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onload = (event) => {
                setNewPost(prev => ({
                    ...prev,
                    previewImage: event.target.result
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

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            console.log("Create post response:", response);

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            const createdPost = await response.json();
            setPosts(prev => [createdPost, ...prev]);
            setNewPost({title: "", content: "", previewImage: null});
            setSelectedFile(null);
            setUploadStatus("");
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        } catch (err) {
            alert("Error creating post: " + err.message);
            console.error(err);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            setPosts(prev => prev.filter(post => post._id !== postId));
        } catch (err) {
            alert("Error deleting post: " + err.message);
            console.error(err);
        }
    };

    const openModal = (image) => {
        setCurrentImage(image);
        setModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setModalOpen(false);
        document.body.style.overflow = "auto";
    };

    if (loading) return <div className="admin-loading">Loading posts...</div>;

    const isAdmin = localStorage.getItem('token');

    const renderPosts = () => {
        return posts.map(post => (
            <div key={post._id} className="post-item">
                <div className="post-header">
                    <h3>{post.title}</h3>
                    {isAdmin && (
                        <button
                            onClick={() => handleDeletePost(post._id)}
                            className="delete-button"
                        >
                            Delete
                        </button>
                    )}
                </div>
                {post.imageBlob ? (
                    <div className="post-image">
                        <img
                            src={`data:image/jpeg;base64,${post.imageBlob}`}
                            alt={post.title}
                            onClick={() => openModal({
                                src: `data:image/jpeg;base64,${post.imageBlob}`,
                                alt: post.title
                            })}
                            style={{cursor: "pointer"}}
                        />
                    </div>
                ) : (
                    <div className="post-image-placeholder">
                        No image available at moment. The image may appear after a refresh.
                    </div>
                )}
                <div className="post-content">
                    {post.content.substring(0, 150)}
                    {post.content.length > 150 ? "..." : ""}
                </div>
                <div className="post-date">
                    Posted on: {new Date(post.createdAt).toLocaleDateString()}
                </div>
            </div>
        ));
    };

    return (
        <div className="content">
            <div className="admin-container">
                <h1 className="websiteTitle">Posts</h1>

                {isAdmin && (
                    <div className="admin-form-wrapper">
                        <h2 className="admin-title">Create New Post</h2>
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
                                {newPost.previewImage && (
                                    <div className="image-preview">
                                        <img
                                            src={newPost.previewImage}
                                            alt="Preview"
                                            style={{maxWidth: '200px', marginTop: '10px'}}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="admin-button">
                                    Create Post
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="posts-list">
                    <h2 className="admin-title">Existing Posts</h2>
                    {posts.length === 0 ? (
                        <p className="no-posts">No posts available</p>
                    ) : (
                        renderPosts()
                    )}
                </div>

                {modalOpen && currentImage && (
                    <PhotoView
                        src={currentImage.src}
                        alt={currentImage.alt}
                        closeModal={closeModal}
                    />
                )}
            </div>
        </div>
    );
}