function errorHandlers(err, req, res, next) {
  //jwt authentication error
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "The user is not authenticated" });
  }
  if (err.name === "NotFoundError") {
    return res.status(404).json({ message: "User not found" });
  }
  if (err.name === "ValidationError") {
    return res.status(404).json({ message: err });
  }

  return res.status(500).json({ message: err.message });
}

module.exports = errorHandlers;
