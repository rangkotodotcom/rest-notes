const { v4: uuidv4 } = require('uuid');
const db = require("../models");
const config = require("../config/auth.config");
const User = db.User;
const Role = db.Role;
const UserRole = db.UserRole;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        id: uuidv4(),
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    }).then(user => {
        let success = 0;
        if (req.body.roles) {
            for (let i = 0; i < req.body.roles.length; i++) {
                Role.findOne({
                    where: {
                        id: req.body.roles[i]
                    }
                }).then(roles => {
                    UserRole.create({
                        id: uuidv4(),
                        userId: user.id,
                        roleId: req.body.roles[i]
                    }).then(() => {
                        success++;
                    });
                });
            }
        } else {
            success++;
        }


        if (success > 0) {
            res.status(200).send({ message: "User was registered successfully!" });
        } else {
            res.status(200).send({ message: "User was registered successfully!" });
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        const token = jwt.sign({ id: user.id },
            config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
            });

        var authorities = [];
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: user.id,
                name: user.name,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};