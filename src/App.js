import React, { useState } from "react";
import MapView from "./MapView";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  return (
    <div className="flex h-screen">
      {/* 🧭 Dashboard */}
      <div className="w-1/3 bg-gray-900 text-white p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Fleet Tracking Dashboard</h1>

        <div className="space-y-2">
          <p>🚘 <strong>Trip:</strong> Cross Country</p>
          <p>🕒 <strong>Duration:</strong> 6 hrs 15 mins</p>
          <p>📍 <strong>Distance:</strong> 430 km</p>
        </div>

        {/* Playback Controls */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-blue-600 w-full py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isPlaying ? "⏸ Pause" : "▶️ Play"}
          </button>

          <div>
            <label className="block mb-1">⚡ Speed: {speed}x</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* 🌍 Map Area */}
      <div className="flex-1">
        <MapView isPlaying={isPlaying} speed={speed} />
      </div>
    </div>
  );
}

export default App;

