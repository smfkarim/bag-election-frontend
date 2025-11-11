// types/device.ts
export interface Device {
  id?: number;
  code?: string;
  uuid?: string;

  hostname: string;
  ipAddress?: string;
  localIps?: string[];
  macAddress?: string;
  firebaseId?: string;
  operatingSystem?: string;
  osVersion?: string;
  browser?: string;
  browserVersion?: string;
  deviceType?: string;
  gpu?: string | null;
  timezone?: string;
  language?: string;
  screenWidth?: number;
  screenHeight?: number;
  hardwareConcurrency?: number;
  geo?: any;
  reverseHost?: string | null;
  status?: string;
  remarks?: string;
  metadata?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
