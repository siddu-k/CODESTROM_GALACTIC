/**
 * Galactic AI - Voice Handler Utility
 * Manages Text-to-Speech (TTS) using the Web Speech API
 */

class VoiceHandler {
    constructor() {
        this.enabled = localStorage.getItem('galactic_voice_enabled') === 'true';
        this.synth = window.speechSynthesis;
        this.currentUtterance = null;
        this.voices = [];

        console.log("VoiceHandler: Initialized. Voice enabled:", this.enabled);

        // Load voices asynchronously
        if (this.synth) {
            this.synth.onvoiceschanged = () => {
                this.voices = this.synth.getVoices();
                console.log("VoiceHandler: Voices loaded.", this.voices.length, "voices available.");
            };
            this.voices = this.synth.getVoices();
        }
    }

    /**
     * Toggles the global voice state
     * @returns {boolean} New state
     */
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('galactic_voice_enabled', this.enabled);
        console.log("VoiceHandler: Toggled voice. New state:", this.enabled);

        if (!this.enabled && this.synth && this.synth.speaking) {
            this.synth.cancel();
        }

        // Test speech when enabling
        if (this.enabled) {
            this.speak("Voice assistance enabled", true);
        }

        return this.enabled;
    }

    /**
     * Speaks the given text
     * @param {string} text - The text to read aloud
     * @param {boolean} force - Whether to speak even if global voice is disabled
     */
    speak(text, force = false) {
        if (!this.synth) {
            console.error("VoiceHandler: SpeechSynthesis not supported in this browser.");
            return;
        }
        if (!this.enabled && !force) return;

        console.log("VoiceHandler: Speaking text:", text.substring(0, 50) + "...");

        try {
            // Stop any current speech
            this.synth.cancel();

            // Strip HTML/Markdown if present
            const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/\*+/g, '');

            const utterance = new SpeechSynthesisUtterance(cleanText);

            // Find a nice voice
            if (this.voices.length === 0) this.voices = this.synth.getVoices();
            const preferredVoice = this.voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || this.voices[0];
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onerror = (event) => {
                console.error("VoiceHandler: SpeechSynthesis error", event);
            };

            this.currentUtterance = utterance;
            this.synth.speak(utterance);
        } catch (err) {
            console.error("VoiceHandler: Error during speak", err);
        }
    }

    /**
     * Updates a toggle button UI
     * @param {HTMLElement} btn - The toggle button element
     */
    updateToggleUI(btn) {
        if (!btn) return;
        console.log("VoiceHandler: Updating Toggle UI. Enabled:", this.enabled);
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

        // Use a safe check for lucide
        const lucideInstance = window.lucide || (typeof lucide !== 'undefined' ? lucide : null);
        if (lucideInstance && lucideInstance.createIcons) {
            lucideInstance.createIcons();
        }
    }
}

// Initialize global instance
window.galacticVoice = new VoiceHandler();
