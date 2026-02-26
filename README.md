# 🛡️ CipherShare
**High-Performance, End-to-End Encrypted P2P File Transfer**

![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)
![Platform: Web](https://img.shields.io/badge/Platform-Web-orange.svg)

CipherShare is a specialized web tool designed for secure, direct file sharing. By bypassing central servers, it ensures maximum privacy and utilizes the full speed of your local network.

**!CipherShare is currently in alpha stage!**

## 🚀 Key Technical Features

* **True P2P Connectivity**: Leverages **WebRTC** via PeerJS to establish a direct data channel between browsers, ensuring data never touches a third-party server.
* **Military-Grade Encryption**: Implements the **Web Crypto API** using **AES-GCM (256-bit)** for end-to-end encryption. Keys are generated locally and never transmitted in plain text.
* **Real-Time Streaming**: Uses **Service Workers** and **ReadableStreams** to process files in chunks. This allows for transferring files larger than the device's RAM without crashing the browser.
* **Zero-Knowledge Architecture**: The hosting provider has zero access to your file content or metadata.

## 🛠️ The Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **PeerJS** | Signaling and WebRTC abstraction |
| **Web Crypto API** | AES-GCM Encryption/Decryption & SHA-256 Hashing |
| **Service Workers** | High-speed background stream handling |
| **HTML5/CSS3** | Responsive, mobile-first "Ultra" UI |

## 📐 How It Works

1.  **Handshake**: Users connect via a unique Peer ID (or QR Code).
2.  **Key Exchange**: A secure session key is generated and shared via the encrypted signaling channel.
3.  **Chunking**: The file is broken into small pieces to maintain memory efficiency.
4.  **Transfer**: Chunks are encrypted, sent via the WebRTC DataChannel, and decrypted in real-time on the receiver's end.

**By jakpat**
