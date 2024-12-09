import colors from "colors";

const logger = (req, res, next) => {
    const methodColors = {
        GET: "blue",
        POST: "green",
        PUT: "yellow",
        DELETE: "red"
    };
    const color = methodColors[req.method] || "white";
    console.log(`${req.protocol}://${req.get("host")}${req.originalUrl}`[color]);
    next();
}

export default logger;