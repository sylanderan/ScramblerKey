---
title: "ScramblerKey: A Non-Deterministic Randomized Keyboard for Secure Password Entry"
tags:
  - cybersecurity
  - authentication
  - virtual keyboard
  - MERN stack
authors:
  - name: Sylanderan G
    affiliation: 1
affiliations:
  - name: R P Sarathy Institute of Technology, Salem, Tamil Nadu, India
    index: 1
date: 2026
---

# Summary

ScramblerKey is a web-based secure authentication system designed to protect user credentials from side-channel attacks such as screen recording, cursor tracking, and coordinate inference. It introduces a non-deterministic virtual keyboard that dynamically reshuffles its layout after every keypress, eliminating predictable input patterns.

# Statement of need

Traditional virtual keyboards use static or session-based randomization, which can be exploited through repeated observations. With the increasing use of online banking and secure systems, there is a need for stronger protection mechanisms against observation-based attacks. ScramblerKey addresses this gap by implementing continuous layout randomization and secure coordinate-based input encoding.

# Description

ScramblerKey is built using the MERN stack (MongoDB, Express.js, React, Node.js). The system employs a non-deterministic layout engine that reshuffles the keyboard layout after each keypress using a Fisher-Yates shuffle algorithm.

Instead of transmitting raw character inputs, the system encodes user interactions as coordinate-based vectors. These vectors are securely transmitted and decoded on the server side, ensuring that intercepted data cannot reveal actual credentials.

The system also includes a visual decoy mechanism that introduces dynamic noise to confuse screen-recording attacks. A zero-persistence memory model ensures that sensitive data is never stored beyond the active session.

# Features

- Per-keypress dynamic keyboard randomization  
- Coordinate-based secure input encoding  
- Zero-persistence memory model  
- Visual decoy mechanism against screen recording  
- Full-stack implementation using MERN  

# Technology

- Frontend: React (TypeScript), Tailwind CSS  
- Backend: Node.js, Express.js  
- Database: MongoDB  
- Deployment: Vercel / Netlify  

# References

1. V. Roth et al., "A PIN-entry method resilient against shoulder surfing," 2004.  
2. D. Balzarotti et al., "ClearShot: Eavesdropping on keyboard input from video," 2008.  
3. B. Hoanca and K. Mock, "Screen oriented technique for reducing shoulder surfing," 2005.  
4. OWASP Authentication Cheat Sheet.  
5. MongoDB MERN Stack Documentation.
