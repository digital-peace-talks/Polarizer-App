"use strict";

const url = require("url");

/**
 * HTTP path router.
 */
class Router
{
    /**
     * Creates a new instance of this class.
     */
    constructor()
    {
        this.endpoints = new Map();
    }

    /**
     * Adds a route.
     *
     * @param {String} method the HTTP request method.
     * @param {String} path the HTTP request path.
     * @param {Object} endpoint the endpoint instance.
     */
    addRoute(method, path, endpoint)
    {
        let methods = this.endpoints.get(path);
        if(methods === void null)
        {
            methods = new Map();
            this.endpoints.set(path, methods);
        }
        methods.set(method.toUpperCase(), endpoint);
    }

    /**
     * Finds the fist matching route for the specified HTTP path.
     *
     * @param {String} pathname the HTTP request path.
     * @return {Map} the map with each method and endpoint, or {@code null}.
     */
    matchPath(pathname)
    {
        const methods = this.endpoints.get(pathname);
        if(methods === void null)
        {
            for(const [path, map] of this.endpoints.entries())
            {
                if(path instanceof RegExp)
                {
                    if(path.test(pathname))
                    {
                        return map;
                    }
                }
            }
            return null;
        }
        else
        {
            return methods;
        }
    }

    /**
     * Serves a HTTP request.
     *
     * @param {Object} req the HTTP request.
     * @param {Object} res the HTTP response.
     */
    serve(req, res)
    {
        const method = req.method;
        const {pathname} = url.parse(req.url);
        const methods = this.matchPath(pathname);
        if(methods === null)
        {
            res.writeHead(404, "Not Found");
            res.end();
        }
        else
        {
            const endpoint = methods.get(method.toUpperCase());
            if(endpoint === void null)
            {
                const Allow = Array.from(methods.keys()).sort().join(",");
                res.writeHead(405, "Method Not Allowed", {Allow});
                res.end();
            }
            else
            {
                Reflect.set(req, "path", pathname);
                endpoint.serve(req, res);
            }
        }
    }
}

module.exports = Router;