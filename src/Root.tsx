import "./index.css";
import { Composition } from "remotion";
import { Top500Blank, CompSchema } from "./Top500Blank";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render src/index.ts <id> out/video.mp4
        id="Top500Blank"
        component={Top500Blank}
        durationInFrames={2000}
        fps={30}
        width={1280}
        height={720}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={CompSchema}
        defaultProps={{
          query: "fish",
          count: 10,
        }}
      />
    </>
  );
};
