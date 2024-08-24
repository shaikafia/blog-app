import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostForm from './components/PostForm';
import './styles.css';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<PostList />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/new" element={<PostForm />} />
                <Route path="/edit/:id" element={<PostForm />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;

