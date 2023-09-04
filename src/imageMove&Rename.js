import fs from 'fs';
import path from 'path';
import { addLeadingZeros } from './utils/addLeadingZeros';

async function MoveAndRename(imagePath, frameDirectory, frameNumber) {
    try {
        if (!fs.existsSync(frameDirectory)) {
            fs.mkdirSync(frameDirectory);
        }

        let image = fs.readFileSync(imagePath);

        const filename = `${addLeadingZeros(frameNumber)}.jpeg`;
        const outputImagePath = path.join(frameDirectory, filename);

        fs.writeFileSync(outputImagePath, image);

        return outputImagePath;
    } catch (error) {
        console.error(`Error in Move&Rename: ${error}`);
        return null;
    }
}

export { MoveAndRename }