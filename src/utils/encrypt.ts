import crypto from "crypto";
import { queryVault } from "./apivault";
import fs from "fs";
import { Response } from "express";
import { Readable } from "stream";
const AES_VAULT_URI = process.env.AES_VAULT_URI || "";
console.log("AES_VAULT_URI: ", AES_VAULT_URI);
const ALGORITHM = "aes-256-cbc";

export const decryptFile = async (path: string) => {
  const keys: any = await queryVault(AES_VAULT_URI);

  const fileEncrypted = fs.readFileSync(path);
  console.log("File to decrypt: ", fileEncrypted);

  let decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(keys.key, "base64"),
    Buffer.from(keys.iv, "base64")
  );
  let decrypted = decipher.update(fileEncrypted);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted;
};

export const decryptVideo = async (
  path: string,
  range: string,
  res: Response
) => {
  const file = await decryptFile(path);

  if (range) {
    console.log("Rang: ", range);
    
    const size = file.length;
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, size - 1);

   
      const contentLength = end - start + 1;
      
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };

      const readable = new Readable();
      readable._read = () => {}; 
      readable.push(file.slice(start, end + 1));
      readable.push(null);

      res.writeHead(206, headers);
      readable.pipe(res);

  } else {
    console.log("No range");
    res.send(file);
  }
};
