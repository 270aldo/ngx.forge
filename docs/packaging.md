# Packaging Evaluation

This document outlines options for distributing the application on desktop and mobile platforms.

## Desktop: Electron vs Tauri

- **Electron** wraps a Chromium browser with Node.js. It is mature, widely adopted, and integrates easily with existing web applications. However, its binaries tend to be large and memory usage is higher.
- **Tauri** uses system webviews and a Rust backend. It yields smaller downloads and better performance but introduces a Rust toolchain and may require more configuration.

Either option can host the current frontend built with Vite. Electron offers greater ecosystem familiarity, while Tauri may deliver a lighter footprint.

## Mobile: React Native vs PWA

- **React Native** allows reuse of some React components but requires adapting them to React Native primitives. Shared business logic can stay in TypeScript, but UI code will need adjustments.
- **Progressive Web App (PWA)** transforms the existing web codebase into an installable application. Implementing service workers and responsive design can provide an app-like experience without rewriting the UI.

Given the React + TypeScript frontend, starting with a PWA is the simplest path to mobile. If native capabilities or store distribution become necessary, exploring a React Native rewrite is feasible.
