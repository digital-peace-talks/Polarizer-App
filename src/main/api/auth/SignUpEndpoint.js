"use strict";

/**
 * Sign up endpoint.
 */
class SignUpEndpoint
{
    /**
     * Creates a new instance of this class.
     *
     * @param {Object} dao the data access object.
     */
    constructor(dao)
    {
        this.dao = dao;
    }

    /**
     * Serves a file.
     *
     * @param {Object} req the HTTP request.
     * @param {Object} res the HTTP response.
     */
    serve(req, res)
    {
    }
}

module.exports = SignUpEndpoint;