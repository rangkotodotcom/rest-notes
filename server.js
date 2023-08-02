const express = require("express");
const cors = require("cors");

const app = express();

// const db = require("./app/models");
// const Role = db.role;

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Untuk Mode Development
// db.sequelize.sync({ force: true }).then(() => {
//     console.log('Drop and Resync Db');
//     initial();
// });

// Untuk Mode Production
// db.sequelize.sync();

// function initial() {
//     Role.create({
//         id: 1,
//         name: "admin"
//     });

//     Role.create({
//         id: 2,
//         name: "manager"
//     });

//     Role.create({
//         id: 3,
//         name: "user"
//     });
// }

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to rangkoto application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});