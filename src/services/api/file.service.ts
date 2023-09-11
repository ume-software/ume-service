import { join } from "path";
import { config } from "@/configs";

export class FileService {
    async upload(req: any, pathApi: string = "api/file"): Promise<string[]> {
        let files = req.files;
        const pathnames = [];
        let listFiles = [];
        if (files?.length) {
            listFiles = [...files];
        } else {
            listFiles.push(files);
        }
        for (const file of listFiles) {
            const { filename } = file;
            let newFilename = filename;
            const hostname = config.server.host ?? req.headers.host;
            const result = `${req.protocol}://${join(
                config.server.prefixPath.value,
                hostname,
                join(pathApi, encodeURIComponent(newFilename))
            ).replace(/\\/g, "/")}`;

            pathnames.push(result);
        }

        return pathnames;
    }
}
