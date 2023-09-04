import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';;
import { createTransitionFrame } from "./src/createTransitionFrame";
import { MoveAndRename } from "./src/imageMove&Rename";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frameDirectory = path.join(__dirname, 'out/frames');
const downloadDirectory = path.join(__dirname, 'out/images');

(async () => {

    console.log("This code doesn't work yet!! Sorry :(");
    return;

    const images = fs.readdirSync(downloadDirectory);

    if (!images) {
        return console.log("no images downloaded");
    }
    console.log(images);
    let frames = images.length * 2;
    while (frames > 0) {
        frames--;
        await createTransitionFrame(frames);
        frames--;
        const imageUrl = images[frames / 2];
        const imagePath = await MoveAndRename(path.join(downloadDirectory, imageUrl), frameDirectory, frames);
        if (imagePath) {
            console.log(`yep we got a ${imageUrl} - ${imagePath}`);
        } else {
            console.log(`Failed to download ${imageUrl} - ${imagePath}`);
        }
    }
    makeVideo();

})();