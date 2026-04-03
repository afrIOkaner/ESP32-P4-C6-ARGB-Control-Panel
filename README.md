# ARGB Web Control Panel (ESP32-P4+C6)

A mobile-first, interactive Single Page Application (SPA) designed to manage a custom PC ARGB lighting system. This UI is built to be hosted directly on a highly capable ESP32 microcontroller (specifically the JC-ESP32P4-M3-DEV board with ESP32-C6, 32M PSRAM, and 16M Flash).

## Technical Overview

* **Frontend Framework:** React 19 with TypeScript.
* **Build Tool:** Vite.
* **Styling:** Tailwind CSS (Dark, glassmorphic/neumorphic aesthetic).
* **Icons:** Lucide React.
* **Embedded Optimization:** Uses `vite-plugin-compression` to automatically gzip `.js` and `.css` bundles during the build process.

By serving pre-compressed `.gz` files, the ESP32 drastically reduces the amount of data transmitted over WiFi, making the UI feel snappy and responsive without overloading the microcontroller's network stack.

## Features

* **Live Preview:** Real-time CSS-animated preview of the active lighting effect.
* **Lighting Modes:** Solid, Rainbow, Breathe, and Strobe.
* **Advanced Tuning:**
  * **Strobe:** Target Fan RPM matching (to visually freeze fan blades) and Phase Offset (to make blades crawl forward/backward).
  * **Breathe:** Speed multiplier, minimum brightness, and maximum brightness controls.
  * **Rainbow:** Cycle speed control.
* **Hardware Configuration:** Dynamically add, remove, and configure ARGB channels (Name, GPIO Pin, LED Count).

---

## Backend API Integration Guide

The frontend communicates with the ESP32 via lightweight JSON payloads sent over the Fetch API. To connect this UI to your C++ backend, you need to implement the following REST endpoints on your ESP32 web server.

### 1. Hardware Configuration Endpoint
* **Endpoint:** `POST /api/config`
* **Description:** Fired when the user adds or removes a device in the "Devices" tab. Used to define the physical layout and GPIO routing of the controller.

**Payload Schema:**
```json
{
  "device_id": "esp32_argb_node_01",
  "channels": [
    {
      "channel_id": 1,
      "name": "TEUCER FH-11 Hub",
      "gpio_pin": 16,
      "led_count": 50,
      "color_order": "GRB",
      "is_active": true
    },
    {
      "channel_id": 2,
      "name": "CPU Cooler",
      "gpio_pin": 17,
      "led_count": 24,
      "color_order": "RGB",
      "is_active": false
    }
  ]
}
```

### 2. Active State Endpoint
* **Endpoint:** `POST /api/state`
* **Description:** Fired (and debounced) whenever a user interacts with the control panel (sliders, mode changes, color themes). 
* **Note:** By nesting the specific effect parameters, the C++ firmware only has to parse the block relevant to the `active_mode`.

**Payload Schema:**
```json
{
  "system": {
    "power_on": true,
    "global_brightness": 200, 
    "active_mode": "strobe",
    "active_theme": "cyberpunk"
  },
  "effect_settings": {
    "strobe": {
      "target_rpm": 850,
      "phase_offset_degrees": 2.5,
      "pulse_width_us": 1200,
      "base_color": "#FF0055",
      "flash_color": "#FFFFFF"
    },
    "breathe": {
      "speed_multiplier": 1.5,
      "min_brightness": 50,
      "max_brightness": 100
    },
    "solid": {
      "primary_color": "#00FFCC"
    },
    "rainbow": {
      "speed_multiplier": 1.0
    }
  }
}
```

---

## Development & Deployment

### Local Development
To run the UI locally for development:
```bash
npm install
npm run dev
```
*Note: API calls to `/api/config` and `/api/state` are currently mocked in `src/lib/api.ts` to prevent CORS errors and crashes when running without the ESP32.*

### Building for the ESP32
To generate the optimized, compressed files for your microcontroller:
```bash
npm run build
```
This will output files into the `dist/` directory. You will notice `.gz` versions of your assets. 

### ESP32 Serving Strategy
1. Upload the contents of the `dist/` folder to your ESP32's filesystem (SPIFFS or LittleFS).
2. Configure your ESP32 Async Web Server to serve static files.
3. Ensure your web server sets the `Content-Encoding: gzip` header when serving `.gz` files so the browser knows to decompress them natively.

Example (ESPAsyncWebServer):
```cpp
server.serveStatic("/", LittleFS, "/").setDefaultFile("index.html");

// Example of handling the gzip header manually if your library doesn't auto-detect:
server.on("/assets/index.js", HTTP_GET, [](AsyncWebServerRequest *request){
    AsyncWebServerResponse *response = request->beginResponse(LittleFS, "/assets/index.js.gz", "text/javascript");
    response->addHeader("Content-Encoding", "gzip");
    request->send(response);
});
```
