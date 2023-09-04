// TODO can i do this without a lazy exec()?

async function makeVideo(inputFrameDirectory, outputDirectory) {
    try {
        await exec(`ffmpeg -framerate 1 -start_number 1 -i %3d.jpeg -c:v libx264 -r 1 -y ../output.mp4`, { cwd: inputFrameDirectory })
        console.log("Video created!");
    } catch (error) {
        console.error(`Error creating video: ${error}`);
    }

    try {
        fs.rmdirSync(inputFrameDirectory, { recursive: true });
        console.log("Cleaned up frames");

    } catch (error) {
        console.error(`Error cleaning frame directory: ${error}`);
    }

}