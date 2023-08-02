const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/note/all", controller.allAccess);

    app.get(
        "/api/note/user",
        [authJwt.verifyToken],
        controller.userBoard
    );

    app.get(
        "/api/note/manager",
        [authJwt.verifyToken, authJwt.isManager],
        controller.managerBoard
    );

    app.get(
        "/api/note/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );
};