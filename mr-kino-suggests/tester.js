const lb = require("letterboxd-search");

lb.search("wonder woman 1984")
    .then((film) => {
        console.log(film.backdropImage);
    })
    .catch((err) => {
        console.error(err);
    });