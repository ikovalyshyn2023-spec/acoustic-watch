export class NoiseMeasurement {
  constructor(value, measuredAt = new Date()) {
    if (!NoiseMeasurement.isValid(value)) {
      throw new Error(`Некоректне значення шуму: ${value}`);
    }
    this.value = value;
    this.measuredAt = measuredAt;
  }

  static isValid(value) {
    return Number.isFinite(value) && value >= 0 && value <= 200;
  }

  isValid() {
    return NoiseMeasurement.isValid(this.value);
  }

  toString() {
    const time = this.measuredAt.toLocaleTimeString("uk-UA");
    return `${this.value} dB (${time})`;
  }
}
