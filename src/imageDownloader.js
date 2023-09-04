// !! this doesn't work yet 

import GoogleImages from "googleimg";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import mime from 'mime-types';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let query = "meow";

async function downloadImages(query, downloadDirectory, totalImages) {
    if (!fs.existsSync(downloadDirectory)) {
        fs.mkdirSync(downloadDirectory);
    }

    const giclient = new GoogleImages(process.env.IMG_ID, process.env.IMG_TOKEN);
    await giclient.search(query, { safe: "high" }).then(async (images) => {

        images.forEach(async image => {
            const response = await axios.get(image.link, { responseType: 'arraybuffer' });
            const contentType = response.headers['content-type'];
            const ext = mime.extension(contentType);

            if (!ext) {
                console.error(`Unknown content type for image: ${contentType}`);
                return null;
            }

            const filename = `image${Math.floor(Math.random() * 1000000)}.${ext}`;
            const imagePath = path.join(downloadDirectory, filename);

            fs.writeFileSync(imagePath, response.data);

        });
    });

}