import React, { useEffect, useMemo, useRef, useState } from "react";

// ✅ YOUR FILES (based on your screenshot)
import demoEnter from "./assets/kenney/levels/demo/Enter.png";
import demoCollect from "./assets/kenney/levels/demo/Collect.png";
import demoLeave from "./assets/kenney/levels/demo/Leave.png";
import getQuizElements from "./components/Quiz";

// ✅ Update this path if your player sprite file name differs
// (You said you already uploaded a character png into the character folder)
import playerPng from "./assets/kenney/player/11.png";

const VIEWPORT = { w: 800, h: 450 };

function overlap(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

export default function GameCanvas({ onTriggerQuiz, levels }) {
  // Demo-only: one level, 3 scenes
  // const quiz = getQuizElements(level);
  const LEVELS = useMemo(
    () => [
      {
        id: "demo",
        scenes: {
          enter: demoEnter,
          collect: demoCollect,
          leave: demoLeave,
        },
        spawn: { x: 60, y: 340 },

        // ✅ PLACEHOLDER: you will set x/y after clicking on the chest in the background
        // Start with a visible red box so you can see where it is.
        chests: [{ id: "c1", x: 368, y: 200, w: 65, h: 60 }],
      },
    ],
    []
  );

  const [levelIndex] = useState(0);
  const [sceneKey, setSceneKey] = useState("enter"); // start here

  const canvasRef = useRef(null);

  // Game data refs (no re-render every frame)
  const keysRef = useRef({});
  const playerRef = useRef({ x: 60, y: 340, w: 100, h: 100, speed: 3.2 });

  const assetsRef = useRef({
    ready: false,
    playerImg: null,
    sceneImgs: {}, // sceneKey -> Image
  });

  const level = LEVELS[levelIndex];

  // Reset player position when restarting / changing scene (optional)
  useEffect(() => {
    if (sceneKey === "enter") {
      playerRef.current.x = level.spawn.x;
      playerRef.current.y = level.spawn.y;
    }
  }, [sceneKey, level.spawn.x, level.spawn.y]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Fixed viewport size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(VIEWPORT.w * dpr);
    canvas.height = Math.floor(VIEWPORT.h * dpr);
    canvas.style.width = `${VIEWPORT.w}px`;
    canvas.style.height = `${VIEWPORT.h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Load images (player + 3 scenes)
    const playerImg = new Image();
    playerImg.src = playerPng;

    const loadScene = (key, src) =>
      new Promise((res) => {
        const img = new Image();
        img.src = src;
        img.onload = () => res([key, img]);
      });

    Promise.all([
      new Promise((res) => (playerImg.onload = () => res())),
      loadScene("enter", level.scenes.enter),
      loadScene("collect", level.scenes.collect),
      loadScene("leave", level.scenes.leave),
    ]).then((results) => {
      assetsRef.current.playerImg = playerImg;
      results
        .filter((x) => Array.isArray(x))
        .forEach(([key, img]) => {
          assetsRef.current.sceneImgs[key] = img;
        });
      assetsRef.current.ready = true;
    });

    // Key handlers
    const onKeyDown = (e) => (keysRef.current[e.key] = true);
    const onKeyUp = (e) => (keysRef.current[e.key] = false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Click-to-log coordinates (for placing chest hitboxes)
    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);
      console.log("CLICK:", { scene: sceneKey, x, y });
    };
    canvas.addEventListener("click", onClick);

    let raf = 0;
    const loop = () => {
      update();
      draw(ctx);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("click", onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LEVELS]);

  function update() {
    const keys = keysRef.current;
    const p = playerRef.current;

    // Restart demo anytime
    if (keys.r || keys.R) {
      setSceneKey("enter");
      keysRef.current.r = false;
      keysRef.current.R = false;
      return;
    }

    // In Leave scene: do nothing except restart
    if (sceneKey === "leave") return;

    // Move player only in enter/collect
    let dx = 0,
      dy = 0;
    if (keys.ArrowUp || keys.w) dy -= 1;
    if (keys.ArrowDown || keys.s) dy += 1;
    if (keys.ArrowLeft || keys.a) dx -= 1;
    if (keys.ArrowRight || keys.d) dx += 1;

    if (dx !== 0 && dy !== 0) {
      const inv = 1 / Math.sqrt(2);
      dx *= inv;
      dy *= inv;
    }

    p.x += dx * p.speed;
    p.y += dy * p.speed;

    p.x = Math.max(0, Math.min(VIEWPORT.w - p.w, p.x));
    p.y = Math.max(0, Math.min(VIEWPORT.h - p.h, p.y));

    // Scene logic:
    if (sceneKey === "enter") {
      // Interact with chest: press E while overlapping hitbox
      const playerRect = { x: p.x, y: p.y, w: p.w, h: p.h };
      const chest = level.chests.find((c) => overlap(playerRect, c));

      if (chest && (keys.e || keys.E)) {
        setSceneKey("collect"); // open/coins scene
        const quiz = getQuizElements(levels); // make sure this returns a quiz object
        if (quiz) {
          onTriggerQuiz(quiz); // pass the object, not undefined or level number
        }

        keysRef.current.e = false;
        keysRef.current.E = false;
      }
    } else if (sceneKey === "collect") {
      // Finish: space or enter to leave
      if (keys[" "] || keys.Enter) {
        setSceneKey("leave");

        keysRef.current[" "] = false;
        keysRef.current.Enter = false;
      }
    }
  }

  function draw(ctx) {
    ctx.clearRect(0, 0, VIEWPORT.w, VIEWPORT.h);

    const assets = assetsRef.current;
    if (!assets.ready) {
      ctx.fillStyle = "#0b0b12";
      ctx.fillRect(0, 0, VIEWPORT.w, VIEWPORT.h);
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "18px system-ui";
      ctx.fillText("Loading…", 12, 28);
      return;
    }

    // Draw current scene background scaled to the fixed viewport
    const bg = assets.sceneImgs[sceneKey];
    if (bg) ctx.drawImage(bg, 0, 0, VIEWPORT.w, VIEWPORT.h);

    // Debug chest hitbox ONLY in enter scene
    const DEBUG_HITBOX = true;
    if (DEBUG_HITBOX && sceneKey === "enter") {
      ctx.fillStyle = "rgba(255,0,0,0.25)";
      level.chests.forEach((c) => ctx.fillRect(c.x, c.y, c.w, c.h));
      ctx.strokeStyle = "rgba(255,0,0,0.8)";
      level.chests.forEach((c) => ctx.strokeRect(c.x, c.y, c.w, c.h));
    }

    // Draw player
    const p = playerRef.current;
    ctx.drawImage(assets.playerImg, p.x, p.y, p.w, p.h);

    // HUD
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(10, 10, 330, 72);
    ctx.fillStyle = "white";
    ctx.font = "14px system-ui";
    ctx.fillText(`Scene: ${sceneKey}`, 18, 32);
    ctx.fillText("Move: WASD / Arrows", 18, 52);
    ctx.fillText("E = interact | Space/Enter = continue | R = restart", 18, 72);

    // Prompt
    if (sceneKey === "enter") {
      const playerRect = { x: p.x, y: p.y, w: p.w, h: p.h };
      const chest = level.chests.find((c) => overlap(playerRect, c));
      if (chest) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(360, 10, 170, 30);
        ctx.fillStyle = "white";
        ctx.fillText("Press E to open", 372, 31);
      }
    } else if (sceneKey === "collect") {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(360, 10, 260, 30);
      ctx.fillStyle = "white";
      ctx.fillText("Space/Enter to continue", 372, 31);
    }
  }

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 10 }}>
      <canvas ref={canvasRef} />
      <div style={{ fontFamily: "system-ui", fontSize: 12, opacity: 0.8 }}>
        Tip: click on the canvas to print coordinates in the console for chest
        placement.
      </div>
    </div>
  );
}
