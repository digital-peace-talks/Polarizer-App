"use strict";

const ServerBuilder = require("./ServerBuilder");

/**
 * Main application entry point.
 *
 * @param {Array} args the command line arguments.
 */
const main = async function(args)
{
    if(args.length < 4)
    {
        process.stdout.write("Usage: node App.js host port\n");
        process.exit(1);
    }
    else
    {
        const host = args[2];
        const port = args[3];
        const server = ServerBuilder.buildServer();
        await server.start(host, port);
        process.on("SIGINT", async() =>
        {
            await server.stop();
            process.stdout.write("Server stopped\n");
            process.exit(0);
        });
        process.stdout.write(`Server listening at ${host}:${port}\n`);
    }
};

main(process.argv).catch((e) => process.stderr.write(e.stack) | process.exit(1));