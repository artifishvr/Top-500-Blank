import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Title } from "./Top500Blank/Title";
import { Image } from "./Top500Blank/Image";
import { useEffect, useState } from "react";

import { z } from "zod";

import { createClient } from "pexels";

const client = createClient(process.env.PEXELS_KEY || "");

export const CompSchema = z.object({
  query: z.string(),
  count: z.number(),
});

const fetchItems = async (count: number, query: string) => {
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

    return array;
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
};

export const Top500Blank: React.FC<z.infer<typeof CompSchema>> = ({
  query,
  count,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const [items, setItems] = useState<{ index: number; src: string }[]>([]);

  useEffect(() => {
    fetchItems(count, query).then(setItems);
  }, [count, query]);

  console.log(fps);
  console.log(fps);

  // Fade out the animation at the end
  const opacity = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames - 15],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // A <AbsoluteFill> is just a absolutely positioned <div>!
  return (
    <AbsoluteFill style={{ backgroundColor: "#285FB2" }}>
      <AbsoluteFill style={{ opacity }}>
        <Sequence from={0} durationInFrames={fps * 3}>
          <Title titleText={`top ${count} ${query}`} />
        </Sequence>

        {items.map((item) => (
          <>
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
          </>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
