// Gemini 3 Pro Preview API Integration for Google DeepMind Hackathon
import { GoogleGenAI } from "@google/genai";

let scene, camera, renderer, globe, clouds, stars, controls, raycaster, mouse;
let dataMarkers = new THREE.Group();
let currentPage = 'home';
let apiKey = "";

// Expose globals for HTML access
window.switchPage = switchPage;
window.changePlanet = changePlanet;
window.showEdContent = showEdContent;

const planetData = {
    earth: { tex: 'earth_atmos_2048.jpg', size: 5, atmos: true, color: 0x2f81f7 },
    mars: { tex: 'mars_1k_color.jpg', size: 3.5, atmos: true, color: 0xe27b58 },
    jupiter: { tex: 'jupiter.jpg', size: 7, atmos: false, color: 0xd39c7e }
};

function init() {
    // ... (rest of init same)
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 5, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    createGlobe('earth');
    createStars();
    scene.add(dataMarkers);

    window.addEventListener('resize', onResize);
    window.addEventListener('click', onClick);

    let prog = 0;
    const interval = setInterval(() => {
        prog += 5;
        const bar = document.getElementById('loadProgress');
        if (bar) bar.style.width = prog + '%';
        if (prog >= 100) {
            clearInterval(interval);
            const loadEl = document.getElementById('loading');
            if (loadEl) {
                loadEl.style.opacity = '0';
                setTimeout(() => loadEl.remove(), 500);
            }
        }
    }, 50);

    animate();
}

// ... (rest of code) ...

// --- GEMINI 3 FLASH PREVIEW INTEGRATION (DEFAULT) ---
async function fetchAIResponse(query) {
    if (!apiKey) return "Error: API Key Missing";

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await model.generateContent(query);
        const response = await result.response;
        const text = response.text();

        return text || "No response text.";
    } catch (e) {
        console.error("Gemini SDK Error:", e);
        return "AI Offline or Model Error.";
    }
}

// ... (rest of functions) ...

function createGlobe(key) {
    if (globe) scene.remove(globe);
    if (clouds) scene.remove(clouds);
    dataMarkers.clear();

    const p = planetData[key];
    const geometry = new THREE.SphereGeometry(p.size, 128, 128);
    const loader = new THREE.TextureLoader();
    const texture = loader.load(`https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/${p.tex}`);

    globe = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ map: texture, shininess: 10 }));
    scene.add(globe);

    if (p.atmos) {
        const cloudGeo = new THREE.SphereGeometry(p.size * 1.02, 128, 128);
        const cloudTex = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png');
        clouds = new THREE.Mesh(cloudGeo, new THREE.MeshPhongMaterial({ map: cloudTex, transparent: true, opacity: 0.3 }));
        scene.add(clouds);
    }
}

// Ensure init is called
window.onload = init;

