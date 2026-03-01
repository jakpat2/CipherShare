# 🛡️ CipherShare
**High-Performance, End-to-End Encrypted P2P File Transfer & Chat**

![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)
![Platform: Web](https://img.shields.io/badge/Platform-Web-orange.svg)
![Status: Verified Stable](https://img.shields.io/badge/Status-Verified--Stable-green.svg)

CipherShare is a specialized web tool designed for secure, direct file sharing and communication. By bypassing central servers, it ensures maximum privacy and utilizes the full speed of your direct connection.



## 🚀 Key Technical Features

* **True P2P Connectivity**: Leverages **WebRTC** via PeerJS to establish a direct data channel between browsers. Data and messages are transmitted directly between peers, bypassing intermediate servers.
* **Military-Grade Encryption**: Implements the **Web Crypto API** using **AES-GCM (256-bit)**. Every session uses a unique, locally generated key to protect both files and chat messages.
* **Encrypted Real-Time Chat**: Integrated P2P messaging allows users to coordinate transfers instantly. Includes **Live Typing Indicators** to provide a seamless communication experience.
* **Pipelined Flow Control**: Uses an asynchronous **ACK-based chunking system**. This prevents memory overflow by ensuring the sender only transmits the next 1MB chunk once the receiver has successfully processed the previous one.
* **Hybrid Storage Engine**: 
    * **Desktop:** Uses the **File System Access API** to stream data directly to the disk, allowing for massive file transfers without browser crashes.
    * **Mobile:** Uses a specialized **Blob-fragmentation fallback** for compatibility with iOS and Android browsers.
* **Background Processing**: Offloads heavy encryption/decryption tasks to **Web Workers** to keep the UI responsive even during high-speed transfers.

## 🛠️ The Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **PeerJS** | WebRTC signaling, data channel management, and P2P Chat |
| **Web Crypto API** | AES-GCM Encryption & SHA-256 integrity verification |
| **Web Workers** | Multi-threaded processing for crypto operations |
| **Streams API** | Direct-to-disk writing for high-performance transfers |
| **QR Code API** | Instant cross-device pairing |

## 📐 The Handshake & Transfer Process

1.  **Pairing**: Users connect via a unique Peer ID or by scanning a generated QR Code.
2.  **Secure Communication**: Once connected, an encrypted chat channel is opened immediately for secure coordination.
3.  **Encryption Handshake**: The sender generates a 256-bit AES key, hashes the file for integrity, and shares the JWK (JSON Web Key) over the secure signaling channel.
4.  **Chunked Pipeline**: The file is sliced into 1MB chunks. Each chunk is encrypted with a unique IV (Initialization Vector) and sent.
5.  **Verification**: Upon completion, the receiver finalizes the file. The transfer logic is verified for **0% data loss** using binary comparison (SHA-256).

**Developed by jakpat**
