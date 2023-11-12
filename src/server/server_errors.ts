/* 
 * ALL SERVER RELATED ERRORS BY CODE
 * 400: Bad Request, missing field, improper format, invalid authentication token
 * 401: Unauthorized permission, or username/password is invalid
 * 404: Not Found, ie package does not exist
 * 409: Conflict, ie package already exists
 * 413: Payload Too Large, ie too many packages returned
 * 424: Failed Dependency, ie package is not uploaded due to the disqualified rating.
 */

export class Server_400 extends Error {
    constructor(message:string|null) {
        if(!message) 
            message = "Bad/Invalid Request";
        super(message);
        this.name = "400";
    }
}

export class Server_401 extends Error {
    constructor(message:string|null) {
        if(!message)
            message = "Invalid Authentication";
        super(message);
        this.name = "401";
    }
}

export class Server_404 extends Error {
    constructor(message:string|null) {
        if(!message)
            message = "Not Found";
        super(message);
        this.name = "404";
    }
}

export class Server_409 extends Error {
    constructor(message:string|null) {
        if(!message)
            message = "Conflict - Package Already Exists";
        super(message);
        this.name = "409";
    }
}

export class Server_413 extends Error {
    constructor(message:string|null) {
        if(!message)
            message = "Payload Too Large";
        super(message);
        this.name = "413";
    }
}

export class Server_424 extends Error {
    constructor(message:string|null) {
        if(!message)
            message = "Failed Dependency - Package is not uploaded due to the disqualified rating.";
        super(message);
        this.name = "424";
    }
}