// --- LEAFLET MAP LOGIC ---
let map, mapLayer;
function initMap() {
    if (map) return;
    map = L.map('flat-map', {
        center: [20, 0],
        zoom: 3,
        zoomControl: false,
        attributionControl: false,
        maxZoom: 22 // Allow ultra zoom
    });

    // 1. Google Satellite (Ultra High Res)
    const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 22, // Allow zooming in very deep
        maxNativeZoom: 20, // Tiles exist up to 20, zoom 21-22 will stretch
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'Google'
    });

    // 2. Esri World Imagery (High Res Backup)
    const esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 22,
        maxNativeZoom: 19, // Prevent "Image not available" by stretching tiles after zoom 19
        attribution: 'Esri'
    });

    // 3. OpenStreetMap (Standard Map)
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    });

    // 4. Esri Hybrid (Satellite + OSM Labels) - The "Open Street Satellite"
    const esriBase = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    const osmLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    });

    const esriHybrid = L.layerGroup([esriBase, osmLabels]);

    // Default to Esri Hybrid as requested
    esriHybrid.addTo(map);

    // Controls
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Layer Control
    const baseMaps = {
        "Esri Hybrid (OSM Labels)": esriHybrid,
        "Ultra-Res (Google)": googleSat,
        "OpenStreetMap": osmLayer
    };

    L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

    // --- DRAW TOOLS ---
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
        position: 'topright', // Moved to right to avoid sidebar overlap
        edit: { featureGroup: drawnItems },
        draw: {
            polygon: {
                shapeOptions: { color: '#10b981', weight: 2, fillOpacity: 0.2 },
                allowIntersection: false
            },
            rectangle: { shapeOptions: { color: '#10b981', weight: 2, fillOpacity: 0.2 } },
            circle: false, marker: false, circlemarker: false, polyline: false
        }
    });
    map.addControl(drawControl);

    // --- LOCATE ME CONTROL ---
    let currentMarker = null; // Track the active marker to prevent stacking

    const LocateControl = L.Control.extend({
        options: { position: 'topright' }, // Moved to right
        onAdd: function (map) {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            container.innerHTML = '<a href="#" title="Locate Me" role="button" aria-label="Locate Me">⌖</a>';
            container.onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                if ("geolocation" in navigator) {
                    const options = {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    };
                    navigator.geolocation.getCurrentPosition(position => {
                        const { latitude, longitude } = position.coords;
                        map.flyTo([latitude, longitude], 18);

                        // Clear previous marker
                        if (currentMarker) map.removeLayer(currentMarker);

                        // Add new unobtrusive marker
                        currentMarker = L.circleMarker([latitude, longitude], {
                            radius: 6,
                            fillColor: "#3b82f6",
                            color: "#fff",
                            weight: 2,
                            opacity: 0.8,
                            fillOpacity: 0.4 // Transparent so you can see the ground
                        }).addTo(map).bindPopup(`You are here<br><span class="text-[9px] text-slate-500">Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}</span>`).openPopup();

                        analyzeArea(latitude, longitude, L.popup().setLatLng([latitude, longitude]));

                    }, error => {
                        console.warn("High accuracy failed, trying low accuracy...");
                        alert(`Location Error: ${error.message}. Ensure GPS is on.`);
                    }, options);
                } else {
                    alert("Geolocation is not supported by your browser.");
                }
            }
            return container;
        }
    });
    map.addControl(new LocateControl());

    map.on('draw:created', async function (e) {
        const layer = e.layer;
        drawnItems.clearLayers();
        if (currentMarker) map.removeLayer(currentMarker); // Clear point marker if drawing area
        drawnItems.addLayer(layer);

        // precise mapping
        const center = layer.getBounds().getCenter();
        const popup = L.popup()
            .setLatLng(center)
            .setContent('<div class="text-xs font-mono text-slate-800">SCANNING SECTOR...<br>Fetching Elevation & Soil Data</div>')
            .openOn(map);

        await analyzeArea(center.lat, center.lng, popup);
    });

    // Precise mapping handles analysis now.
    // Click-to-scan removed as requested.
}

function switchPage(pageId) {
    currentPage = pageId;

    // Toggle Views
    const canvas = document.querySelector('canvas');
    const flatMap = document.getElementById('flat-map');

    if (pageId === 'agri') {
        initMap(); // Init if not already
        canvas.style.opacity = '0';
        canvas.style.pointerEvents = 'none';
        flatMap.classList.remove('hidden');

        // Need to invalidate size after showing to prevent rendering glitches
        setTimeout(() => map.invalidateSize(), 100);
    } else {
        if (canvas) {
            canvas.style.opacity = '1';
            canvas.style.pointerEvents = 'auto';
        }
        if (flatMap) flatMap.classList.add('hidden');
    }

    // Update UI
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pageEl = document.getElementById(`page-${pageId}`);
    if (pageEl) pageEl.classList.add('active');

    document.querySelectorAll('.nav-icon').forEach(i => i.classList.remove('active'));
    const navEl = document.getElementById(`nav-${pageId}`);
    if (navEl) navEl.classList.add('active');

    // Update 3D Scene based on page
    dataMarkers.clear();

    if (pageId === 'cyber') {
        document.body.style.cursor = 'wait';
        simulateAttacks();
    } else if (pageId === 'climate') {
        initClimateMode();
        document.body.style.cursor = 'crosshair';
    } else {
        document.body.style.cursor = 'crosshair';
    }

    // Move camera slightly for page transition effect (only if 3D is active)
    if (pageId !== 'agri') {
        camera.position.y = pageId === 'home' ? 5 : 0;
        controls.autoRotate = (pageId === 'home');
    }
}

