import { Roboto_Condensed, Teko } from "next/font/google";
import { DataLayer } from "@/analytics";
import GameOfCollege from "@/components/GameOfCollege";
import "./style.scss";

const roboto = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const teko = Teko({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default async function GameOfCollegePage() {
  return (
    <div className={`${roboto.className} ${teko.className}`}>
      <DataLayer
        dataLayerKey="game-of-college"
      />
      <GameOfCollege />
    </div>
  );
}
