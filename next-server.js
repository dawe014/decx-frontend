import express from "express";
import next from "next";
import { createServer } from "http";
import { parse } from "url";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all("*", (req, res) => {
    const parsedUrl = parse(req.url, true);
    return handle(req, res, parsedUrl);
  });

  // cPanel provides the PORT environment variable.
  const port = process.env.PORT || 3000;

  createServer(server).listen(port, (err) => {
    if (err) throw err;
  });
});
