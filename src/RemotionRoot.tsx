import React from "react";
import { Composition } from "remotion";
import { WinterCabin } from "./WinterCabin";
import { WinterCabinReal } from "./WinterCabinReal";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WinterCabinLoop"
        component={WinterCabin}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="WinterCabinRealLoop"
        component={WinterCabinReal}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
