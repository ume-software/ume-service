import * as crypto from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { utilService } from '..';

export class CryptoService {
    constructor() { }

    generateKeyPairSync(format: any = "pem", exportFile = false, fileName: string = "") {
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048
        });

        const publicKeyExport = publicKey.export({ format, type: "pkcs1" })
        const privateKeyExport = privateKey.export({ format, type: "pkcs1" })
        if (exportFile) {
            writeFileSync(`${fileName ? `${fileName}_` : ""}public_key.${format}`, Buffer.from(publicKeyExport));
            writeFileSync(`${fileName ? `${fileName}_` : ""}private_key.${format}`, Buffer.from(privateKeyExport));
        }

        return {
            publicKey,
            privateKey,
            publicKeyExport,
            privateKeyExport
        }
    }
    encryptStringWithRsaPublicKey(toEncrypt: any, relativeOrAbsolutePathToPublicKey: string): string {
        if (utilService.isObject(toEncrypt)) {
            toEncrypt = JSON.stringify(toEncrypt)
        }
        const absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
        const publicKey = readFileSync(absolutePath, "utf8");
        const buffer = Buffer.from(toEncrypt);
        const encrypted = crypto.publicEncrypt(publicKey, buffer);
        return encrypted.toString("base64");
    };

    decryptStringWithRsaPrivateKey(toDecrypt: string, relativeOrAbsolutePathtoPrivateKey: string): string {
        const absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey);
        const privateKey = readFileSync(absolutePath, "utf8");
        const buffer = Buffer.from(toDecrypt, "base64");
        const decrypted = crypto.privateDecrypt(privateKey, buffer);
        return decrypted.toString("utf8");
    };



}