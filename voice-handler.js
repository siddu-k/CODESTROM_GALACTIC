/**
 * Galactic AI - Voice Handler Utility
 * Manages Text-to-Speech (TTS) using the Web Speech API
 */

class VoiceHandler {
    constructor() {
        this.enabled = localStorage.getItem('galactic_voice_enabled') === 'true';
        this.synth = window.speechSynthesis;
        this.currentUtterance = null;
    }

    /**
     * Toggles the global voice state
     * @returns {boolean} New state
     */
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('galactic_voice_enabled', this.enabled);
        if (!this.enabled && this.synth.speaking) {
            this.synth.cancel();
        }
        return this.enabled;
    }

    /**
     * Speaks the given text
     * @param {string} text - The text to read aloud
     * @param {boolean} force - Whether to speak even if global voice is disabled
     */
    speak(text, force = false) {
        if (!this.synth) return;
        if (!this.enabled && !force) return;

        // Stop any current speech
        this.synth.cancel();

        // Strip HTML if present
        const cleanText = text.replace(/<[^>]*>?/gm, '');

        const utterance = new SpeechSynthesisUtterance(cleanText);

        // Find a nice voice (optional enhancement)
        const voices = this.synth.getVoices();
        // Prefer a natural sounding one if available
        const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        this.currentUtterance = utterance;
        this.synth.speak(utterance);
    }

    /**
     * Updates a toggle button UI
     * @param {HTMLElement} btn - The toggle button element
     */
    updateToggleUI(btn) {
        if (!btn) return;
        const icon = btn.querySelector('i');
        if (this.enabled) {
            btn.classList.add('bg-blue-500/20', 'border-blue-500/50');
            btn.classList.remove('bg-white/5', 'border-white/10');
            if (icon) icon.setAttribute('data-lucide', 'volume-2');
        } else {
            btn.classList.remove('bg-blue-500/20', 'border-blue-500/50');
            btn.classList.add('bg-white/5', 'border-white/10');
            if (icon) icon.setAttribute('data-lucide', 'volume-x');
        }
        if (window.lucide) window.lucide.createIcons();
    }
}

// Initialize global instance
window.galacticVoice = new VoiceHandler();
