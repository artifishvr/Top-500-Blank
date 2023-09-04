import GoogleImages from "googleimg";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import mime from 'mime-types';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

function formatNumber(num) {
    // Convert the number to a string
    const numStr = num.toString();

    // Calculate the number of leading zeros required
    const leadingZeros = 3 - numStr.length;

    // Add leading zeros to the number
    const formattedNum = '0'.repeat(leadingZeros) + numStr;

    return formattedNum;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadDirectory = path.join(__dirname, 'out/images');

let query = "meow";

const giclient = new GoogleImages('230ee02d3fb284efd', process.env.IMG_TOKEN);
await giclient.search(query, { safe: "high" }).then(async (images) => {
    if (!fs.existsSync(downloadDirectory)) {
        fs.mkdirSync(downloadDirectory);
    }
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