type BrandLogoProps = {
  compact?: boolean;
  label?: string;
};

export function BrandLogo({ compact = false, label = "sofit" }: BrandLogoProps) {
  return (
    <div className={compact ? "brand-logo compact" : "brand-logo"}>
      <img src="/sofit_logo.png" alt="" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
