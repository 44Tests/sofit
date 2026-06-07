import type { AnimationKey } from "../lib/plans";

type ExerciseFigureProps = {
  anim: AnimationKey;
  label: string;
};

export function ExerciseFigure({ anim, label }: ExerciseFigureProps) {
  if (["pushup", "bridge", "plank", "deadbug", "leglift"].includes(anim)) {
    return <FloorFigure anim={anim} label={label} />;
  }

  return (
    <svg className={`figure figure-${anim}`} viewBox="0 0 140 150" role="img" aria-label={`${label} movement`}>
      <g className="figure-shadow">
        <ellipse cx="70" cy="136" rx="34" ry="5" />
      </g>
      <g className="figure-person">
        <circle className="head" cx="70" cy="28" r="10" />
        <line className="torso" x1="70" y1="40" x2="70" y2="78" />
        <g className="arm-left limb">
          <line x1="70" y1="50" x2="46" y2="73" />
        </g>
        <g className="arm-right limb">
          <line x1="70" y1="50" x2="94" y2="73" />
        </g>
        <g className="leg-left limb">
          <line x1="70" y1="78" x2="51" y2="116" />
        </g>
        <g className="leg-right limb">
          <line x1="70" y1="78" x2="91" y2="116" />
        </g>
      </g>
      {anim === "stepup" ? <path className="step-box" d="M82 117h36v19H82z" /> : null}
      {anim === "row" || anim === "curl" || anim === "press" ? (
        <>
          <circle className="weight weight-left" cx="43" cy="76" r="4" />
          <circle className="weight weight-right" cx="97" cy="76" r="4" />
        </>
      ) : null}
    </svg>
  );
}

function FloorFigure({ anim, label }: ExerciseFigureProps) {
  return (
    <svg className={`figure figure-${anim}`} viewBox="0 0 160 120" role="img" aria-label={`${label} movement`}>
      <g className="figure-shadow">
        <ellipse cx="82" cy="106" rx="52" ry="5" />
      </g>
      <g className="floor-person">
        <circle className="head" cx="44" cy="54" r="9" />
        <line className="floor-body" x1="54" y1="58" x2="112" y2="58" />
        <g className="floor-arm-left limb">
          <line x1="64" y1="61" x2="58" y2="92" />
        </g>
        <g className="floor-arm-right limb">
          <line x1="94" y1="61" x2="100" y2="92" />
        </g>
        <g className="floor-leg-left limb">
          <line x1="110" y1="60" x2="132" y2="92" />
        </g>
        <g className="floor-leg-right limb">
          <line x1="106" y1="60" x2="124" y2="92" />
        </g>
      </g>
      {anim === "bridge" ? <path className="mat-line" d="M35 94h97" /> : null}
    </svg>
  );
}
