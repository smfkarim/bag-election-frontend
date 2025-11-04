"use client";

import { Group, PinInput, type PinInputProps } from "@mantine/core";
import { useEffect, useRef } from "react";

export function DualPinInput({
  pin1,
  pin2,
  onChange,
  onComplete,
}: {
  pin1: string;
  pin2: string;
  onChange?: (p1: string, p2: string) => void;
  onComplete?: (full: string) => void;
}) {
  const pin1WrapRef = useRef<HTMLDivElement | null>(null);
  const pin2WrapRef = useRef<HTMLDivElement | null>(null);

  // Move focus forward automatically after first 3 digits
  useEffect(() => {
    if (pin1.length === 3) {
      setTimeout(() => {
        const firstInputPin2 = pin2WrapRef.current?.querySelector("input");
        firstInputPin2?.focus();
      }, 0);
    }
  }, [pin1]);

  // Fire complete when both filled
  useEffect(() => {
    if (pin1.length === 3 && pin2.length === 3) {
      onComplete?.(pin1 + pin2);
    }
  }, [pin1, pin2, onComplete]);

  // Track Backspace on the **first** input of Pin2 to go back to last of Pin1
  useEffect(() => {
    const firstInputPin2 = pin2WrapRef.current?.querySelector("input");
    if (!firstInputPin2) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Backspace" && pin2.length === 0) {
        setTimeout(() => {
          const pin1Inputs = pin1WrapRef.current?.querySelectorAll("input");
          const lastPin1 = pin1Inputs?.[pin1Inputs.length - 1] as
            | HTMLInputElement
            | undefined;
          lastPin1?.focus();
        }, 0);
      }
    };

    firstInputPin2.addEventListener("keydown", handler);
    return () => firstInputPin2.removeEventListener("keydown", handler);
  }, [pin2]);

  const onChange1: PinInputProps["onChange"] = (v) => onChange?.(v, pin2);
  const onChange2: PinInputProps["onChange"] = (v) => onChange?.(pin1, v);

  return (
    <Group>
      <div ref={pin1WrapRef}>
        <PinInput length={3} type="number" value={pin1} onChange={onChange1} />
      </div>
      <div ref={pin2WrapRef}>
        <PinInput length={3} type="number" value={pin2} onChange={onChange2} />
      </div>
    </Group>
  );
}
