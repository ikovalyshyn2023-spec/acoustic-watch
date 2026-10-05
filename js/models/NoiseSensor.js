import { NoiseMeasurement } from "./NoiseMeasurement.js";

export const NOISE_LIMITS = Object.freeze({
  normalMax: 55,
  warningMax: 70,
});

export class NoiseSensor {
  constructor(id, district, location, noiseLevel = 0) {
    this.id = id;
    this.district = district;
    this.location = location;
    this.noiseLevel = noiseLevel;
    this.measurements = [];
  }

  // ----- static методи -----
  static isValidNoiseLevel(value) {
    return Number.isFinite(value) && value >= 0 && value <= 200;
  }

  static fromObject(data) {
    if (!data?.id || !data?.district) {
      throw new Error("Недостатньо даних для створення NoiseSensor");
    }
    return new NoiseSensor(
      data.id,
      data.district,
      data.location || "",
      data.noiseLevel ?? 0
    );
  }

  // ----- методи екземпляра -----
  getStatus() {
    if (this.noiseLevel <= NOISE_LIMITS.normalMax) return "normal";
    if (this.noiseLevel <= NOISE_LIMITS.warningMax) return "warning";
    return "critical";
  }

  updateNoiseLevel(value) {
    if (!NoiseSensor.isValidNoiseLevel(value)) {
      throw new Error(`Недопустимий рівень шуму: ${value}`);
    }
    this.noiseLevel = value;
  }

  addMeasurement(measurement) {
    if (!(measurement instanceof NoiseMeasurement)) {
      throw new Error("Очікується об'єкт NoiseMeasurement");
    }
    this.measurements.push(measurement);
    this.noiseLevel = measurement.value;
  }
}

// ----- приклад наслідування -----
export class MobileNoiseSensor extends NoiseSensor {
  constructor(id, district, location, noiseLevel, batteryLevel = 100) {
    super(id, district, location, noiseLevel);
    this.batteryLevel = batteryLevel;
  }

  needsCharging() {
    return this.batteryLevel < 20;
  }
}
