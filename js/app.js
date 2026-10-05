import { NoiseSensor, MobileNoiseSensor } from "./models/NoiseSensor.js";
import { NoiseMeasurement } from "./models/NoiseMeasurement.js";
import { MonitoringSystem } from "./services/MonitoringSystem.js";

// ---------- початкові дані ----------
const sensorsData = [
  { id: "NS-01", district: "Галицький", location: "просп. Свободи", noiseLevel: 58 },
  { id: "NS-02", district: "Франківський", location: "вул. Наукова", noiseLevel: 74 },
  { id: "NS-03", district: "Шевченківський", location: "просп. Чорновола", noiseLevel: 83 },
];

// ---------- створення системи ----------
const system = new MonitoringSystem();

sensorsData.forEach((data) => {
  const sensor = NoiseSensor.fromObject(data);
  system.addSensor(sensor);
});

// Додаємо мобільний датчик (приклад наслідування)
const mobile = new MobileNoiseSensor("NS-M01", "Личаківський", "вул. Зелена", 49, 15);
system.addSensor(mobile);

// ---------- перевірка в консолі ----------
console.log("=== Акустична варта — система класів ===");
console.log("Всі сенсори:", system.sensors);
console.log("Критичні:", system.getCriticalSensors());
console.log("Середній рівень шуму:", system.getAverageNoiseLevel(), "dB");
console.log("Знайти NS-02:", system.findSensorById("NS-02"));
console.log("Сенсори Галицького району:", system.getSensorsByDistrict("Галицький"));

// Приклад додавання вимірювання
const sensor1 = system.findSensorById("NS-01");
if (sensor1) {
  sensor1.addMeasurement(new NoiseMeasurement(62));
  console.log("NS-01 після нового вимірювання:", sensor1.noiseLevel, "→", sensor1.getStatus());
}

console.log("Мобільний датчик потребує зарядки?", mobile.needsCharging());

// ---------- експеримент з prototype ----------
const sA = system.sensors[0];
const sB = system.sensors[1];
console.log("getStatus один і той самий?", sA.getStatus === sB.getStatus); // true
console.log("noiseLevel — власна властивість?", Object.hasOwn(sA, "noiseLevel")); // true
console.log("getStatus — власна властивість?", Object.hasOwn(sA, "getStatus")); // false

// ---------- рендер на сторінку ----------
function renderSensorCard(sensor) {
  const status = sensor.getStatus();
  const batteryInfo =
    sensor instanceof MobileNoiseSensor
      ? `<p><strong>Батарея:</strong> ${sensor.batteryLevel}% ${sensor.needsCharging() ? "⚠️" : ""}</p>`
      : "";

  return `
    <article class="sensor-card ${status}">
      <h3>${sensor.id}</h3>
      <p><strong>Район:</strong> ${sensor.district}</p>
      <p><strong>Адреса:</strong> ${sensor.location}</p>
      <p><strong>Рівень шуму:</strong> ${sensor.noiseLevel} dB</p>
      <p><strong>Статус:</strong> <span class="status-badge">${status}</span></p>
      ${batteryInfo}
    </article>
  `;
}

function renderAllSensors() {
  const container = document.getElementById("sensors-list");
  if (!container) return;

  container.innerHTML = system.sensors.map((s) => renderSensorCard(s)).join("");
}

function renderStats() {
  const stats = document.getElementById("stats");
  if (!stats) return;

  const critical = system.getCriticalSensors().length;
  const avg = system.getAverageNoiseLevel();

  stats.innerHTML = `
    <div class="stat-card">
      <span class="stat-value">${system.sensors.length}</span>
      <span class="stat-label">Датчиків</span>
    </div>
    <div class="stat-card critical">
      <span class="stat-value">${critical}</span>
      <span class="stat-label">Критичних</span>
    </div>
    <div class="stat-card">
      <span class="stat-value">${avg}</span>
      <span class="stat-label">Середній dB</span>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderAllSensors();
  renderStats();
});
