class apiSuccess {
  constructor(statusCode, message, data, meta = {}) {
    this.success = statusCode < 400;
    this.statusCode = statusCode || 200;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}

export { apiSuccess };
