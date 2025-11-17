"use client";

import { joinRoom, selfId, type ActionSender } from "trystero";
import {
  useEffect,
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type CSSProperties,
} from "react";
import { CheerCelebration } from "./cheer-celebration";

const COLORS = [
  "#00bcd4",
  "#4caf50",
  "#ffc107",
  "#ff5722",
  "#9c27b0",
  "#2196f3",
  "#e91e63",
  "#8bc34a",
];

const POINTER_COLORS = [
  "#3b82f6",
  "#22d3ee",
  "#a855f7",
  "#f97316",
  "#f43f5e",
  "#84cc16",
  "#eab308",
  "#f59e0b",
];

const NICKNAME_ADJECTIVES = [
  "Swift",
  "Calm",
  "Hidden",
  "Lucky",
  "Bright",
  "Clever",
  "Brave",
  "Kind",
];

const NICKNAME_ANIMALS = [
  "Fox",
  "Otter",
  "Falcon",
  "Panda",
  "Dolphin",
  "Lynx",
  "Koala",
  "Seal",
];

const ASPECT_RATIO = 16 / 9;
const BASE_HEIGHT = 420;
const BASE_WIDTH = BASE_HEIGHT * ASPECT_RATIO;
const LOGO_WIDTH_RATIO = 3 / 16; // matches 140px on a 16:9 area at 420px height
const LOGO_HEIGHT_RATIO = 4 / 21; // matches 80px on a 420px height
const SPEED_PER_HEIGHT = 3 / 7; // 180px per 420px height
const POINTER_RADIUS_RATIO = 1 / 30; // 14px per 420px height
const LOGO_FONT_RATIO = 30 / BASE_HEIGHT; // text size inside the logo
const LEADER_HEARTBEAT_MS = 1000;
const LEADER_CHECK_MS = 400;
const CHEER_DURATION_MS = 1700;

type PointerPayload = {
  x: number;
  y: number;
  name: string;
  color: string;
  active: boolean;
};

type PointerState = PointerPayload & { lastSeen: number };

type LogoState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  colorIndex: number;
};

type LogoStatePayload = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  colorIndex: number;
};

type CheerPayload = {
  x: number;
  drift: number;
  peak: number;
  exit: number;
  duration: number;
  delay: number;
};

type CheerConfig = {
  left: number;
  drift: number;
  peak: number;
  exit: number;
  duration: number;
  delay: number;
};

type CheerInstance = CheerConfig & { id: number };

function buildCheerConfig(
  frameWidth: number,
  frameHeight: number
): CheerConfig | null {
  const width = Math.max(frameWidth, 1);
  const height = Math.max(frameHeight, 1);
  const margin = Math.max(width * 0.08, 40);
  const usableWidth = width - margin * 2;
  if (usableWidth <= 20) return null;

  const left = margin + Math.random() * usableWidth;
  const maxDrift = Math.max(
    Math.min(width * 0.18, left - margin, width - margin - left),
    24
  );
  const drift = (Math.random() * 2 - 1) * maxDrift;
  const peak = -Math.max(height * 0.55, 180);
  const exit = Math.max(height * 0.35, 140);
  const duration = CHEER_DURATION_MS + Math.random() * 180;
  const delay = Math.random() * 160;

  return { left, drift, peak, exit, duration, delay };
}

function randomNickname() {
  const adj =
    NICKNAME_ADJECTIVES[Math.floor(Math.random() * NICKNAME_ADJECTIVES.length)];
  const animal =
    NICKNAME_ANIMALS[Math.floor(Math.random() * NICKNAME_ANIMALS.length)];
  return `${adj} ${animal}`;
}

function randomPointerColor() {
  return POINTER_COLORS[Math.floor(Math.random() * POINTER_COLORS.length)];
}

