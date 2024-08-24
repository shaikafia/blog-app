import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

function PostForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:5000/posts/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch post');
                    }
                    return response.json();
                })
                .then(data => {
                    setTitle(data.post.title);
                    setContent(data.post.content);
                })
                .catch(error => setError(error.message));
        }
    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const method = id ? 'PUT' : 'POST';
        const url = id ? `http://localhost:5000/posts/${id}` : 'http://localhost:5000/posts';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save post');
            }
            navigate('/');
        })
        .catch(error => setError(error.message));
    };

    return (
        <div className="container">
            <h2 className="page-title">Create New Post</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit} className="post-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required
                        className="form-control" 
                    />
                </div>
                <div className="form-group">
                    <label>Content</label>
                    <textarea 
                        name="content" 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required
                        className="form-control"
                        rows="5"
                    ></textarea>
                </div>
                <div className="button-group">
                    <button type="submit" className="submit-button">Create Post</button>
                    <button type="button" className="cancel-button" onClick={() => navigate('/')}>Cancel</button>

                </div>
            </form>
        </div>
    );
}

export default PostForm;
