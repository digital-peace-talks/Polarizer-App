"use strict";

const path = require("path");

/**
 * MIME types.
 */
class MIME
{
    /**
     * Creates a new instance of this class.
     */
    constructor()
    {
        this.map = new Map();
        this.map.set("html", "text/html; charset=utf-8");
        this.map.set("js", "application/javascript");
    }

    /**
     * Gets the MIME type from a file extension.
     *
     * @param {String} extension the file extension (e. g. "html").
     * @return {String} the matching MIME type.
     */
    fromExtension(extension)
    {
        const mime = this.map.get(extension.toLowerCase());
        return mime === void null ? "application/octet-stream" : mime;
    }

    /**
     * Gets a MIME type from a filename.
     *
     * @param {String} filename the file name.
     * @return {String} the matching MIME type.
     */
    fromFilename(filename)
    {
        const extname = path.extname(filename);
        if(extname.startsWith("."))
        {
            return this.fromExtension(extname.substr(1));
        }
        else
        {
            return this.fromExtension("");
        }
    }
}

module.exports = new MIME();