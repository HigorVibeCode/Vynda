import { SvgXml } from "react-native-svg";

import { BRAIN_SVG_XML } from "./brainSvgXml";

type Props = {
  /** Centro do mapa em px (layout dinâmico). */
  mapCenter: number;
  /** Lado do quadrado em px. */
  size: number;
};

const VB_W = 1024;
const VB_H = 1536;

function prepareSvgXml(xml: string): string {
  if (xml.includes("viewBox=")) {
    return xml;
  }
  return xml.replace(
    /<svg\s+xmlns="http:\/\/www\.w3\.org\/2000\/svg"\s+width="\d+"\s+height="\d+">/,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB_W} ${VB_H}" preserveAspectRatio="xMidYMid meet">`
  );
}

const PREPARED_XML = prepareSvgXml(BRAIN_SVG_XML);

/**
 * Cérebro a partir de `brain2.svg` (SVGO → assets/brain-core.svg → brainSvgXml.ts).
 */
export function BrainCore({ mapCenter, size }: Props) {
  const offset = mapCenter - size / 2;

  return (
    <SvgXml
      xml={PREPARED_XML}
      width={size}
      height={size}
      accessible={false}
      style={{
        position: "absolute",
        left: offset,
        top: offset,
      }}
    />
  );
}
