const express = require('express');
const router = express.Router();

const genres = [
    { id: 1, name: 'genre1' },
    { id: 2, name: 'genre2' },
    { id: 3, name: 'genre3' },
];

router.get('/', (req, res) => {
    res.send(genres);
});

router.post('/', (req, res) => {
    const { error } = validateGenre(req.body); 
    if (error) return res.status(400).send(error.details[0].message);   

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

router.put('/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('This genre id was not found');

     // Validate
    // If invalid, return 400 - Bad request  
    const { error } = validateGenre(req.body); // result.error
    if (error) return res.status(400).send(error.details[0].message);   // 400 Bad Request

    // Update course/genre
    genre.name = req.body.name;
    
    // Return the updated course/genre
    res.send(genre);
});

router.delete('/:id', (req, res) => {
    // Look up the course/genre
    // Not existing, return 404
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('This genre id was not found');

    // Delete
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    // Return the same course/genre
    res.send(genre);
});

router.get('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('This genre id was not found');
    res.send(genre);
});

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);

}

module.exports = router;