"use client";

import { useEffect } from "react";
import Header from "./Header";
import Title from "./Title";
import About from "./About";
import Character from "./Character";
import Game from "./Game";
import End from "./End";
import goc from "./main";

/**
 * This is a simple port of the existing Game of College logic into a React
 * component. All the logic is left as untouched as possible from the original
 * implementation.
 */
export default function GameOfCollege() {
  useEffect(() => {
    goc.func.initializeGame();
  }, []);
  return (
    <>
      <Header />
      <main id="container">
        <Title />
        <About />
        <Character />
        <Game />
        <End />
      </main>
      <div id="loading-screen">
        <div className="animation">
          <h1>Loading</h1>
        </div>
      </div>
      <div id="orientation-screen">
        <h4>Please change device orientation</h4>
      </div>
      <div id="difficulty-screen">
        <div data-role="difficulty">
          <h4>Your Difficulty:</h4>
          <p></p>
          <p></p>
          <div data-role="buttons">
            <div className="goc-button">Continue</div>
          </div>
        </div>
      </div>
    </>
  );
}
