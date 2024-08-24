const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../database');

// Middleware to handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// GET /posts - Fetch all posts
router.get('/', (req, res) => {
    db.all("SELECT * FROM posts", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch posts.' });
        }
        res.json({ posts: rows });
    });
});

// GET /posts/:id - Fetch a specific post by ID
router.get(
    '/:id',
    param('id').isInt().withMessage('ID must be an integer'),
    validate,
    (req, res) => {
        const { id } = req.params;
        db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch the post.' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.json({ post: row });
        });
    }
);

// POST /posts - Create a new post
router.post(
    '/',
    [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('content').trim().notEmpty().withMessage('Content is required')
    ],
    validate,
    (req, res) => {
        const { title, content } = req.body;
        db.run(
            "INSERT INTO posts (title, content) VALUES (?, ?)",
            [title, content],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create the post.' });
                }
                res.status(201).json({ id: this.lastID, message: 'Post created successfully' });
            }
        );
    }
);

// PUT /posts/:id - Update a post by ID
router.put(
    '/:id',
    [
        param('id').isInt().withMessage('ID must be an integer'),
        body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
        body('content').optional().trim().notEmpty().withMessage('Content cannot be empty')
    ],
    validate,
    (req, res) => {
        const { id } = req.params;
        const { title, content } = req.body;

        db.run(
            "UPDATE posts SET title = ?, content = ? WHERE id = ?",
            [title, content, id],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update the post.' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Post not found or no changes made' });
                }
                res.json({ updated: this.changes, message: 'Post updated successfully' });
            }
        );
    }
);

// DELETE /posts/:id - Delete a post by ID
router.delete(
    '/:id',
    param('id').isInt().withMessage('ID must be an integer'),
    validate,
    (req, res) => {
        const { id } = req.params;

        db.run("DELETE FROM posts WHERE id = ?", [id], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete the post.' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.json({ deleted: this.changes, message: 'Post deleted successfully' });
        });
    }
);

module.exports = router;
