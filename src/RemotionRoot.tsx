import React from "react";
import { Composition } from "remotion";
import { WinterCabin } from "./WinterCabin";
import { WinterCabinReal } from "./WinterCabinReal";
import { HalloweenHouse } from "./HalloweenHouse";
import { NewYearGift } from "./NewYearGift";
import { NewYearHourglass } from "./NewYearHourglass";
import { NewYearCap } from "./NewYearCap";
import { NewYearDrink } from "./NewYearDrink";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WinterCabinLoop"
        component={WinterCabin}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
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
      <Composition
        id="HalloweenHouseLoop"
        component={HalloweenHouse}
        durationInFrames={180}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{}}
      />
      <Composition
        id="NewYearGiftLoop"
        component={NewYearGift}
        durationInFrames={180}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{}}
      />
      <Composition
        id="NewYearHourglassLoop"
        component={NewYearHourglass}
        durationInFrames={180}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{}}
      />
      <Composition
        id="NewYearCapLoop"
        component={NewYearCap}
        durationInFrames={180}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{}}
      />
      <Composition
        id="NewYearDrinkLoop"
        component={NewYearDrink}
        durationInFrames={180}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{}}
      />
    </>
  );
};
