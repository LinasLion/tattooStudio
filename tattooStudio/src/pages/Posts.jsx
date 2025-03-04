import React, { useState, useEffect } from "react";
import { PhotoView } from "../components/PhotoView.jsx";

const API_URL = 'http://localhost:5000';

export function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    imageUrl: ""
  });

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
      console.log("Fetched posts:", data); // Debug log to see post structure
      setPosts(data);
    } catch (error) {
      alert("Error loading posts: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      // Fix: Create a properly structured post object
      const postToCreate = {
        title: newPost.title,
        content: newPost.content,
        image: newPost.imageUrl // Make sure field names match what backend expects
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postToCreate)
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const createdPost = await response.json();
      setPosts(prev => [...prev, createdPost]);
      setNewPost({ title: "", content: "", imageUrl: "" });
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
          {post.image && post.image.length > 0 && (
              <div className="post-image">
                <img
                    src={post.image}
                    alt={post.title}
                    onClick={() => openModal({src: post.image, alt: post.title})}
                    style={{ cursor: "pointer" }}
                />
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
                    <label htmlFor="imageUrl">Image URL</label>
                    <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={newPost.imageUrl}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        value={newPost.content}
                        onChange={handleInputChange}
                        rows="6"
                        required
                    ></textarea>
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