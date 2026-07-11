# Prototype plan

## Goal

Build a complete vertical slice before designing a custom PCB.

The prototype should prove:

- the product vocabulary;
- Grow Core communication;
- Home Assistant integration;
- direct MQTT integration;
- local fan failsafes;
- the web setup flow;
- firmware flashing;
- isolated Grow Gateway networking.

## Prototype hardware

```text
Grow Gateway
  existing Wi-Fi router

Grow Hub
  existing Home Assistant OS machine

Grow Controller
  ESP32 or XIAO ESP32-S3 Plus
  breadboard
  2–4 four-wire PWM PC fans
  tachometer inputs
  temperature/humidity sensor
  optional OLED
```

## Prototype software

```text
Grow Hub
├── Home Assistant
├── ESPHome Device Builder
├── Grow Core prototype
├── Grow App Web
└── Mosquitto, optional

Grow Controller
└── ESPHome
    ├── native API
    ├── MQTT, optional
    ├── local PWM logic
    └── local failsafes
```

## First vertical slice

1. ESPHome exposes two PWM fan channels.
2. Home Assistant discovers the controller.
3. Grow Core discovers compatible entities.
4. User assigns:
   - fan 1 → exhaust;
   - fan 2 → circulation;
   - SHT sensor → main environment sensor.
5. Grow Core calculates desired fan speeds.
6. Commands are sent through Home Assistant.
7. Controller falls back to a safe speed when communication is lost.
8. Grow App shows temperature, humidity, fan targets, RPM, and controller health.

## Second slice

Add direct MQTT communication:

```text
ESPHome MQTT → Grow Core
```

Requirements:

- stable topic schema;
- controller identity;
- state and health messages;
- commands;
- retained configuration;
- command timeout;
- adapter selection in Grow Core.

## Third slice

Add the GrowRig flasher:

- supported board list;
- prebuilt firmware manifest;
- browser flashing;
- Wi-Fi provisioning;
- registration with Grow Core.

## Suggested firmware repository shape

```text
growrig-firmware/
├── packages/
│   ├── controller-base.yaml
│   ├── fan-channel.yaml
│   └── mqtt-direct.yaml
├── boards/
│   ├── esp32-breadboard-v0.yaml
│   └── xiao-s3-plus-breadboard-v0.yaml
├── components/
│   └── growrig_controller/
├── manifests/
└── docs/
```

## Prototype safety behavior

At minimum:

- output defaults to a known state at boot;
- configurable fallback fan speed;
- maximum and minimum speed;
- startup boost;
- tachometer timeout;
- hub-disconnected indicator;
- emergency temperature rule;
- no pump or heater control in the earliest prototype.

## Exit criteria

The prototype is successful when:

- setup can be completed without editing Home Assistant automations;
- the same controller can be used through HA or direct MQTT;
- fan control continues safely during Hub restart;
- controller state is understandable in the Grow App;
- the installation works fully without internet access.
