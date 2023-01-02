const e = require('express');
var express = require('express');
var router = express.Router();

// Import database
var connection = require('../library/database');

/**
 * Index Posts
*/
router.get('/', function(req, res, next) {
    // Query
    connection.query('SELECT * FROM posts ORDER BY id DESC', function(err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('posts', {
                data: ''
            });
        } else {
            // Render ke view posts index
            res.render('posts/index', {
                data: rows // <== Data posts 
            });
        }
    });
});

/**
 * Create Post
*/
router.get('/create', function (req, res, next) {
    res.render('posts/create', {
        title: '',
        content: ''
    });
});

/**
 * Store Post
*/
router.post('/store', function (req, res, next) {
    let title = req.body.title;
    let content = req.body.content;
    let errors = false;

    if (title.length === 0) {
        errors = true;

        // Set flash message
        req.flash('error', 'Silahkan masukkan judul postingan');

        // Render to add.ejs with flash message
        res.render('posts/create', {
            title: title,
            content: content 
        });
    }

    if (content.length === 0) {
        errors = true;

        // Set flash message
        req.flash('error', 'Silahkan masukkan konten postingan');

        // Render to edit.ejs with flash message
        res.render('posts/create', {
            title: title,
            content: content
        });
    }

    // If no error
    if (!errors) {
        let formData = {
            title: title,
            content: content
        };

        // Insert query
        connection.query('INSERT INTO posts SET ?', formData, function (err, result) {
            if (err) {
                req.flash('error', err);

                // Render to add.ejs
                res.render('posts/create', {
                    title: formData.title,
                    content: formData.content
                });
            } else {
                req.flash('success', 'Data berhasil disimpan!');
                res.redirect('/posts');
            }
        });
    }
});

/**
 * Edit Post
*/
router.get('/edit/(:id)', function(req, res, next) {
    let id = req.params.id;

    connection.query('SELECT * FROM posts WHERE id = ' + id, function (err, rows, fields) {
        if (err) throw err

        // If post not found
        if (rows.length <= 0) {
            req.flash('error', 'Data post dengan ID ' + id + 'tidak ditemukan');
            res.redirect('/posts');
        } else { // If post found
            // Render to edit.ejs
            res.render('posts/edit', {
                id: rows[0].id,
                title: rows[0].title,
                content: rows[0].content
            });
        }
    });
});

/**
 * Update Post
*/
router.post('/update/:id', function (req, res, next) {
    let id = req.params.id;
    let title = req.body.title;
    let content = req.body.content;
    let errors = false;

    if (title.length === 0) {
        errors = true;

        // Set flash message
        req.flash('error', 'Silahkan masukkan judul postingan');

        // Render to edit.ejs with flash message
        res.render('posts/edit', {
            id: req.params.id,
            title: title,
            content: content
        });
    }

    if (content.length === 0) {
        errors = true;

        // Set flash message
        req.flash('error', 'Silahkan masukkan konten postingan');

        // Render to edit.ejs with flash message
        res.render('posts/edit', {
            id: req.params.id,
            title: title,
            content: content
        });
    }

    // If no errors
    if (!errors) {
        let formData= {
            title: title,
            content: content
        };

        // Update query
        connection.query('UPDATE posts SET ? WHERE id = ' + id, formData, function (err, result) {
            if (err) {
                // Set flash message
                req.flash('error', err);

                // Render to edit.ejs
                res.render('posts/edit', {
                    id: req.params.id,
                    title: formData.title,
                    content: formData.content
                });
            } else {
                req.flash('success', 'Data berhasil diperbaharui!');
                res.redirect('/posts');
            }
        });
    }
});

/**
 * Delete Post
*/
router.get('/delete/(:id)', function (req, res, nest) {
    let id = req.params.id;

    connection.query('DELETE FROM posts WHERE id = ' + id, function (err, result) {
        if (err) {
            // Set flash message
            req.flash('error', err);

            // Redirect to posts page
            res.redirect('/posts');
        } else {
            // Set flash message
            req.flash('success', 'Data berhasil dihapus!');

            // Redirect to posts page
            res.redirect('/posts');
        }
    });
});

module.exports = router;