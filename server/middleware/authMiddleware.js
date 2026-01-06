const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        console.log("VerifyToken: No token provided");
        return res.status(403).send({ message: "No token provided!" });
    }

    const bearer = token.split(' ');
    const bearerToken = bearer[1];

    jwt.verify(bearerToken, process.env.JWT_SECRET || 'dev_secret_key', (err, decoded) => {
        if (err) {
            console.log("VerifyToken Error:", err.message);
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).send({ message: "Require " + roles.join(" or ") + " role!" });
        }
        next();
    };
};

module.exports = { verifyToken, checkRole };
