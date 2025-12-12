const asyncHandler = (fn) => {
  return function (req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
