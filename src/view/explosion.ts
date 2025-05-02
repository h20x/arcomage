enum ExplosionSize {
  S,
  M,
  L,
}

enum ParticleType {
  Inc,
  Dec,
}

type ParticleConfig = {
  x: number;
  y: number;
  size: number;
  angle: number;
  dist: number;
  duration: number;
  type: ParticleType;
};

const SETTINGS = [
  {
    dist: 50,
    duration: 600,
    particles: 20,
  },
  {
    dist: 70,
    duration: 750,
    particles: 40,
  },
  {
    dist: 90,
    duration: 900,
    particles: 60,
  },
];

const MIN_SIZE = 3;

export function explosion(
  { x, y }: { x: number; y: number },
  val: number
): void {
  const size = valToSize(val);
  const type = val > 0 ? ParticleType.Inc : ParticleType.Dec;
  const { dist, duration, particles } = SETTINGS[size];
  const step = (2 * Math.PI) / particles;
  let angle = step;
  let i = 0;
  let s = 0;

  while (i < particles) {
    let _dist = dist;
    let _dur = duration;

    if (s == 0) {
      _dist *= 0.25 + Math.random() * 0.25;
      _dur *= 0.75 + Math.random() * 0.25;
    } else if (s == 1) {
      _dist *= 0.5 + Math.random() * 0.25;
      _dur *= 0.6 + Math.random() * 0.25;
    } else if (s == 2) {
      _dist *= 0.5 + Math.random() * 0.25;
      _dur *= 0.35 + Math.random() * 0.35;
    } else if (s == 3) {
      _dist *= 0.75 + Math.random() * 0.25;
      _dur *= 0.25 + Math.random() * 0.25;
    }

    if (angle > 0 && angle < Math.PI) {
      _dist *= 1.5;
    }

    createParticle({
      x,
      y,
      angle,
      type,
      size: s + MIN_SIZE,
      dist: _dist,
      duration: _dur,
    });

    s = ++s % 4;
    angle += step;
    ++i;
  }
}

function valToSize(val: number): ExplosionSize {
  const absVal = Math.abs(val);

  if (absVal > 7) {
    return ExplosionSize.L;
  }

  if (absVal > 3) {
    return ExplosionSize.M;
  }

  return ExplosionSize.S;
}

function createParticle(cfg: ParticleConfig): void {
  const { x, y, size, angle, dist, duration, type } = cfg;
  const dx = dist * Math.cos(angle);
  const dy = dist * Math.sin(angle);
  const p = document.createElement('div');

  p.classList.add('particle');
  p.classList.toggle('particle--dec', type === ParticleType.Dec);
  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${x - size / 2}px;
    top: ${y - size / 2}px;
  `;

  document.body.append(p);

  p.animate([{ transform: `translate(${dx}px, ${dy}px)` }], {
    duration,
    easing: 'ease-out',
  });
  p.animate([{ opacity: 1 }, { opacity: 1, offset: 0.7 }, { opacity: 0 }], {
    duration,
    easing: 'linear',
  }).finished.then(() => p.remove());
}