function onClick(e) {
    if (e.target.closest('.interactive')) return;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(globe);
    if (intersects.length > 0) {
        const pt = intersects[0].point;
        const r = globe.geometry.parameters.radius;
        const lat = 90 - (Math.acos(pt.y / r)) * 180 / Math.PI;
        const lon = ((270 + (Math.atan2(pt.x, pt.z)) * 180 / Math.PI) % 360) - 180;

        const latEl = document.getElementById('hudLat');
        const lonEl = document.getElementById('hudLon');
        if (latEl) latEl.innerText = lat.toFixed(2);
        if (lonEl) lonEl.innerText = lon.toFixed(2);

        processLocation(lat, lon);
    }
}

async function processLocation(lat, lon) {
    if (currentPage === 'agri') {
        try {
            const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=uv_index,pm2_5`);
            const data = await res.json();
            const cur = data.current;

            const uvEl = document.getElementById('uvData');
            const soilEl = document.getElementById('soilData');
            const cropEl = document.getElementById('cropName');

            if (uvEl) uvEl.innerText = cur.uv_index.toFixed(1);
            if (soilEl) soilEl.innerText = (40 + Math.random() * 30).toFixed(0) + '%';
            if (cropEl) cropEl.innerText = lat > 40 ? "Hardy Oats" : "Sustainable Soy";
        } catch (e) {
            console.error(e);
        }
        spawnMarker(lat, lon, 0x10b981); // Agri Green
    } else if (currentPage === 'space') {
        spawnMarker(lat, lon, 0x3b82f6); // Space Blue
    } else if (currentPage === 'climate') {
        spawnMarker(lat, lon, 0x39c5bb); // Climate Cyan
        // Add Climate Logic here later
    }
}

function spawnMarker(lat, lon, color) {
    // Keep markers for multi-point visualization if needed, or clear. 
    // Prototype cleared them. keeping consistent.
    if (currentPage !== 'cyber') dataMarkers.clear();

    const r = globe.geometry.parameters.radius;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(r * Math.sin(phi) * Math.cos(theta));
    const z = (r * Math.sin(phi) * Math.sin(theta));
    const y = (r * Math.cos(phi));

    const marker = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.2, 0),
        new THREE.MeshBasicMaterial({ color, wireframe: true })
    );
    marker.position.set(x * 1.05, y * 1.05, z * 1.05);
    dataMarkers.add(marker);
}

// --- CLIMATE LOGIC ---
async function initClimateMode() {
    // Simulate fetching global data
    const points = [
        { lat: 40.71, lon: -74.00, name: "New York" },
        { lat: 51.50, lon: -0.12, name: "London" },
        { lat: 35.67, lon: 139.65, name: "Tokyo" },
        { lat: -33.86, lon: 151.20, name: "Sydney" },
        { lat: 19.07, lon: 72.87, name: "Mumbai" }
    ];

    for (let p of points) {
        try {
            // Using Open-Meteo for real data
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&current_weather=true`);
            const data = await res.json();
            const temp = data.current_weather.temperature;

            // Visual Indicator
            const color = temp > 30 ? 0xff4444 : (temp < 10 ? 0x4444ff : 0x39c5bb);
            spawnMarker(p.lat, p.lon, color);
        } catch (e) {
            console.log("Weather fetch failed", e);
        }
    }
}