export function DVDScreenSaver() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const roomRef = useRef<ReturnType<typeof joinRoom> | null>(null);
  const [colorIndex, setColorIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [peerPointers, setPeerPointers] = useState<
    Record<string, PointerState>
  >({});
  const [selfPointer, setSelfPointer] = useState<PointerPayload | null>(null);
  const [leaderId, setLeaderId] = useState<string | null>(null);
  const [logoSnapshot, setLogoSnapshot] = useState<LogoState | null>(null);
  const [cheers, setCheers] = useState<CheerInstance[]>([]);
  const [hasCheered, setHasCheered] = useState(false);
  const isLeader = leaderId === selfId;

  const containerWidth = dimensions.width || BASE_WIDTH;
  const containerHeight = dimensions.height || BASE_HEIGHT;
  const logoWidth = containerWidth * LOGO_WIDTH_RATIO;
  const logoHeight = containerHeight * LOGO_HEIGHT_RATIO;
  const pointerRadius = containerHeight * POINTER_RADIUS_RATIO;
  const logoFontSize = containerHeight * LOGO_FONT_RATIO;

  const selfNickname = useRef(randomNickname());
  const selfColor = useRef(randomPointerColor());
  const sendPointerRef = useRef<ActionSender<PointerPayload> | null>(null);
  const sendLogoStateRef = useRef<ActionSender<LogoState> | null>(null);
  const sendCheerRef = useRef<ActionSender<CheerPayload> | null>(null);
  const peerPointersRef = useRef<Record<string, PointerState>>({});
  const selfPointerRef = useRef<PointerPayload | null>(null);
  const pendingPointerRef = useRef<PointerPayload | null>(null);
  const sendRafRef = useRef<number | null>(null);
  const logoStateRef = useRef<LogoState | null>(null);
  const lastBroadcastRef = useRef(0);
  const leaderHeartbeatRef = useRef<Record<string, number>>({});
  const cheerIdRef = useRef(0);
  const cheerTimeoutRef = useRef<Record<number, number>>({});

  const noteHeartbeat = (id: string) => {
    leaderHeartbeatRef.current[id] = Date.now();
  };

  const electLeader = () => {
    const now = Date.now();
    const activeLeaders = Object.entries(leaderHeartbeatRef.current)
      .filter(([, ts]) => now - ts <= LEADER_HEARTBEAT_MS)
      .map(([id]) => id);

    if (activeLeaders.length === 0) {
      return selfId;
    }

    activeLeaders.sort();
    return activeLeaders[0];
  };

  const pushCheer = (
    config: CheerConfig,
    broadcastFrame?: { width: number; height: number }
  ) => {
    setHasCheered(true);
    const cheer: CheerInstance = { id: ++cheerIdRef.current, ...config };
    setCheers((prev) => [...prev, cheer]);
    const timeout = window.setTimeout(() => {
      setCheers((prev) => prev.filter((item) => item.id !== cheer.id));
      delete cheerTimeoutRef.current[cheer.id];
    }, cheer.duration + cheer.delay);
    cheerTimeoutRef.current[cheer.id] = timeout;

    if (broadcastFrame && sendCheerRef.current) {
      const { width, height } = broadcastFrame;
      if (width > 0 && height > 0) {
        sendCheerRef.current({
          x: cheer.left / width,
          drift: cheer.drift / width,
          peak: cheer.peak / height,
          exit: cheer.exit / height,
          duration: cheer.duration,
          delay: cheer.delay,
        });
      }
    }
  };

  const spawnCheer = (config: CheerConfig, broadcastFrame?: boolean) => {
    const { width, height } = getFrameSize();
    const normalizedFrame =
      broadcastFrame && width > 0 && height > 0
        ? { width, height }
        : undefined;
    pushCheer(config, normalizedFrame);
  };

  const spawnCheerFromFrame = (
    frameWidth: number,
    frameHeight: number,
    broadcast: boolean
  ) => {
    const config = buildCheerConfig(frameWidth, frameHeight);
    if (!config) return;
    spawnCheer(config, broadcast);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const getFrameSize = useCallback(() => {
    const container = containerRef.current;
    const rect = container?.getBoundingClientRect();
    return {
      width: rect?.width || containerWidth,
      height: rect?.height || containerHeight,
    };
  }, [containerHeight, containerWidth]);

  const toPayload = (
    state: LogoState,
    frameWidth: number,
    frameHeight: number
  ): LogoStatePayload => ({
    x: frameWidth ? state.x / frameWidth : 0,
    y: frameHeight ? state.y / frameHeight : 0,
    // Normalize velocity by height so speed scales with frame height.
    vx: frameHeight ? state.vx / frameHeight : 0,
    vy: frameHeight ? state.vy / frameHeight : 0,
    colorIndex: state.colorIndex,
  });

  const fromPayload = (
    payload: LogoStatePayload,
    frameWidth: number,
    frameHeight: number
  ): LogoState => ({
    x: payload.x * frameWidth,
    y: payload.y * frameHeight,
    vx: payload.vx * frameHeight,
    vy: payload.vy * frameHeight,
    colorIndex: payload.colorIndex,
  });

  useEffect(() => {
    const room = joinRoom(
      {
        appId: "dvd-pointer-playground",
      },
      "dvd-room"
    );
    roomRef.current = room;
    const [sendPointer, onPointer] = room.makeAction<PointerPayload>("pointer");
    const [sendLogoState, onLogoState] =
      room.makeAction<LogoStatePayload>("logo-state");
    const [sendCheer, onCheer] = room.makeAction<CheerPayload>("cheer");
    sendPointerRef.current = sendPointer;
    sendLogoStateRef.current = sendLogoState;
    sendCheerRef.current = sendCheer;

    const refreshLeader = () => {
      const peerIds = Object.keys(room.getPeers());
      peerIds.push(selfId);
      peerIds.sort();
      const nextLeader = peerIds[0] ?? selfId;
      setLeaderId(nextLeader);
    };
    refreshLeader();

    onPointer((data, peerId) => {
      if (!data.active) {
        peerPointersRef.current = Object.fromEntries(
          Object.entries(peerPointersRef.current).filter(
            ([id]) => id !== peerId
          )
        );
        setPeerPointers((prev) => {
          const next = { ...prev };
          delete next[peerId];
          return next;
        });
        return;
      }

      const nextPointer: PointerState = {
        ...data,
        lastSeen: Date.now(),
      };

      peerPointersRef.current = {
        ...peerPointersRef.current,
        [peerId]: nextPointer,
      };

      setPeerPointers((prev) => ({
        ...prev,
        [peerId]: nextPointer,
      }));
    });

    onLogoState((state, senderId) => {
      const from = senderId ?? selfId;
      noteHeartbeat(from);
      setLeaderId((prev) => {
        const next = electLeader();
        return prev === next ? prev : next;
      });
      const { width: frameWidth, height: frameHeight } = getFrameSize();
      const scaled = fromPayload(state, frameWidth, frameHeight);
      logoStateRef.current = scaled;
      setLogoSnapshot(scaled);
      setColorIndex(scaled.colorIndex);
    });

    onCheer((payload) => {
      const { width, height } = getFrameSize();
      spawnCheer(
        {
          left: payload.x * width,
          drift: payload.drift * width,
          peak: payload.peak * height,
          exit: payload.exit * height,
          duration: payload.duration,
          delay: payload.delay,
        },
        false
      );
    });

    room.onPeerJoin(() => {
      refreshLeader();
    });

    room.onPeerLeave((peerId) => {
      peerPointersRef.current = Object.fromEntries(
        Object.entries(peerPointersRef.current).filter(([id]) => id !== peerId)
      );
      delete leaderHeartbeatRef.current[peerId];
      setPeerPointers((prev) => {
        const next = { ...prev };
        delete next[peerId];
        return next;
      });
      refreshLeader();
    });

    const expiry = setInterval(() => {
      const now = Date.now();
      setPeerPointers((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const [peerId, pointer] of Object.entries(prev)) {
          if (now - pointer.lastSeen > 8000) {
            delete next[peerId];
            changed = true;
          }
        }
        if (changed) {
          peerPointersRef.current = next;
          return next;
        }
        return prev;
      });
    }, 4000);

    return () => {
      clearInterval(expiry);
      room.leave();
      sendPointerRef.current = null;
      sendLogoStateRef.current = null;
      sendCheerRef.current = null;
      roomRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const watcher = setInterval(() => {
      setLeaderId((prev) => {
        const next = electLeader();
        return prev === next ? prev : next;
      });
    }, LEADER_CHECK_MS);

    return () => clearInterval(watcher);
  }, []);

  useEffect(() => {
    if (!isLeader) return;
    const container = containerRef.current;
    const logo = logoRef.current;
    if (!container || !logo) return;

    const rect = container.getBoundingClientRect();
    const rectWidth = rect.width || containerWidth;
    const rectHeight = rect.height || containerHeight;
    const speed = rectHeight * SPEED_PER_HEIGHT;
    const diagonal = speed / Math.sqrt(2);
    const measuredLogoWidth = rectWidth * LOGO_WIDTH_RATIO;
    const measuredLogoHeight = rectHeight * LOGO_HEIGHT_RATIO;
    const directions = [
      { vx: diagonal, vy: diagonal },
      { vx: diagonal, vy: -diagonal },
      { vx: -diagonal, vy: diagonal },
      { vx: -diagonal, vy: -diagonal },
    ];
    const previous = logoStateRef.current;
    const direction =
      previous && (previous.vx !== 0 || previous.vy !== 0)
        ? previous
        : directions[Math.floor(Math.random() * directions.length)];
    const directionLength = Math.max(
      Math.hypot(direction.vx, direction.vy),
      0.001
    );
    const scaledDirection = {
      vx: (direction.vx / directionLength) * speed,
      vy: (direction.vy / directionLength) * speed,
    };
    const startingState: LogoState = previous
      ? {
          ...previous,
          x: Math.min(
            Math.max(previous.x, 0),
            Math.max(rectWidth - measuredLogoWidth, 0)
          ),
          y: Math.min(
            Math.max(previous.y, 0),
            Math.max(rectHeight - measuredLogoHeight, 0)
          ),
          vx: scaledDirection.vx,
          vy: scaledDirection.vy,
        }
      : {
          x: Math.random() * Math.max(rectWidth - measuredLogoWidth, 0),
          y: Math.random() * Math.max(rectHeight - measuredLogoHeight, 0),
          vx: scaledDirection.vx,
          vy: scaledDirection.vy,
          colorIndex: 0,
        };

    let state = startingState;
    logoStateRef.current = state;
    noteHeartbeat(selfId);

    let last = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const delta = Math.max((now - last) / 1000, 0.001);
      last = now;

      const bounds = container.getBoundingClientRect();
      const frameWidth = bounds.width || containerWidth;
      const frameHeight = bounds.height || containerHeight;
      const dynamicLogoWidth = Math.max(frameWidth * LOGO_WIDTH_RATIO, 16);
      const dynamicLogoHeight = Math.max(frameHeight * LOGO_HEIGHT_RATIO, 16);
      const dynamicPointerRadius = Math.max(
        frameHeight * POINTER_RADIUS_RATIO,
        6
      );
      const desiredSpeed = Math.max(frameHeight * SPEED_PER_HEIGHT, 30);
      const currentSpeed = Math.hypot(state.vx, state.vy);
      if (currentSpeed) {
        const scale = desiredSpeed / currentSpeed;
        state = {
          ...state,
          vx: state.vx * scale,
          vy: state.vy * scale,
        };
      }

      state = {
        ...state,
        x: state.x + state.vx * delta,
        y: state.y + state.vy * delta,
      };

      let bouncedByWall = false;
      let bouncedX = false;
      let bouncedY = false;

      const pointers: { x: number; y: number }[] = [];
      const pushPointer = (pointer: PointerPayload | PointerState | null) => {
        if (!pointer || !pointer.active) return;
        pointers.push({
          x: pointer.x * frameWidth,
          y: pointer.y * frameHeight,
        });
      };

      pushPointer(selfPointerRef.current);
      Object.values(peerPointersRef.current).forEach(pushPointer);

      for (const pointer of pointers) {
        const rectLeft = state.x;
        const rectTop = state.y;
        const rectRight = rectLeft + dynamicLogoWidth;
        const rectBottom = rectTop + dynamicLogoHeight;

        const closestX = Math.max(rectLeft, Math.min(pointer.x, rectRight));
        const closestY = Math.max(rectTop, Math.min(pointer.y, rectBottom));
        const dx = pointer.x - closestX;
        const dy = pointer.y - closestY;
        const distSq = dx * dx + dy * dy;

        if (distSq <= dynamicPointerRadius * dynamicPointerRadius) {
          let nx = dx;
          let ny = dy;
          if (nx === 0 && ny === 0) {
            nx = pointer.x - (rectLeft + dynamicLogoWidth / 2);
            ny = pointer.y - (rectTop + dynamicLogoHeight / 2);
          }
          if (nx === 0 && ny === 0) {
            nx = 1;
            ny = 0;
          }

          const len = Math.max(Math.hypot(nx, ny), 0.001);
          nx /= len;
          ny /= len;

          const dot = state.vx * nx + state.vy * ny;
          state = {
            ...state,
            vx: state.vx - 2 * dot * nx,
            vy: state.vy - 2 * dot * ny,
          };

          const dist = Math.max(Math.sqrt(distSq), 0.001);
          const penetration = dynamicPointerRadius - dist;
          if (penetration > 0) {
            // Push the logo away from the pointer (opposite of the outward normal) with a buffer.
            const escape = penetration + 2;
            state = {
              ...state,
              x: state.x - nx * escape,
              y: state.y - ny * escape,
            };
            state = {
              ...state,
              x: Math.min(Math.max(state.x, 0), frameWidth - dynamicLogoWidth),
              y: Math.min(
                Math.max(state.y, 0),
                frameHeight - dynamicLogoHeight
              ),
            };

            const newLeft = state.x;
            const newTop = state.y;
            const newClosestX = Math.max(
              newLeft,
              Math.min(pointer.x, newLeft + dynamicLogoWidth)
            );
            const newClosestY = Math.max(
              newTop,
              Math.min(pointer.y, newTop + dynamicLogoHeight)
            );
            const ndx = pointer.x - newClosestX;
            const ndy = pointer.y - newClosestY;
            const newDist = Math.hypot(ndx, ndy);
            if (newDist < dynamicPointerRadius) {
              const extra = dynamicPointerRadius - newDist + 2;
              state = {
                ...state,
                x: Math.min(
                  Math.max(state.x - nx * extra, 0),
                  frameWidth - dynamicLogoWidth
                ),
                y: Math.min(
                  Math.max(state.y - ny * extra, 0),
                  frameHeight - dynamicLogoHeight
                ),
              };
            }
          }
        }
      }

      if (state.x <= 0) {
        state = { ...state, x: 0, vx: Math.abs(state.vx) };
        bouncedByWall = true;
        bouncedX = true;
      } else if (state.x + dynamicLogoWidth >= frameWidth) {
        state = {
          ...state,
          x: frameWidth - dynamicLogoWidth,
          vx: -Math.abs(state.vx),
        };
        bouncedByWall = true;
        bouncedX = true;
      }

      if (state.y <= 0) {
        state = { ...state, y: 0, vy: Math.abs(state.vy) };
        bouncedByWall = true;
        bouncedY = true;
      } else if (state.y + dynamicLogoHeight >= frameHeight) {
        state = {
          ...state,
          y: frameHeight - dynamicLogoHeight,
          vy: -Math.abs(state.vy),
        };
        bouncedByWall = true;
        bouncedY = true;
      }

      logo.style.transform = `translate3d(${state.x.toFixed(
        2
      )}px, ${state.y.toFixed(2)}px, 0)`;

      if (bouncedByWall) {
        state = {
          ...state,
          colorIndex: (state.colorIndex + 1) % COLORS.length,
        };
        setColorIndex(state.colorIndex);
        if (bouncedX && bouncedY) {
          spawnCheerFromFrame(frameWidth, frameHeight, true);
        }
      }

      logoStateRef.current = state;

      if (now - lastBroadcastRef.current > 1000 / 60) {
        lastBroadcastRef.current = now;
        setLogoSnapshot(state);
        setColorIndex(state.colorIndex);
        const sender = sendLogoStateRef.current;
        if (sender) {
          sender(toPayload(state, frameWidth, frameHeight));
          noteHeartbeat(selfId);
        }
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isLeader]); // eslint-disable-line react-hooks/exhaustive-deps

  const queuePointerSend = (payload: PointerPayload) => {
    const sender = sendPointerRef.current;
    if (!sender) return;
    pendingPointerRef.current = payload;
    if (sendRafRef.current !== null) return;
    sendRafRef.current = requestAnimationFrame(() => {
      sendRafRef.current = null;
      const next = pendingPointerRef.current;
      pendingPointerRef.current = null;
      if (next) {
        sender(next);
      }
    });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    const payload: PointerPayload = {
      x: Math.min(Math.max(x, 0), 1),
      y: Math.min(Math.max(y, 0), 1),
      name: selfNickname.current,
      color: selfColor.current,
      active: true,
    };

    selfPointerRef.current = payload;
    setSelfPointer(payload);
    queuePointerSend(payload);
  };

  const handlePointerLeave = () => {
    if (!selfPointerRef.current) return;
    const payload: PointerPayload = {
      ...selfPointerRef.current,
      active: false,
    };
    selfPointerRef.current = null;
    setSelfPointer(null);
    queuePointerSend(payload);
  };

  useEffect(
    () => () => {
      if (sendRafRef.current !== null) {
        cancelAnimationFrame(sendRafRef.current);
      }
    },
    []
  );

  useEffect(
    () => () => {
      Object.values(cheerTimeoutRef.current).forEach((timeoutId) =>
        clearTimeout(timeoutId)
      );
      cheerTimeoutRef.current = {};
    },
    []
  );

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo || !logoSnapshot) return;
    logo.style.transform = `translate3d(${logoSnapshot.x.toFixed(
      2
    )}px, ${logoSnapshot.y.toFixed(2)}px, 0)`;
  }, [logoSnapshot]);

  const renderPointer = (id: string, pointer: PointerPayload) => {
    const posX = pointer.x * containerWidth - pointerRadius;
    const posY = pointer.y * containerHeight - pointerRadius;
    const pointerSize = pointerRadius * 2;

    return (
      <div
        key={id}
        className="pointer-events-none absolute left-0 top-0 flex h-0 w-0 items-center"
        style={{
          transform: `translate3d(${posX}px, ${posY}px, 0)`,
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="block rounded-full border border-white/50 shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
            style={{
              backgroundColor: pointer.color,
              width: pointerSize,
              height: pointerSize,
            }}
          />
          <span
            className="rounded-full bg-black/70 px-2 py-1 font-semibold text-white/90 shadow-md backdrop-blur"
            style={{ fontSize: Math.max(containerHeight * 0.0285, 10) }}
          >
            {pointer.name}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 shadow-[0_30px_120px_rgba(0,0,0,0.5)]"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0,rgba(0,0,0,0)_35%)]" />

        {cheers.map((cheer) => (
          <span
            key={cheer.id}
            className="cheer-label"
            style={
              {
                "--cheer-left": `${cheer.left}px`,
                "--cheer-drift": `${cheer.drift}px`,
                "--cheer-peak": `${cheer.peak}px`,
                "--cheer-exit": `${cheer.exit}px`,
                "--cheer-duration": `${cheer.duration}ms`,
                "--cheer-delay": `${cheer.delay}ms`,
              } as CSSProperties
            }
          >
            YEAH!!!!!!!
          </span>
        ))}

        {selfPointer ? renderPointer("self", selfPointer) : null}
        {Object.entries(peerPointers).map(([peerId, pointer]) =>
          renderPointer(peerId, pointer)
        )}

        <div
          ref={logoRef}
          className="absolute flex items-center justify-center border-2 border-white/60 font-black uppercase tracking-[0.08em] shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
          style={{
            backgroundColor: COLORS[colorIndex],
            color: "#0a0a0a",
            width: logoWidth,
            height: logoHeight,
            fontSize: logoFontSize,
          }}
        >
          DVD
        </div>
      </div>
      <CheerCelebration visible={hasCheered} />
      <style jsx>{`
        .cheer-label {
          position: absolute;
          bottom: -12px;
          left: var(--cheer-left);
          transform: translate3d(-50%, 0, 0);
          color: #fef3c7;
          font-size: clamp(18px, 4vw, 32px);
          font-weight: 900;
          letter-spacing: 0.08em;
          text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5),
            0 0 28px rgba(255, 255, 255, 0.28);
          pointer-events: none;
          white-space: nowrap;
          z-index: 5;
          filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.25));
          animation: cheer-flight var(--cheer-duration)
            cubic-bezier(0.21, 0.67, 0.32, 1) forwards;
          animation-delay: var(--cheer-delay);
          opacity: 0;
        }

        @keyframes cheer-flight {
          0% {
            transform: translate3d(-50%, 0, 0) scale(0.8);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          45% {
            transform: translate3d(
                calc(-50% + var(--cheer-drift)),
                var(--cheer-peak),
                0
              )
              scale(1);
          }
          80% {
            transform: translate3d(
                calc(-50% + var(--cheer-drift)),
                6px,
                0
              )
              scale(0.98);
            opacity: 1;
          }
          100% {
            transform: translate3d(
                calc(-50% + var(--cheer-drift)),
                var(--cheer-exit),
                0
              )
              scale(0.95);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
