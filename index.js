import GoogleImages from "googleimg";
import dotenv from "dotenv";
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import mime from 'mime-types';
import axios from "axios";
import Jimp from "jimp";
import exec from "await-exec"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const giclient = new GoogleImages('230ee02d3fb284efd', process.env.IMG_TOKEN);

function formatNumber(num) {
    // Convert the number to a string
    const numStr = num.toString();

    // Calculate the number of leading zeros required
    const leadingZeros = 3 - numStr.length;

    // Add leading zeros to the number
    const formattedNum = '0'.repeat(leadingZeros) + numStr;

    return formattedNum;
}

async function makeTrans(frames) {

    Jimp.read("./assets/blue.jpg")
        .then((image) => {
            Jimp.loadFont(Jimp.FONT_SANS_128_WHITE).then((font) => {
                const textOptions = {
                    text: `Number ${frames / 2 - 0.5 + 1}`,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                };
                image.print(font, 0, 0, textOptions, image.bitmap.width, image.bitmap.height);
                image.write(`./out/frames/${formatNumber(frames)}.jpeg`);
                console.log("Created transition " + frames)
            });
        })
        .catch((err) => {
            console.error(err);
        });
}

const frameDirectory = path.join(__dirname, 'out/frames');
const downloadDirectory = path.join(__dirname, 'out/images');

async function downloadImage(url, index) {
    try {

        if (!fs.existsSync(frameDirectory)) {
            fs.mkdirSync(frameDirectory);
        }
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const contentType = response.headers['content-type'];
        const ext = mime.extension(contentType);

        if (!ext) {
            console.error(`Unknown content type for image at index ${index}: ${contentType}`);
            return null;
        }

        const filename = `${formatNumber(index)}.${ext}`;
        const imagePath = path.join(frameDirectory, filename);

        fs.writeFileSync(imagePath, response.data);

        return imagePath;
    } catch (error) {
        console.error(`Error downloading image at index ${index}: ${error.message}`);
        return null;
    }
}

async function makeVideo() {
    await exec(`ffmpeg -framerate 1 -start_number 1 -i %3d.jpeg -c:v libx264 -r 1 -y ../output.mp4`, { cwd: frameDirectory })
    console.log("Video created at /out/output.mp4!");
    try {
        fs.rmdirSync(frameDirectory, { recursive: true });
        console.log("Cleaned up frames");
    } catch (error) {
        console.error(`Error deleting frames: ${error.message}`);
    }

}


let query = "meow";
(async () => {    
    await giclient.search(query)
        .then(async images => {
            if (!images) {
                return console.log("no results");
            }
            let frames = images.length * 2;
            while (frames > 0) {
                frames--;
                await makeTrans(frames);
                frames--;
                const imageUrl = images[frames / 2].link;
                const imagePath = await downloadImage(imageUrl, frames);
                if (imagePath) {
                    console.log(`Downloaded image ${imageUrl}`);
                } else {
                    console.log(`Failed to download ${imageUrl}`);
                }
            }
        });
    makeVideo();

})();