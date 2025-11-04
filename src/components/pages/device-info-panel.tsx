// app/components/DeviceInfoPanel.tsx
"use client";

import * as React from "react";
import { useFullDeviceInfo } from "@/hooks/useFullDeviceInfo";

type Props = {
  title?: string;
  onRegister?: (data: any) => void | Promise<void>; // optional; you can wire this up later
  className?: string;
};

export default function DeviceInfoPanel({
  title = "Device Information",
  onRegister,
  className = "",
}: Props) {
  const { device, loading, error } = useFullDeviceInfo();
  const [registering, setRegistering] = React.useState(false);

  const handleRegister = async () => {
    if (!device || registering) return;
    try {
      setRegistering(true);
      if (onRegister) await onRegister(device);
      // else do nothing; user will implement later
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className={`w-full max-w-5xl my-10 mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        <span className="text-xs md:text-sm text-gray-500">
          {loading ? "Collecting…" : device?.hostname || "—"}
        </span>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Status / Errors */}
        {error && (
          <div className="px-4 py-3 bg-red-50 text-red-700 text-sm border-b border-red-100">
            Error: {error}
          </div>
        )}

        {/* Content */}
        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Network */}
          <Section title="Network">
            <Item label="Public IP" value={device?.ipAddress} />
            <Item label="Reverse Host" value={device?.reverseHost} />
            <Item
              label="Local IPs"
              value={
                device?.localIps && device.localIps.length > 0
                  ? device.localIps.join(", ")
                  : undefined
              }
              placeholder="—"
            />
            <Item
              label="MAC Address (server-side only)"
              value={device?.macAddress}
            />
          </Section>

          {/* OS / Browser */}
          <Section title="OS & Browser">
            <Item label="Operating System" value={device?.operatingSystem} />
            <Item label="OS Version" value={device?.osVersion} />
            <Item label="Browser" value={device?.browser} />
            <Item label="Browser Version" value={device?.browserVersion} />
            <Item label="Device Type" value={device?.deviceType} />
          </Section>

          {/* Hardware */}
          <Section title="Hardware">
            <Item label="GPU" value={device?.gpu} />
            <Item
              label="CPU Threads"
              value={safeStr(device?.hardwareConcurrency)}
            />
            <Item
              label="Screen"
              value={
                device?.screenWidth && device?.screenHeight
                  ? `${device.screenWidth} × ${device.screenHeight}`
                  : undefined
              }
            />
          </Section>

          {/* Locale */}
          <Section title="Locale">
            <Item label="Timezone" value={device?.timezone} />
            <Item label="Language" value={device?.language} />
          </Section>

          {/* Server */}
          <Section title="Server (seen by API)">
            <Item label="Server Hostname" value={device?.hostname} />
            {/* You can add more server-side info here if you return it in your /api/device */}
          </Section>

          {/* Raw JSON */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Raw Payload
            </label>
            <pre className="max-h-72 overflow-auto text-xs bg-gray-50 border border-gray-200 rounded-xl p-3">
              {JSON.stringify(device ?? {}, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="flex items-center justify-end gap-3 px-4 md:px-6 py-4 border-t bg-gray-50">
          <button
            type="button"
            disabled={loading || !device}
            onClick={() => {
              navigator.clipboard
                ?.writeText(JSON.stringify(device ?? {}, null, 2))
                .catch(() => {});
            }}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            title="Copy JSON"
          >
            Copy JSON
          </button>

          <button
            type="button"
            disabled={loading || !device || registering}
            onClick={handleRegister}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {registering ? "Registering…" : "Register Device"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI bits ---------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">{title}</h3>
      <dl className="space-y-2">{children}</dl>
    </section>
  );
}

function Item({
  label,
  value,
  placeholder = "Unknown",
}: {
  label: string;
  value?: string | number | null;
  placeholder?: string;
}) {
  const display =
    value === undefined || value === null || value === ""
      ? placeholder
      : String(value);
  return (
    <div className="flex items-start gap-3">
      <dt className="w-36 shrink-0 text-xs font-medium text-gray-500">
        {label}
      </dt>
      <dd className="text-sm text-gray-900 break-words">{display}</dd>
    </div>
  );
}

function safeStr(v: any): string | undefined {
  if (v === undefined || v === null) return undefined;
  try {
    return String(v);
  } catch {
    return undefined;
  }
}
