type WaveDividerProps = {
  className?: string;
  fill?: string;
};

export function WaveDivider({
  className,
  fill = "text-background",
}: WaveDividerProps) {
  return (
    <div aria-hidden="true" className={`${fill} ${className ?? ""}`}>
      <svg
        viewBox="0 0 1440 120"
        className="block h-16 w-full sm:h-20 lg:h-24"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,64 L1440,120 L0,120 Z" />
      </svg>
    </div>
  );
}
