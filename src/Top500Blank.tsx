import {
  AbsoluteFill,
  delayRender,
  Sequence,
  useVideoConfig,
  getStaticFiles,
  Audio,
  continueRender,
  cancelRender,
} from "remotion";
import { Title } from "./Top500Blank/Title";
import { Image } from "./Top500Blank/Image";

import { useEffect, useState, Fragment } from "react";
import { z } from "zod";
import { createClient } from "pexels";

const client = createClient(process.env.PEXELS_KEY || "");

export const CompSchema = z.object({
  query: z.string(),
  count: z.number(),
});

const fetchItems = async (count: number, query: string, handle: any) => {
  try {
    const photos = await client.photos.search({ query, per_page: 80 });

    if ("error" in photos) {
      console.log(photos.error);
      return [];
    }

    const array: { index: number; src: string }[] = [];

    for (const photo of photos.photos) {
      if (array.length >= count) {
        break;
      }
      array.push({
        index: array.length,
        src: photo.src.large,
      });
    }

    continueRender(handle);
    return array;
  } catch (error) {
    console.error("Error fetching photos:", error);
    cancelRender(handle);
    return [];
  }
};

export const Top500Blank: React.FC<z.infer<typeof CompSchema>> = ({
  query,
  count,
}) => {
  const { fps } = useVideoConfig();
  const [items, setItems] = useState<{ index: number; src: string }[]>([]);
  const [randomizedAudioFiles, setRandomizedAudioFiles] = useState<any[]>([]);
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    fetchItems(count, query, handle).then(setItems);
  }, [count, query]);

  useEffect(() => {
    const files = getStaticFiles()
      .filter((file) => file.name.includes("audio/"))
      .map((file) => file.src);

    const audioDurations: { [src: string]: number } = {};

    const durationPromises = files.map((file) => {
      return new Promise<void>((resolve) => {
        const audio = document.createElement("audio");
        audio.src = file;
        audio.addEventListener("loadedmetadata", () => {
          audioDurations[file] = Math.ceil(audio.duration * fps);
          resolve();
        });
        audio.addEventListener("error", () => {
          audioDurations[file] = fps * 6;
          resolve();
        });
      });
    });

    Promise.all(durationPromises).then(() => {
      const filesWithDurations = files.map((file) => ({
        src: file,
        durationInFrames: audioDurations[file],
      }));

      setRandomizedAudioFiles(filesWithDurations);
    });
  }, [fps]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#285FB2" }}>
      {randomizedAudioFiles.map((audioFile, audioIndex) => {
        const startFrame = audioIndex * audioFile.durationInFrames;
        return (
          <Sequence
            key={`audio-${audioIndex}`}
            from={startFrame}
            durationInFrames={audioFile.durationInFrames}
          >
            <Audio src={audioFile.src} />
          </Sequence>
        );
      })}

      <Sequence from={0} durationInFrames={fps * 3}>
        <Title titleText={`top ${count} ${query}`} />
      </Sequence>

      {items.map((item, index) => (
        <Fragment key={"fragment-" + index}>
          <Sequence
            from={fps * 3 + fps * 6 * item.index}
            durationInFrames={fps * 3}
          >
            <Title titleText={`Number ${count - item.index}`} />
          </Sequence>
          <Sequence
            from={fps * 3 + fps * 6 * item.index + fps * 3}
            durationInFrames={fps * 3}
          >
            <Image src={item.src}></Image>
          </Sequence>
        </Fragment>
      ))}
    </AbsoluteFill>
  );
};
