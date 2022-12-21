import express from "express";
import multer from "multer";
import cors from "cors";
import { getFile, uploadFile } from "./lib/s3";
import fs from "fs";
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const upload = multer({ dest: "uploads/" });

const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.send("server running");
});

app.get("/file/:key", async (req, res) => {
  const key = req.params.key;
  const result = await getFile(key);

  result.pipe(res);
});

app.post("/upload", upload.single("image"), async function (req, res, next) {
  try {
    const { body, file } = req;
    const { description } = body;
    const result = await uploadFile(file!);
    await unlinkFile(file!.path);
    res.status(200).json({
      message: "File Uploaded Successsfully",
      data: { name: result.Key, description: description },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(8080, () => {
  console.log("Listening on Port 8080");
});
