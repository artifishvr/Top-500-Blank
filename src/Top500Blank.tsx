import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
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

const fetchItems = async (count: number, query: string) => {
  try {
    const array: { index: number; src: string }[] = [];
    let page = 1;
    const perPage = 80;

    while (array.length < count) {
      const photos = await client.photos.search({
        query,
        per_page: perPage,
        page: page,
      });

      if ("error" in photos) {
        console.log(photos.error);
        break;
      }

      if (!photos.photos || photos.photos.length === 0) {
        break;
      }

      for (const photo of photos.photos) {
        array.push({
          index: array.length,
          src: photo.src.large,
        });

        if (array.length >= count) {
          break;
        }
      }
      if (photos.photos.length < perPage) {
        break;
      }
      page++;
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
  const { fps } = useVideoConfig();
  const [items, setItems] = useState<{ index: number; src: string }[]>([]);

  useEffect(() => {
    fetchItems(count, query).then(setItems);
  }, [count, query]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#285FB2" }}>
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
