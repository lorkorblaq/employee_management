const HttpStatusCode = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
  }
  
  export default class ErrorLib extends Error {
    constructor(name, code, description) {
      super(name);
      this.code = code;
      this.description = description;
    }
  }
  
  export class NotFound extends ErrorLib {
    constructor(name = '', description = 'not found') {
      super(name, HttpStatusCode.NOT_FOUND, description);
    }
  }
  
  export class BadRequest extends ErrorLib {
    constructor(name = '', description = 'bad request') {
      super(name, HttpStatusCode.BAD_REQUEST, description);
    }
  }
  
  export class ServerError extends ErrorLib {
    constructor(name = '', description = 'server error') {
      super(name, HttpStatusCode.INTERNAL_SERVER, description);
    }
}
