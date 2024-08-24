import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './App.css';  // Import the CSS file

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/posts/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch post');
                }
                return response.json();
            })
            .then(data => {
                setPost(data.post);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [id]);

    const handleDelete = () => {
        fetch(`http://localhost:5000/posts/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
            navigate('/');
        })
        .catch(error => setError(error.message));
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!post) return <div className="error">No post found.</div>;

    return (
        <div className="container">
            <h2 className="page-title">{post.title}</h2>
            <p className="post-content">{post.content}</p>
            <div className="button-group">
                <button className="edit-button" onClick={() => navigate(`/edit/${post.id}`)}>Edit Post</button>
                <button className="delete-button" onClick={handleDelete}>Delete Post</button>
                <Link to="/" className="back-link">Back to Posts</Link>
            </div>
        </div>
    );
}

export default PostDetail;
