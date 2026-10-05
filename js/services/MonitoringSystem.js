import { NoiseSensor } from "../models/NoiseSensor.js";

export class MonitoringSystem {
  constructor() {
    this.sensors = [];
  }

  addSensor(sensor) {
    if (!(sensor instanceof NoiseSensor)) {
      throw new Error("Можна додавати лише об'єкти NoiseSensor");
    }
    const exists = this.sensors.some((s) => s.id === sensor.id);
    if (exists) {
      throw new Error(`Датчик ${sensor.id} вже існує`);
    }
    this.sensors.push(sensor);
  }

  findSensorById(id) {
    return this.sensors.find((s) => s.id === id) || null;
  }

  getSensorsByDistrict(district) {
    return this.sensors.filter((s) => s.district === district);
  }

  getCriticalSensors() {
    return this.sensors.filter((s) => s.getStatus() === "critical");
  }

  getAverageNoiseLevel() {
    if (this.sensors.length === 0) return 0;
    const sum = this.sensors.reduce((acc, s) => acc + s.noiseLevel, 0);
    return Number((sum / this.sensors.length).toFixed(2));
  }
}