// --- EDTECH LOGIC ---
const edContent = {
    space: "Space Tech: Revolutionizing daily life through satellite comms, GPS, and earth observation.",
    agri: "Sustainable Farming: Using NDVI imaging to monitor crop health from orbit.",
    cyber: "Cyber Defense: Protecting critical orbital infrastructure from satellite hacking."
};

function showEdContent(topic) {
    const panels = document.getElementById('edtech-content');
    if (!panels) return;

    // Simple update for now
    panels.innerHTML = `
        <div class="glass-panel p-6 rounded-2xl animate-page border-l-4 border-purple-500">
            <h3 class="text-lg font-bold text-purple-400 mb-2">${topic.toUpperCase()}</h3>
            <p class="text-sm text-slate-300 leading-relaxed">${edContent[topic] || "Select a topic..."}</p>
        </div>
    `;
}

async function analyzeArea(lat, lon, popup) {
    // UI Elements - New Dashboard IDs
    const elElev = document.getElementById('dashElev');
    const elCoords = document.getElementById('dashCoords');
    const elSoil = document.getElementById('dashSoil');
    const elTemp = document.getElementById('dashTemp');
    const elWind = document.getElementById('dashWind');
    const elList = document.getElementById('cropList');

    // Reset UI to loading state
    if (elSoil) {
        elSoil.innerText = "Scanning...";
        elElev.innerText = "--";
        elCoords.innerText = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
        elList.innerHTML = `<div class="text-xs text-emerald-400 text-center py-8 animate-pulse">Initializing Orbital Scan...</div>`;
    }

    // Only proceed if API Key is present
    if (!apiKey) {
        popup.setContent("Error: No API Key.");
        requestAnimationFrame(() => alert("Please add API Key in code!"));
        return;
    }

    // Trigger weather widget if available
    if (window.fetchWeatherForLocation) {
        window.fetchWeatherForLocation(lat, lon, `${lat.toFixed(2)}, ${lon.toFixed(2)}`);
    }

    // 1. Construct the "All-in-One" Prediction Prompt
    const prompt = `
        Act as an expert Agronomist AI. 
        Perform a deep analysis for coordinates: ${lat}, ${lon}.
        
        Return a strictly valid JSON object with:
        {
            "soil_type": "Scientific Name (e.g. Vertisols)",
            "elevation": "Integer (m)",
            "temp_c": "Number",
            "wind_kph": "Number",
            "crops": [
                { "name": "Crop Name", "season": "Season (e.g. Kharif/Rabi)", "match_score": "Integer (0-100)" },
                { "name": "Crop Name", "season": "Season", "match_score": "Integer" },
                { "name": "Crop Name", "season": "Season", "match_score": "Integer" }
            ],
            "analysis_brief": "One short sentence summary."
        }
        Do not include markdown.
    `;

    try {
        // 2. Call Gemini
        const aiResponseText = await fetchAIResponse(prompt);

        // 3. Clean and Parse JSON
        const cleanJson = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanJson);

        // 4. Update Dashboard UI
        if (elElev) elElev.innerText = (data.elevation || 0) + "m";
        if (elSoil) elSoil.innerText = data.soil_type || "Unknown";
        if (elTemp) elTemp.innerText = data.temp_c || 0;
        if (elWind) elWind.innerText = data.wind_kph || 0;

        // Render Crop Cards
        if (elList && data.crops) {
            elList.innerHTML = data.crops.map(c => `
                <div class="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between group hover:bg-white/10 transition-colors">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                            ${c.name.charAt(0)}
                        </div>
                        <div>
                            <div class="text-sm font-bold text-slate-100">${c.name}</div>
                            <div class="text-[9px] text-slate-400 uppercase tracking-wider">${c.season}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-bold text-emerald-400">${c.match_score}%</div>
                        <div class="text-[8px] text-slate-500">MATCH</div>
                    </div>
                </div>
            `).join('');
        }

        // 5. Update Map Popup
        popup.setContent(`
            <div class="text-xs font-mono text-slate-800 text-center">
                <b>ANALYSIS COMPLETE</b><br>
                <div class="text-[9px] text-slate-500 my-1">
                    ${data.analysis_brief}
                </div>
                <div class="bg-emerald-100 text-emerald-800 px-2 py-1 rounded inline-block font-bold">
                    ${data.soil_type}
                </div>
            </div>
        `);

    } catch (e) {
        console.error("AI Analysis Failed", e);
        popup.setContent("Scan Failed. AI Error.");
        if (elList) elList.innerHTML = `<div class="text-xs text-red-400 text-center py-4">Data Uplink Failed</div>`;
    }
}

