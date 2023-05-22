const { verifySignUp } = require("../middlewares");
const authController = require("../controllers/auth.controller");

module.exports = (app) => {
    /** Middleware for this set of routes */
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    /** HTTP methods handler controllers */
    app.post(
        "/api/auth/signup",
        [verifySignUp.checkDuplicateUsername],
        authController.signUp
    );
    app.post("/api/auth/signin", authController.signIn);
    app.post("/api/auth/signout", authController.signOut);
};
