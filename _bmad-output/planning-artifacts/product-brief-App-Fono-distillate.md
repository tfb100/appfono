---
title: "Product Brief Distillate: App - Fono (Smart CAA Upgrade)"
type: llm-distillate
source: "product-brief-App-Fono.md"
created: "2026-04-04T18:43:00Z"
purpose: "Token-efficient context for downstream PRD creation"
---

# Distillate: Comunica+ Inteligente (Upgrade CAA)

_This document captures dense, structured technical and functional context extracted from the collaborative brief discovery session. Optimized for LLM consumption._

## Technical Context & Constraints

* **Platform Architecture**: React 19 + Capacitor 8 (Android target).
* **Hardware Efficiency**: Target is low-end hardware (2GB-4GB RAM).
* **IA Execution Strategy**: Sequential processing (Listen -> Predict -> Assist) to prevent CPU/RAM throttling.
* **Network Independence**: 100% Offline/Local (Edge AI). No cloud processing for audio or video frames.
* **Privacy Standard**: Zero persistence of raw audio files. Volatile processing in RAM only.

## Key Requirement Hints

* **Touch Magnetization**: Implement a "Digital Magnet" that attracts imperfect touch coordinates to the center of the nearest symbol, filtering out "accidental drags" or slight tremors.
* **Blink Activation**: Computer vision integration (front camera) for confirmation. Requires a blink detection model (e.g., MediaPipe Face Landmarker) optimized for mobile.
* **Sequential AI Logic**:
  1. Whisper (Tiny/Base) listens for trigger words.
  2. NLP Classifier maps trigger words to Symbol categories.
  3. UI re-renders a 4-icon "Clean Mode" with high-relevancy suggestions.
* **Accessibility Modes**:
  1. _Normal Mode_: Standard grid.
  2. _Lean/Enxuto Mode_: 4 large icons (Gargalo de UX for low motor precision).
  3. _Manual Mode_: Pause IA (Noisy environments toggle).
* **Calibration Workflows**:
  * Simple Blink Calibration: Adjusting sensitivity for current lighting.
  * Touch Precision Calibration: Training the "Magnet" radius.

## User Scenarios & UX Nuances

* **Scenario (High Noise)**: Clinic/School playground. User toggles "Pause AI" to keep fixed symbols without false predictions.
* **Scenario (Low Precision)**: Child with motor tremors. "Digital Magnet" ensures that even "shaky" attempts land on the intended symbol.
* **Scenario (Limited Mobility)**: User cannot touch the screen. Blink activation allows for scanning/selection (requires scanning highlight logic).

## Competitive Intelligence & Differentiation

* **Differentiator**: Listening to the _interlocutor_/fonoaudiólogo rather than predicting based on user _input_. This flips the current market paradigm.
* **Benchmark**: Better touch correction than Livox and integrated STT listening missing in Spoken AAC.

## Scope Signals (V1)

* **IN**: STT (Whisper), Intent Engine (NLP), 4-Icon Mode, Magnetization, Blink-to-activate.
* **OUT**: Real-time translation, Cloud-based clinical reports, Social sharing, Custom voice training.

## Open Questions for PRD Phase

* What's the specific RAM budget for the Whisper model in background vs main app?
* How to handle "Loud Joking" where the interlocutor's speech is not an instruction?
* Minimum Android version for MediaPipe Blink tracking performance?
