import type { PropsWithChildren } from "react";

export default function PaperWrapper(props: PropsWithChildren) {
  return (
    <div className="shadow-2xl shadow-green-800 p-10 rounded-lg">
      {props.children}
    </div>
  );
}
