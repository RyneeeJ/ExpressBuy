// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: "Error",
    message: "There was an error!!!",
    error: err,
  });
};
