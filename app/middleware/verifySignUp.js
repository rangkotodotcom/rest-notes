const db = require("../models");
const Role = db.Role;
const User = db.User;

checkDuplicateEmail = (req, res, next) => {
    // Email
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Email is already in use!"
            });
            return;
        }

        next();
    });
};

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            Role.findOne({
                where: {
                    id: req.body.roles[i]
                }
            }).then(role => {
                if (!role) {
                    res.status(400).send({
                        message: "Failed! Role does not exist = " + req.body.roles[i]
                    });
                    return;
                }
                next();
            });
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail,
    checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;