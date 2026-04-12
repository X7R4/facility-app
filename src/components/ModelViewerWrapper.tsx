"use client";

import "@google/model-viewer";
import React from "react";

export default function ModelViewerWrapper() {
  return React.createElement("model-viewer", {
    src: "/Model_1775341959036.glb",
    alt: "Totem de Autoatendimento 3D",
    "auto-rotate": true,
    "rotation-per-second": "30deg",
    "camera-controls": true,
    "shadow-intensity": "1.5",
    exposure: "0.9",
    "environment-image": "neutral",
    "interaction-prompt": "none",
    style: { width: "100%", height: "100%", backgroundColor: "transparent" },
    className: "cursor-grab active:cursor-grabbing outline-none"
  });
}
