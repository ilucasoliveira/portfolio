export const RUNE_COUNT = 18;
export const HELIX = { from: -90, to: 450, step: 30 };

const MIN_GAP = 14;
const MAX_GAP = 26;
const EDGE_MARGIN = 16;
const SIDE_OFFSET = 34;
const ROW_TOLERANCE = 4;
const ZIGZAG_STEP = 110;

export function docRect(el) {
  let left = 0;
  let top = 0;
  let node = el;

  while (node) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent;
  }

  const width = el.offsetWidth;
  const height = el.offsetHeight;

  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    cx: left + width / 2,
    cy: top + height / 2,
  };
}

function anchor(name) {
  return document.querySelector(`[data-serpent="${name}"]`);
}

function rectOf(name) {
  const el = anchor(name);
  return el ? docRect(el) : null;
}

export function toPathData(points) {
  let d = `M${points[0][0]},${points[0][1]}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }

  return d;
}

function groupRows(rects) {
  const rows = [];

  for (const rect of rects) {
    const row = rows.find((r) => Math.abs(r[0].top - rect.top) < ROW_TOLERANCE);
    if (row) row.push(rect);
    else rows.push([rect]);
  }

  return rows;
}

function gapX(a, b) {
  return (a.right + b.left) / 2;
}

function ellipsePoints(center, rx, ry, from, to, step) {
  const points = [];
  for (let a = from; a <= to; a += step) {
    const angle = (a * Math.PI) / 180;
    points.push([
      center.cx + Math.cos(angle) * rx,
      center.cy + Math.sin(angle) * ry,
    ]);
  }
  return points;
}

function photoHelix(photo) {
  const rx = photo.width * 0.65;
  const ry = Math.min(photo.width * 0.16, 60);
  const points = [];

  for (let a = HELIX.from; a <= HELIX.to; a += HELIX.step) {
    const angle = (a * Math.PI) / 180;
    const progress = (a - HELIX.from) / (HELIX.to - HELIX.from);
    points.push([
      photo.cx + Math.cos(angle) * rx,
      photo.top + photo.height * (0.15 + progress * 0.7) + Math.sin(angle) * ry,
    ]);
  }

  return { points, rx };
}

function projectsPoints(featured, grid) {
  if (!featured) return [];
  const rightX = featured.right + SIDE_OFFSET;
  const leftX = featured.left - SIDE_OFFSET;
  const points = [
    [rightX, featured.top + 40],
    [rightX, featured.bottom - 60],
    [featured.left + featured.width * 0.65, featured.bottom + 1],
    [leftX, featured.bottom + 40],
  ];
  if (grid) points.push([leftX, grid.bottom + 10]);
  return points;
}

function journeyPoints(cv, journey) {
  if (!cv || !journey) return [];
  const loop = ellipsePoints(
    cv,
    cv.width / 2 + 30,
    cv.height / 2 + 26,
    180,
    720,
    45,
  );
  const rightX = journey.right + SIDE_OFFSET;
  return [
    [journey.cx, cv.top - 70],
    ...loop,
    [rightX, cv.bottom + 70],
    [rightX, journey.bottom - 40],
  ];
}

function stackPoints(categories) {
  const points = [];

  groupRows(categories).forEach((row, index) => {
    const top = row[0].top;
    const height = Math.max(...row.map((c) => c.height));

    if (row.length >= 2) {
      const first = gapX(row[0], row[1]);
      const last = gapX(row[row.length - 2], row[row.length - 1]);
      const [startX, endX] = index % 2 === 0 ? [first, last] : [last, first];

      points.push(
        [startX, top - 30],
        [startX, top + height * 0.35],
        [endX, top + height * 0.5],
        [endX, top + height + 30],
      );
      return;
    }

    const col = row[0];
    const steps = Math.max(2, Math.round(col.height / ZIGZAG_STEP));

    for (let s = 0; s <= steps; s++) {
      const x = s % 2 === 0 ? col.left - 18 : col.right + 18;
      points.push([x, col.top + (col.height * s) / steps]);
    }
  });

  return points;
}

export function collectGeometry() {
  const vh = window.innerHeight;
  const docWidth = document.documentElement.clientWidth;
  const hero = document.getElementById("hero");
  const photoEl = anchor("photo");
  const endEl = anchor("end");

  if (!hero || !photoEl || !endEl) return null;

  const heroRect = docRect(hero);
  const portal = heroRect.height > vh * 1.5;
  const start = {
    x: heroRect.cx,
    y: portal ? heroRect.top + vh * 1.5 : heroRect.bottom - 80,
  };

  const photo = docRect(photoEl);
  const end = docRect(endEl);
  const helix = photoHelix(photo);
  const points = [];
  const zones = [];

  points.push(
    [start.x, start.y],
    [start.x, start.y + 120],
    [photo.cx + helix.rx * 0.3, photo.top - 90],
  );
  const helixFrom = points.length - 1;
  points.push(...helix.points);
  zones.push({ type: "helix", from: helixFrom, to: points.length - 1 });
  points.push([photo.cx + helix.rx + 30, photo.bottom + 80]);

  points.push(...projectsPoints(rectOf("featured"), rectOf("projects")));
  points.push(...journeyPoints(rectOf("cv"), rectOf("journey")));

  const stack = anchor("stack");
  if (stack) points.push(...stackPoints([...stack.children].map(docRect)));

  const info = rectOf("contact-info");
  const form = rectOf("form");

  if (info && form && form.left > info.right) {
    points.push([form.cx, form.top - 80], [form.cx, form.top + 10]);
    const behindFrom = points.length - 1;
    points.push(
      [form.cx, form.top + form.height * 0.3],
      [form.right + SIDE_OFFSET, form.top + form.height * 0.65],
    );
    zones.push({ type: "behind", from: behindFrom, to: points.length - 1 });
    points.push(
      [form.right + SIDE_OFFSET, form.bottom + 10],
      [form.left, end.cy],
    );
  } else {
    points.push([docWidth - EDGE_MARGIN * 2, end.top - 60]);
  }

  points.push([end.right, end.cy], [end.left, end.cy]);

  const clamped = points.map(([x, y]) => [
    Math.min(Math.max(x, EDGE_MARGIN), docWidth - EDGE_MARGIN),
    y,
  ]);

  const gap = Math.min(
    Math.max(end.width / (RUNE_COUNT - 1), MIN_GAP),
    MAX_GAP,
  );

  return {
    points: clamped,
    zones,
    start,
    portal,
    heroTop: heroRect.top,
    gap,
    endEl,
  };
}
