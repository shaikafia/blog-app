import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';  // Import the CSS file

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/posts')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                return response.json();
            })
            .then(data => {
                setPosts(data.posts);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return (
        <div className="error">
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
        </div>
    );

    return (
        <div className="container">
            <h2 className="page-title">Posts</h2>
            <ul className="post-list">
                {posts.map(post => (
                    <li key={post.id} className="post-item">
                        <Link to={`/posts/${post.id}`} className="post-link">
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
            <Link to="/new" className="create-post-link">Create New Post</Link>
        </div>
    );
}

export default PostList;
