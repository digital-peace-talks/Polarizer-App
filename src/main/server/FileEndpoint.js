"use strict";

const fs = require("fs");
const path = require("path");
const url = require("url");
const MIME = require("./MIME");

/**
 * HTTP server file endpoint.
 */
class FileEndpoint
{
    /**
     * Creates a new instance of this class.
     *
     * @param {String} directory the directory to serve files from.
     * @param {String} index the index file.
     */
    constructor(directory, index = "index.html")
    {
        this.directory = directory;
        this.index = index;
    }

    /**
     * Serves a file.
     *
     * @param {Object} req the HTTP request.
     * @param {Object} res the HTTP response.
     */
    serve(req, res)
    {
        const {pathname} = url.parse(req.url);
        const dirname = process.env.SITE ? process.env.SITE : "src/site";
        const filename = pathname === "/" ? this.index : pathname;
        const file = path.join(process.cwd(), dirname, filename);
        const mime = MIME.fromFilename(filename);
        fs.readFile(file, (err, data) =>
        {
            if(err)
            {
                res.writeHead(404, "Not Found");
                res.end();
            }
            else
            {
                res.writeHead(200, "OK", {"Content-Type": mime});
                res.end(data);
            }
        });
    }
}

module.exports = FileEndpoint;