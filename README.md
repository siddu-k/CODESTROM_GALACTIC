# 🌍 Galactic Horizon - Gemini 3 Hackathon Submission

## Project Overview

**Galactic Horizon** is an advanced geospatial intelligence platform powered by Google's **Gemini 3.0 Flash** AI model. The platform combines real-time satellite imagery, interactive 3D Earth visualization, and AI-driven land analysis to provide precision agriculture insights, climate monitoring, and cosmic research capabilities.

---

## 🚀 Gemini 3 Integration - Technical Description

### **Gemini Models Used:**
This application showcases the full spectrum of Google's Gemini model family, with **Gemini 3.0 Flash** as the default and primary model:

1. **Gemini 3.0 Flash (Default)** ⭐ - Latest and most capable model
2. **Gemini 2.0 Flash** - High-performance alternative
3. **Gemini 1.5 Flash** - Fast processing option
4. **Gemini 1.5 Pro** - Advanced reasoning capabilities

### **How Gemini 3 Powers the Platform:**

#### 1. **Geospatial Land Analysis** (Primary Feature)
The core agricultural intelligence module leverages **Gemini 3.0 Flash** to analyze any location on Earth:

- **Input**: User-drawn polygons or clicked coordinates on an interactive map (Leaflet.js)
- **Processing**: Gemini 3 receives latitude/longitude and generates comprehensive agricultural insights
- **Output**: JSON-formatted analysis including:
  - Soil type classification (scientific taxonomy)
  - Climate metrics (temperature, humidity, wind speed)
  - Elevation and topographical data
  - Soil composition (pH, nitrogen, phosphorus, potassium, trace metals)
  - Water requirements and irrigation schedules
  - **AI-powered crop recommendations** with match scores (0-100%)
  - Expert agricultural strategy tailored to the location

**Example Prompt Architecture:**
```javascript
Act as an expert Agronomist and Geographer AI. 
Target Location: "${locationName}" (${lat}, ${lng}).

Return comprehensive JSON analysis with:
- Demographics (population type, primary language)
- Climate (real-time estimates based on coordinates)
- Soil composition (type, pH, nutrients, metals, moisture)
- Water requirements (quantity, schedule, source)
- Crop recommendations (3 best options with match scores)
- Agricultural strategy (expert paragraph)
```

#### 2. **Conversational AI Assistant**
Integrated chat interface powered by Gemini 3:
- Context-aware responses based on current field analysis
- Expert farmer persona for agriculture Q&A
- Real-time insights about selected land parcels
- Markdown-formatted responses for rich text display

#### 3. **Multi-Domain Intelligence**
Gemini 3 also powers:
- **Climate monitoring analysis** (weather pattern insights)
- **Space technology Q&A** (educational content generation)
- **Location intelligence** (reverse geocoding context enrichment)

### **Why Gemini 3 is Central to This Application:**

1. **Multimodal Reasoning**: Gemini 3's advanced reasoning capabilities enable accurate geographic and agricultural analysis from raw coordinates alone, without requiring external soil/climate databases.

2. **Structured Output Generation**: The model consistently produces well-formatted JSON responses with complex nested data structures, enabling seamless UI integration.

3. **Domain Expertise**: Gemini 3 demonstrates expert-level knowledge across:
   - Agronomy and soil science
   - Meteorology and climatology
   - Geographic information systems (GIS)
   - Agricultural economics and crop planning

4. **Low Latency**: Gemini 3.0 Flash provides near-instant responses, enabling real-time interactive mapping experiences.

5. **Model Flexibility**: The dropdown selector allows users to compare performance across Gemini model generations, showcasing the evolution of Google's AI capabilities.

---

## 🎯 Key Features

### **1. Precision Land Mapping**
- Interactive 3D Earth globe (Three.js)
- High-resolution satellite imagery (Google Satellite, Esri)
- Drawing tools (polygons, rectangles) for area selection
- GPS location finder with one-click analysis

### **2. AI-Powered Crop Intelligence**
- Gemini 3-generated crop recommendations
- Match scoring algorithm (0-100% suitability)
- Seasonal planting calendars (Kharif/Rabi seasons)
- Location-specific agricultural strategies

### **3. Real-Time Climate Monitoring**
- Live weather telemetry integration (Open-Meteo API)
- 3D globe visualization with climate markers
- Temperature, wind, and atmospheric pressure data
- Global weather pattern analysis

### **4. Cosmic Research Portal**
- NASA Image Library integration
- Searchable space mission archives
- Educational space technology content

### **5. Solar System Simulation**
- Interactive 3D solar system model
- Orbital mechanics visualization
- Planetary data and statistics

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **AI Model** | Google Gemini 3.0 Flash (primary) + Gemini family |
| **3D Graphics** | Three.js, OrbitControls, WebGL |
| **Mapping** | Leaflet.js, Leaflet.Draw |
| **Satellite Imagery** | Google Satellite Tiles, Esri World Imagery |
| **UI Framework** | Tailwind CSS (Glass Morphism design) |
| **Markdown Rendering** | Marked.js |
| **Icons** | Lucide Icons |
| **Data APIs** | Open-Meteo (weather), BigDataCloud (geocoding), NASA Image API |

---

## 📦 Installation & Setup

