const { CONFLICTING_REQUEST } = require("./errors");

class ConflictingRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICTING_REQUEST;
  }
}

module.exports = ConflictingRequestError;
