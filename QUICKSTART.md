# 🚀 Quick Start Guide

## For Hackathon Judges

### **Instant Demo (No Setup Required)**

1. **Open the Application:**
   - Simply open `index.html` in any modern browser
   - Chrome, Firefox, or Edge recommended

2. **Navigate to Core Feature:**
   - Click "ENTER COMMAND" on landing page
   - Select "Geospatial Research" from dashboard
   - Or directly open `land.html`

3. **Try Gemini 3 Analysis:**
   - Model selector shows **✨ Gemini 3.0 Flash (Latest)** by default
   - Click GPS button (⌖) OR draw a polygon on map
   - Click green "Analyze Field" button
   - Watch Gemini 3 generate comprehensive agricultural report

4. **Test Model Switching:**
   - Change dropdown to Gemini 2.0 Flash or 1.5 Pro
   - Retry analysis to compare model performance

---

## Using Your Own API Key

If the default key hits quota limits:

1. Get free key: https://makersuite.google.com/app/apikey
2. Click "Analyze Field" (if it fails, popup will appear)
3. Enter your Gemini API key
4. Click "Save & Retry"

**Note:** Keys are stored locally in browser—never uploaded to servers.

---

## Recommended Test Locations

### **Best for Demo:**
1. **Punjab, India** (Lat: 30.9010, Lon: 75.8573)
   - Rich agricultural region
   - Shows wheat/rice recommendations

2. **Iowa, USA** (Lat: 41.8780, Lon: -93.0977)
   - Corn belt showcase
   - Excellent soil analysis

3. **Nile Delta, Egypt** (Lat: 30.8025, Lon: 31.2357)
   - Historical farming area
   - Unique irrigation insights

### **How to Test:**
1. Pan map to location
2. Click anywhere on land
3. Hit "Analyze Field"

---

## Feature Checklist for Judges

✅ **Gemini 3.0 Flash** set as default model  
✅ **Model selector dropdown** with 4 Gemini options  
✅ **Real-time AI analysis** of coordinates  
✅ **Structured JSON output** displayed in UI  
✅ **Crop recommendations** with match scores  
✅ **Soil composition** analysis  
✅ **Climate metrics** integration  
✅ **Chat assistant** for follow-up questions  
✅ **Interactive 3D globe** visualization  
✅ **High-res satellite imagery**  

---

## Project Files

- `land.html` - ⭐ **PRIMARY GEMINI 3 FEATURE**
- `main.js` - Core AI integration
- `README.md` - Full documentation
- `GEMINI_INTEGRATION.md` - Technical AI overview (~200 words)

---

## Tech Stack Verification

Open browser DevTools (F12) → Console:
- Should see: "Using Gemini model: gemini-3.0-flash"
- No errors about OpenRouter or Xiaomi
- Clean Gemini API calls only

---

## Video Demo Timestamps

**0:00-0:30** - Landing page + Dashboard  
**0:30-1:30** - ⭐ **Core Gemini 3 land analysis**  
**1:30-2:00** - Model switching demonstration  
**2:00-2:30** - Chat assistant interaction  
**2:30-3:00** - Bonus features + Closing  

---

## Support

If you encounter any issues during judging:
- Check browser console for error messages
- Verify internet connection (for satellite tiles)
- Try different Gemini model from dropdown
- Refresh page if UI becomes unresponsive

**Contact:** [Your email/Discord]

---

**Built for Google Gemini 3 Global Hackathon** 🌍✨
