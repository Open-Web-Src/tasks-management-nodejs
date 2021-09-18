module.exports = (err, req, res, next) => {
    err.code = err.code ? err.code : 500;
    res.status(err.code).json({ error: err.message });
}