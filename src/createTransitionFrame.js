import Jimp from "jimp";

async function createTransitionFrame(frameNumber) {
    Jimp.read("../assets/blue.jpg")
        .then((image) => {
            Jimp.loadFont(Jimp.FONT_SANS_128_WHITE).then((font) => {
                const textOptions = {
                    text: `Number ${frameNumber}`,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                };

                image.print(font, 0, 0, textOptions, image.bitmap.width, image.bitmap.height);
                image.write(`../out/frames/${addLeadingZeros(frameNumber)}.jpeg`);

                console.log("Created transition " + frameNumber)
            });
        })
        .catch((err) => {
            console.error(err);
            console.error(`Error while creating transition frame: ${err}`);
        });
}

export { createTransitionFrame };