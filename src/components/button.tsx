// common
import { onMouseDown, onMouseOut, onMouseUp } from "@/libs/common";

const defaultButton = {
  color: "main",
  height: 3,
  marginTop: 0,
  marginBottom: 0,
  mouseScale: 0.9,
};

interface Button {
  children: React.ReactNode;
  color?: string;
  height?: number;
  marginTop?: number;
  marginBottom?: number;
  mouseScale?: number;
}

export default function Button({
  children,
  color = defaultButton.color,
  height = defaultButton.height,
  marginTop = defaultButton.marginTop,
  marginBottom = defaultButton.marginBottom,
  mouseScale = defaultButton.mouseScale,
}: Button) {
  return (
    <div
      style={{
        height: height + "rem",
        marginTop: marginTop + "rem",
        marginBottom: marginBottom + "rem",
      }}
      onMouseDown={(e) => onMouseDown(e, mouseScale, true)}
      onMouseUp={onMouseUp}
      onMouseOut={onMouseOut}
      className={`${
        color === "main"
          ? "bg-h-1 dark:bg-f-8  hover:bg-h-0 hover:dark:bg-f-9 text-white dark:text-d-2"
          : color === "red"
          ? "bg-h-r hover:bg-h-r-h text-white"
          : color === "light"
          ? "bg-l-f dark:bg-d-3 hover:bg-l-e hover:dark:bg-d-4 text-l-2 dark:text-white"
          : "bg-l-e dark:bg-d-4 hover:bg-l-d hover:dark:bg-d-6 text-l-2 dark:text-white"
      } w-full flex justify-center items-center rounded-lg selection:bg-transparent`}
    >
      {children}
    </div>
  );
}
