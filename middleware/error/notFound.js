const notFound = (req, res, next) => {
    error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404).send("Not Found");
    next(error);
}

export default notFound;