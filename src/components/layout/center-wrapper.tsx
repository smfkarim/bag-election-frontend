import type { PropsWithChildren } from "react";

export default function CenterWrapper(props: PropsWithChildren) {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col">
      {props.children}
    </div>
  );
}