### **Prerequisites:**
- Modern web browser (Chrome, Firefox, Edge)
- Google Gemini API Key ([Get Free Key](https://makersuite.google.com/app/apikey))

### **Quick Start:**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/galactic-horizon.git
   cd galactic-horizon
   ```

2. **Open in browser:**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server (recommended):
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

3. **Configure API Key (Optional):**
   - Default key is included for demo purposes
   - To use your own key: Click "Analyze Field" → If quota exceeded, enter your key
   - Keys are stored locally in browser localStorage

4. **Start Exploring:**
   - Landing page: `index.html` (animated 3D intro)
   - Main dashboard: `dashboard.html` (mission control)
   - Agriculture module: `land.html` (primary Gemini 3 feature)

---

## 🎮 Usage Guide

### **Agriculture Analysis Workflow:**

1. **Navigate to Land Analysis:**
   - From dashboard, click "Geospatial Research" module
   - Or directly open `land.html`

2. **Select Gemini Model:**
   - Use the dropdown at top-left to choose your model
   - Default: ✨ Gemini 3.0 Flash (Latest)

3. **Choose Your Location:**
   - **Option A**: Draw a polygon on the map
   - **Option B**: Click the GPS button (⌖) for your current location
   - **Option C**: Navigate to any region and click

4. **Analyze:**
   - Click the green "Analyze Field" button
   - Watch real-time AI processing
   - Review comprehensive agricultural report

5. **Interact with Results:**
   - View soil composition, climate data, and crop recommendations
   - Export report as Markdown
   - Use chat assistant for follow-up questions

---

## 🎥 Demo Video Script (3 minutes)

**[0:00-0:15]** Introduction + Landing Page Animation
- Show 3D Earth zoom intro
- "Welcome to Galactic Horizon powered by Gemini 3"

**[0:15-0:30]** Dashboard Tour
- Quick overview of 4 main modules
- Highlight Geospatial Research

**[0:30-1:30]** Core Feature: Gemini 3 Land Analysis
- Select Gemini 3.0 Flash model
- Draw polygon on map (e.g., farmland in India)
- Click "Analyze Field"
- Show real-time AI processing
- Review generated report:
  - Soil type and nutrients
  - Climate conditions
  - Crop recommendations with scores
  - Agricultural strategy

**[1:30-2:00]** Model Comparison
- Switch between Gemini models (3.0, 2.0, 1.5 Flash, 1.5 Pro)
- Demonstrate different response styles/speeds

**[2:00-2:30]** Chat Assistant
- Ask Gemini 3: "What fertilizer is best for this soil?"
- Show context-aware response

**[2:30-3:00]** Bonus Features + Closing
- Quick glimpse of climate monitoring (3D globe)
- NASA research portal
- Solar system simulation
- Call to action: "Built for Google Gemini 3 Hackathon"

---

## 🏆 Gemini 3 Features Showcased

✅ **Advanced Reasoning**: Geographic + agricultural domain expertise  
✅ **Multimodal Understanding**: Coordinates → Comprehensive analysis  
✅ **Structured Output**: Consistent JSON generation  
✅ **Low Latency**: Near-instant responses with Flash models  
✅ **Contextual Awareness**: Chat maintains conversation context  
✅ **Model Family Flexibility**: User-selectable Gemini versions  
✅ **Complex Prompt Engineering**: Multi-domain expert persona  
✅ **Real-World Application**: Practical agriculture use case  

---

## 📊 Project Structure

```
galactic-horizon/
├── index.html              # Landing page with 3D Earth intro
├── landing.html            # Alternative landing page
├── dashboard.html          # Main mission control hub
├── land.html              # ⭐ PRIMARY FEATURE: Gemini 3 land analysis
├── climate.html            # Climate monitoring module
├── research.html           # NASA cosmic research
├── spaceinfo.html          # Solar system simulation
├── main.js                 # Core 3D engine + Gemini integration
├── style.css               # Global styles
├── README.md               # This file
└── PROXY_SETUP.md          # Deprecated (Xiaomi/OpenRouter removed)
```

---

## 🌟 Unique Innovations

1. **Geographic AI Intelligence**: First-of-its-kind coordinate-based agricultural analysis using pure AI (no external soil databases)

2. **Interactive 3D Mapping**: Seamless integration of Three.js globe with Leaflet 2D maps

3. **Multi-Model Comparison**: Built-in A/B testing of Gemini model family

4. **Glass Morphism UI**: Premium sci-fi aesthetic with backdrop blur effects

5. **Context-Aware Chat**: AI assistant that remembers field analysis data

6. **Real-Time Processing**: Live satellite imagery + instant AI analysis

---

## 🔑 API Key Management

- **Default Key Included**: Demo key with quota limits
- **Custom Keys**: Stored securely in browser localStorage
- **No Server Required**: Pure client-side application
- **Privacy First**: No data sent to third-party servers (except Gemini API)

---

## 🐛 Troubleshooting

**Issue**: "API Key Required" error  
**Solution**: Click the error message, enter your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

**Issue**: Map not loading  
**Solution**: Check internet connection (satellite tiles require network)

**Issue**: Analysis fails  
**Solution**: Try selecting a different Gemini model or verify coordinates are on land (not ocean)

---

## 📝 License

MIT License - Open source for educational and commercial use

---

## 🙏 Acknowledgments

- **Google DeepMind** - Gemini API and model family
- **Three.js Community** - 3D graphics library
- **Leaflet.js** - Open-source mapping library
- **NASA** - Public image archives
- **Open-Meteo** - Free weather API

---

## 📧 Contact & Submission

**Hackathon Track**: Gemini 3 Global Hackathon  
**Category**: Agriculture / Climate Tech / Geospatial Intelligence  
**Model Used**: Gemini 3.0 Flash (primary)  
**Live Demo**: [Add your deployed URL here]  
**Code Repository**: [Add your GitHub URL here]  
**Video Demo**: [Add your YouTube/Loom URL here]  

---

**Built with ❤️ and Gemini 3.0 Flash for the Google DeepMind Hackathon**
