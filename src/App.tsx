import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";


function App() {
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  return (
    <div id="app">
      <div id="game-container">
        <PhaserGame ref={phaserRef} />
      </div>
    </div>
  );
}

export default App;