// (Redundant function removed)

// --- CYBER VISUALS ---
function simulateAttacks() {
    if (currentPage !== 'cyber') return;

    // Attack logic
    const srcLat = (Math.random() - 0.5) * 160;
    const srcLon = (Math.random() - 0.5) * 360;
    const dstLat = (Math.random() - 0.5) * 160;
    const dstLon = (Math.random() - 0.5) * 360;

    // Visuals
    spawnMarker(srcLat, srcLon, 0xf85149); // Source Red
    setTimeout(() => spawnMarker(dstLat, dstLon, 0xffffff), 1000); // Dest White

    drawAttackArc(srcLat, srcLon, dstLat, dstLon);

    // Initial burst, then slow loop
    setTimeout(simulateAttacks, Math.random() * 2000 + 500);
}

function drawAttackArc(lat1, lon1, lat2, lon2) {
    const r = globe.geometry.parameters.radius;

    // Convert to vectors
    const v1 = getVector(lat1, lon1, r);
    const v2 = getVector(lat2, lon2, r);

    // Bezier Curve points
    const mid = v1.clone().add(v2).multiplyScalar(0.5).normalize().multiplyScalar(r * 1.5); // Control point higher

    const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
    const points = curve.getPoints(20);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0xf85149, transparent: true, opacity: 0.6 });
    const line = new THREE.Line(geometry, material);

    dataMarkers.add(line);

    // Animate line removal
    // In a real engine we'd tween this, for now just remove after delay
    setTimeout(() => {
        geometry.dispose();
        material.dispose();
        dataMarkers.remove(line);
    }, 2000);
}

function getVector(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
}


async function askAI(type) {
    const input = document.getElementById(`${type}AIInput`);
    const box = document.getElementById(`${type}AIRes`);
    if (!input || !input.value) return;

    if (box) box.innerText = "Connecting to Gemini 3 Flash AI...";
    const query = input.value;
    input.value = "";

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await model.generateContent(`You are a professional space-tech assistant. Topic: ${query}`);
        const response = await result.response;
        const text = response.text();

        if (text) {
            if (box) box.innerText = text;
        } else {
            if (box) box.innerText = "Error: Invalid API response";
        }
    } catch (e) {
        if (box) box.innerText = "Uplink Error. Check terminal logs.";
    }
}

function changePlanet(k) { createGlobe(k); }

function createStars() {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(5000 * 3);
    const sizes = new Float32Array(5000);

    for (let i = 0; i < 15000; i++) {
        pos[i] = (Math.random() - 0.5) * 1500;
        if (i % 3 === 0) sizes[i / 3] = Math.random();
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
        size: 1,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });

    stars = new THREE.Points(geo, mat);
    scene.add(stars);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.005;

    if (clouds) clouds.rotation.y += 0.0004;
    if (globe) globe.rotation.y += 0.0001;

    // Subtle breathing camera movement
    if (currentPage === 'home') {
        camera.position.y += Math.sin(time) * 0.005;
        camera.position.x += Math.cos(time * 0.5) * 0.005;
    }

    controls.update();
    renderer.render(scene, camera);
}

window.onload = init;
