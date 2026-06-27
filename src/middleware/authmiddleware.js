import jwt from "jsonwebtoken";


export const protect = (req, res, next) => {
    console.log("HEADERS:", req.headers); 
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        console.log("NO TOKEN FOUND"); 
        return res.status(401).json({ message: "Not authorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("JWT ERROR:", error.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};