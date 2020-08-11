const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./logger');
const auth = require('./authentication')
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

console.log(`app: ${app.get('env')}`);

// Configuratioin 
console.log('Applicatin Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
//console.log('Mail Password: ' + config.get('mail.password'));


if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled');
}

// Database work
dbDebugger('connected to the database...');
    
app.use(express.json());

app.use(logger); 
 
app.use(auth);

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(helmet());

app.use(morgan('tiny'));

const genres = [
    { id: 1, name: 'genre1' },
    { id: 2, name: 'genre2' },
    { id: 3, name: 'genre3' },
];

app.get('/', (req, res) => {
    res.render('index', { title: 'My Express App', message: 'Hello'});
});

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('This course id was not found');
    res.send(genre);
});

app.post('/api/genres', (req, res) => {
    const { error } = validateGenres(req.body); 
    if (error) return res.status(400).send(error.details[0].message);   

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('This course id was not found');

     // Validate
    // If invalid, return 400 - Bad request  
    const { error } = validateGenres(req.body); // result.error
    if (error) return res.status(400).send(error.details[0].message);   // 400 Bad Request

    // Update course
    genre.name = req.body.name;
    
    // Return the updated course
    res.send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
    // Look up the course
    // Not existing, return 404
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('This course id was not found');

    // Delete
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    // Return the same course
    res.send(genre);
});



function validateGenres(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);

}







const port = process.env.PORT  || 3000;
app.listen(port, () => console.log(`Listening on port ${port}....`));