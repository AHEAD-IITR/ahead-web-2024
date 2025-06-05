(function () {
  "use strict";

  // Configuration object for easy customization
  const CHATBOT_CONFIG = {
    apiKey: "AIzaSyDXy-WIoSJbU9MWh7wgA8TqEhh4_1Jy-p4", // Default API key
    brainDataUrl: "./brain.json", // URL to brain.json
    position: "bottom-left", // bottom-right, bottom-left, top-right, top-left
    primaryColor: "#3D4785", // Primary theme color
    buttonSize: "60px",
    widgetTitle: "Ahead Saathi!",
    welcomeMessage:
      "Hey there👋<br> I'm Ahead Saathi, your AI friend. How can I help you today?",
    placeholder: "Message...",
    zIndex: 9999,
  };

  // Allow configuration override from global object
  if (window.ChatbotWidgetConfig) {
    Object.assign(CHATBOT_CONFIG, window.ChatbotWidgetConfig);
  }

  // SVG Icons as fallback
  const ICONS = {
    chat: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    </svg>`,
    close: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>`,
    send: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>`,
    minimize: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
    </svg>`,
  };

  // Load Google Fonts more reliably
  function loadGoogleFonts() {
    // Check if already loaded
    if (document.querySelector('link[href*="Material+Symbols"]')) {
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }

  // Widget CSS as a string
  const WIDGET_CSS = `
        /* Reset and base styles */
        .chatbot-widget * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        /* Chatbot toggle button */
        .chatbot-widget-toggle {
            position: fixed;
            ${
              CHATBOT_CONFIG.position.includes("bottom")
                ? "bottom: 20px"
                : "top: 20px"
            };
            ${
              CHATBOT_CONFIG.position.includes("right")
                ? "right: 20px"
                : "left: 20px"
            };
            width: ${CHATBOT_CONFIG.buttonSize};
            height: ${CHATBOT_CONFIG.buttonSize};
            background: ${CHATBOT_CONFIG.primaryColor};
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
            z-index: ${CHATBOT_CONFIG.zIndex};
            transition: transform 0.3s ease;
        }

        .chatbot-widget-toggle:hover {
            transform: scale(1.1);
        }

        .chatbot-widget-toggle .icon {
            position: absolute;
            transition: opacity 0.3s ease, transform 0.3s ease;
            color: white;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .chatbot-widget-toggle .icon svg {
            width: 28px;
            height: 28px;
        }

        .chatbot-widget-toggle .open-icon {
            opacity: 1;
            transform: rotate(0deg);
        }

        .chatbot-widget-toggle .close-icon {
            opacity: 0;
            transform: rotate(-90deg);
        }

        .chatbot-widget-open .chatbot-widget-toggle .open-icon {
            opacity: 0;
            transform: rotate(90deg);
        }

        .chatbot-widget-open .chatbot-widget-toggle .close-icon {
            opacity: 1;
            transform: rotate(0deg);
        }

        /* Material Icons fallback styles */
        .chatbot-widget .material-symbols-rounded {
            font-family: 'Material Symbols Rounded', 'Material Icons', 'Material Icons Outlined', sans-serif;
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
        }

        /* Fallback when Material Icons don't load */
        .chatbot-widget .icon-fallback {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
        }

        /* Chatbot popup */
        .chatbot-widget-popup {
            position: fixed;
            ${
              CHATBOT_CONFIG.position.includes("bottom")
                ? "bottom: 90px"
                : "top: 90px"
            };
            ${
              CHATBOT_CONFIG.position.includes("right")
                ? "right: 20px"
                : "left: 20px"
            };
            width: 400px;
            height: 600px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: ${CHATBOT_CONFIG.zIndex - 1};
            opacity: 0;
            transform: scale(0.1);
            transform-origin: ${
              CHATBOT_CONFIG.position.includes("bottom") ? "bottom" : "top"
            } ${CHATBOT_CONFIG.position.includes("right") ? "right" : "left"};
            transition: opacity 0.3s ease, transform 0.3s ease;
            visibility: hidden;
        }

        .chatbot-widget-open .chatbot-widget-popup {
            opacity: 1;
            transform: scale(1);
            visibility: visible;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
            .chatbot-widget-toggle {
                width: 56px;
                height: 56px;
                bottom: 16px;
                right: 16px;
            }
            
            .chatbot-widget-toggle .icon svg {
                width: 24px;
                height: 24px;
            }
            
            /* Hide toggle button when chatbot is open on mobile */
            .chatbot-widget-open .chatbot-widget-toggle {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                transform: scale(0);
            }
            
            .chatbot-widget-popup {
                width: 100%;
                height: 100%;
                bottom: 0;
                right: 0;
                left: 0;
                top: 0;
                border-radius: 0;
                transform-origin: center;
            }
            
            .chatbot-widget-header {
                padding: 16px 20px;
                min-height: 60px;
            }
            
            .chatbot-widget-title {
                font-size: 16px;
            }
            
            .chatbot-widget-close {
                width: 44px;
                height: 44px;
                min-width: 44px;
            }
            
            .chatbot-widget-body {
                padding: 16px;
                padding-bottom: 20px;
            }
            
            .chatbot-widget-footer {
                padding: 16px;
                padding-bottom: max(16px, env(safe-area-inset-bottom));
            }
            
            .chatbot-widget-form {
                gap: 12px;
            }
            
            .chatbot-widget-input {
                font-size: 16px; /* Prevents zoom on iOS */
                min-height: 44px;
                height: auto;
                padding: 12px 20px;
                border-radius: 22px;
            }
            
            .chatbot-widget-send-btn {
                width: 44px;
                height: 44px;
                min-width: 44px;
                flex-shrink: 0;
            }
            
            .chatbot-widget-message-text {
                font-size: 15px;
                line-height: 1.4;
                max-width: 85%;
            }
            
            .chatbot-widget-bot-avatar {
                width: 32px;
                height: 32px;
            }
        }

        /* Small mobile devices */
        @media (max-width: 480px) {
            .chatbot-widget-toggle {
                width: 52px;
                height: 52px;
                bottom: 12px;
                right: 12px;
            }
            
            .chatbot-widget-header {
                padding: 12px 16px;
            }
            
            .chatbot-widget-title {
                font-size: 15px;
            }
            
            .chatbot-widget-body {
                padding: 12px;
            }
            
            .chatbot-widget-footer {
                padding: 12px;
                padding-bottom: max(12px, env(safe-area-inset-bottom));
            }
            
            .chatbot-widget-input {
                font-size: 16px;
                padding: 10px 16px;
            }
            
            .chatbot-widget-send-btn {
                width: 40px;
                height: 40px;
                min-width: 40px;
            }
        }

        /* Landscape orientation on mobile */
        @media (max-width: 768px) and (orientation: landscape) {
            .chatbot-widget-popup {
                height: 100vh;
            }
            
            .chatbot-widget-header {
                padding: 12px 20px;
                min-height: 56px;
            }
            
            .chatbot-widget-body {
                padding: 12px 16px;
            }
        }

        /* Touch-friendly improvements */
        @media (pointer: coarse) {
            .chatbot-widget-toggle:hover {
                transform: none; /* Remove hover effect on touch devices */
            }
            
            .chatbot-widget-send-btn:hover {
                transform: none;
            }
            
            .chatbot-widget-close:hover {
                background: none;
            }
        }

        /* Ensure proper touch targets */
        .chatbot-widget-toggle,
        .chatbot-widget-send-btn,
        .chatbot-widget-close {
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }

        /* Prevent zoom on input focus for iOS */
        @supports (-webkit-touch-callout: none) {
            .chatbot-widget-input {
                font-size: 16px !important;
                transform: translateZ(0);
                -webkit-appearance: none;
            }
        }

        /* Chat header */
        .chatbot-widget-header {
            background: ${CHATBOT_CONFIG.primaryColor};
            color: white;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .chatbot-widget-header-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .chatbot-widget-logo {
            width: 40px;
            height: 40px;
            fill: white;
        }

        .chatbot-widget-title {
            font-size: 18px;
            font-weight: 600;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: white;
        }

        .chatbot-widget-close {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            transition: background 0.3s ease;
            width: 40px;
            height: 40px;
        }

        .chatbot-widget-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        /* Chat body */
        .chatbot-widget-body {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f8f9fa;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* Messages */
        .chatbot-widget-message {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .chatbot-widget-bot-message {
            align-items: flex-start;
        }

        .chatbot-widget-user-message {
            flex-direction: row-reverse;
            align-items: flex-start;
        }

        .chatbot-widget-bot-avatar {
            width: 35px;
            height: 35px;
            fill: ${CHATBOT_CONFIG.primaryColor};
            flex-shrink: 0;
        }

        .chatbot-widget-message-text {
            background: white;
            padding: 12px 16px;
            border-radius: 18px;
            max-width: 80%;
            word-wrap: break-word;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            font-size: 14px;
            line-height: 1.5;
        }

        .chatbot-widget-user-message .chatbot-widget-message-text {
            background: ${CHATBOT_CONFIG.primaryColor};
            color: white;
        }

        /* Thinking indicator */
        .chatbot-widget-thinking-indicator {
            display: flex;
            gap: 4px;
            padding: 5px 0;
        }

        .chatbot-widget-thinking-indicator .dot {
            width: 8px;
            height: 8px;
            background: #999;
            border-radius: 50%;
            animation: thinking 1.4s ease-in-out infinite;
        }

        .chatbot-widget-thinking-indicator .dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .chatbot-widget-thinking-indicator .dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes thinking {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
            30% { transform: translateY(-10px); opacity: 1; }
        }

        /* Chat footer */
        .chatbot-widget-footer {
            padding: 15px;
            background: white;
            border-top: 1px solid #e0e0e0;
            position: relative;
        }

        .chatbot-widget-form {
            display: flex;
            gap: 10px;
            align-items: flex-end;
        }

        .chatbot-widget-input {
            flex: 1;
            border: 1px solid #e0e0e0;
            border-radius: 25px;
            padding: 10px 20px;
            font-size: 14px;
            resize: none; /* This removes the resize handle and blue line */
            outline: none;
            font-family: inherit;
            max-height: 100px;
            line-height: 1.5;
            transition: border-color 0.2s ease;
            /* Additional properties to ensure clean appearance */
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            min-height: 40px;
            height: 40px; /* Default height */
            box-sizing: border-box;
            overflow-y: hidden;
            resize: none;
        }

        .chatbot-widget-input:focus {
            border-color: #e0e0e0;
            outline: none;
            /* Remove any browser default focus styles */
            box-shadow: none;
        }

        .chatbot-widget-controls {
            display: flex;
            gap: 5px;
        }

        .chatbot-widget-send-btn {
            width: 40px;
            height: 40px;
            border: none;
            background: ${CHATBOT_CONFIG.primaryColor};
            color: white;
            cursor: pointer;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }

        .chatbot-widget-send-btn:hover {
            transform: scale(1.1);
        }

        /* Scrollbar styling */
        .chatbot-widget-body::-webkit-scrollbar {
            width: 6px;
        }

        .chatbot-widget-body::-webkit-scrollbar-track {
            background: transparent;
        }

        .chatbot-widget-body::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 3px;
        }

        .chatbot-widget-body::-webkit-scrollbar-thumb:hover {
            background: #999;
        }

        /* Message text styling */
        .chatbot-widget-message-text p {
            margin: 0 0 10px 0;
        }

        .chatbot-widget-message-text p:last-child {
            margin-bottom: 0;
        }

        .chatbot-widget-message-text ul {
            margin: 10px 0;
            padding-left: 20px;
        }

        .chatbot-widget-message-text li {
            margin: 5px 0;
        }

        .chatbot-widget-message-text code {
            background: #f0f0f0;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: monospace;
        }

        .chatbot-widget-user-message .chatbot-widget-message-text code {
            background: rgba(255, 255, 255, 0.2);
        }

        .chatbot-widget-message-text pre {
            background: #f0f0f0;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
            margin: 10px 0;
        }

        .chatbot-widget-message-text pre code {
            background: none;
            padding: 0;
        }
    `;

  // Create and inject widget
  class ChatbotWidget {
    constructor() {
      this.isOpen = false;
      this.conferenceData = null;
      this.init();
    }

    init() {
      // Load Google Fonts first
      loadGoogleFonts();

      // Create widget container
      this.container = document.createElement("div");
      this.container.className = "chatbot-widget";
      this.container.innerHTML = this.getHTML();
      document.body.appendChild(this.container);

      // Inject CSS
      this.injectStyles();

      // Cache DOM elements
      this.cacheElements();

      // Load conference data
      this.loadConferenceData();

      // Bind events
      this.bindEvents();
    }

    getHTML() {
      const svgIcon = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg>`;

      return `
                <button class="chatbot-widget-toggle">
                    <span class="open-icon icon">${ICONS.chat}</span>
                    <span class="close-icon icon">${ICONS.close}</span>
                </button>
                <div class="chatbot-widget-popup">
                    <div class="chatbot-widget-header">
                        <div class="chatbot-widget-header-info">
                            <div class="chatbot-widget-logo">${svgIcon}</div>
                            <h2 class="chatbot-widget-title">${CHATBOT_CONFIG.widgetTitle}</h2>
                        </div>
                        <button class="chatbot-widget-close">
                            <span class="icon-fallback">${ICONS.minimize}</span>
                        </button>
                    </div>
                    <div class="chatbot-widget-body">
                        <div class="chatbot-widget-message chatbot-widget-bot-message">
                            <div class="chatbot-widget-bot-avatar">${svgIcon}</div>
                            <div class="chatbot-widget-message-text">${CHATBOT_CONFIG.welcomeMessage}</div>
                        </div>
                    </div>
                    <div class="chatbot-widget-footer">
                        <form class="chatbot-widget-form">
                            <textarea class="chatbot-widget-input" placeholder="${CHATBOT_CONFIG.placeholder}" rows="1"></textarea>
                            <div class="chatbot-widget-controls">
                                <button type="submit" class="chatbot-widget-send-btn">
                                    <span class="icon-fallback">${ICONS.send}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
    }

    injectStyles() {
      const style = document.createElement("style");
      style.textContent = WIDGET_CSS;
      document.head.appendChild(style);
    }

    cacheElements() {
      this.toggleBtn = this.container.querySelector(".chatbot-widget-toggle");
      this.closeBtn = this.container.querySelector(".chatbot-widget-close");
      this.chatBody = this.container.querySelector(".chatbot-widget-body");
      this.messageInput = this.container.querySelector(".chatbot-widget-input");
      this.sendBtn = this.container.querySelector(".chatbot-widget-send-btn");
      this.form = this.container.querySelector(".chatbot-widget-form");
    }

    bindEvents() {
      // Toggle chatbot
      this.toggleBtn.addEventListener("click", () => this.toggle());
      this.closeBtn.addEventListener("click", () => this.close());

      // Send message
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.sendMessage();
      });

      // Handle Enter key
      this.messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      // Auto-resize textarea with mobile optimization
      this.messageInput.addEventListener("input", () => {
        this.messageInput.style.height = "auto";
        const newHeight = Math.min(this.messageInput.scrollHeight, 100);
        this.messageInput.style.height = newHeight + "px";

        // Scroll to bottom on mobile when typing
        if (this.isMobile()) {
          setTimeout(() => {
            this.chatBody.scrollTop = this.chatBody.scrollHeight;
          }, 100);
        }
      });

      // Mobile-specific optimizations
      if (this.isMobile()) {
        this.addMobileOptimizations();
      }

      // Handle orientation change
      window.addEventListener("orientationchange", () => {
        setTimeout(() => {
          this.handleOrientationChange();
        }, 500);
      });

      // Handle viewport resize
      window.addEventListener("resize", () => {
        this.handleResize();
      });
    }

    isMobile() {
      return (
        window.innerWidth <= 768 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      );
    }

    addMobileOptimizations() {
      // Prevent body scroll when chat is open
      this.toggleBtn.addEventListener("click", () => {
        if (this.isOpen) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
      });

      this.closeBtn.addEventListener("click", () => {
        document.body.style.overflow = "";
      });

      // Handle virtual keyboard on mobile
      this.messageInput.addEventListener("focus", () => {
        if (this.isMobile()) {
          setTimeout(() => {
            this.messageInput.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 300);
        }
      });

      // Add touch feedback
      const touchElements = [this.toggleBtn, this.sendBtn, this.closeBtn];
      touchElements.forEach((element) => {
        element.addEventListener("touchstart", () => {
          element.style.opacity = "0.7";
        });
        element.addEventListener("touchend", () => {
          element.style.opacity = "";
        });
        element.addEventListener("touchcancel", () => {
          element.style.opacity = "";
        });
      });
    }

    handleOrientationChange() {
      if (this.isOpen && this.isMobile()) {
        // Adjust chat body height after orientation change
        setTimeout(() => {
          this.chatBody.scrollTop = this.chatBody.scrollHeight;
        }, 100);
      }
    }

    handleResize() {
      if (this.isOpen && this.isMobile()) {
        // Ensure proper positioning on resize
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
      }
    }

    toggle() {
      this.isOpen = !this.isOpen;
      this.container.classList.toggle("chatbot-widget-open", this.isOpen);
    }

    close() {
      this.isOpen = false;
      this.container.classList.remove("chatbot-widget-open");
    }

    async loadConferenceData() {
      try {
        const response = await fetch(CHATBOT_CONFIG.brainDataUrl);
        this.conferenceData = await response.json();
      } catch (error) {
        console.error("Failed to load conference data:", error);
        // Use embedded data as fallback
        this.conferenceData = this.getEmbeddedConferenceData();
      }
    }

    getEmbeddedConferenceData() {
      // Embedded minimal conference data as fallback
      return {
        conference: {
          title: "AHEAD 2025 International Conference",
          description: "Global Disruptions in Healthcare and Development",
          format: "Hybrid",
          location: {
            address: "IIT Roorkee, India",
          },
          dates: {
            conference: "December 15-17, 2025",
          },
          contact: {
            email: "ahead@iitr.ac.in",
          },
        },
      };
    }

    sendMessage() {
      const message = this.messageInput.value.trim();
      if (!message) return;

      // Display user message
      this.addMessage(message, "user");
      this.messageInput.value = "";
      this.messageInput.style.height = "auto";

      // Show thinking indicator
      const thinkingId = this.showThinking();

      // Generate response
      this.generateResponse(message, thinkingId);
    }

    addMessage(content, type) {
      const svgIcon = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg>`;

      const messageEl = document.createElement("div");
      messageEl.className = `chatbot-widget-message chatbot-widget-${type}-message`;

      if (type === "bot") {
        messageEl.innerHTML = `
                    <div class="chatbot-widget-bot-avatar">${svgIcon}</div>
                    <div class="chatbot-widget-message-text">${this.beautify(
                      content
                    )}</div>
                `;
      } else {
        messageEl.innerHTML = `
                    <div class="chatbot-widget-message-text">${this.beautify(
                      content
                    )}</div>
                `;
      }

      this.chatBody.appendChild(messageEl);
      this.chatBody.scrollTop = this.chatBody.scrollHeight;
    }

    showThinking() {
      const thinkingId = "thinking-" + Date.now();
      const svgIcon = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg>`;

      const thinkingEl = document.createElement("div");
      thinkingEl.className =
        "chatbot-widget-message chatbot-widget-bot-message";
      thinkingEl.id = thinkingId;
      thinkingEl.innerHTML = `
                <div class="chatbot-widget-bot-avatar">${svgIcon}</div>
                <div class="chatbot-widget-message-text">
                    <div class="chatbot-widget-thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>
            `;

      this.chatBody.appendChild(thinkingEl);
      this.chatBody.scrollTop = this.chatBody.scrollHeight;

      return thinkingId;
    }

    async generateResponse(userMessage, thinkingId) {
      try {
        // Simple greetings
        const msg = userMessage.toLowerCase().trim();
        const greetings = [
          "hi",
          "hello",
          "hey",
          "good morning",
          "good afternoon",
          "good evening",
        ];
        const thanks = ["thank you", "thanks", "thx"];
        const howAreYou = ["how are you", "how r u", "how's it going"];

        // Remove thinking indicator
        const thinkingEl = document.getElementById(thinkingId);

        // Handle simple responses
        if (greetings.includes(msg)) {
          thinkingEl.remove();
          this.addMessage(
            "Hello! 👋<br>How can I help you with AHEAD 2025?",
            "bot"
          );
          return;
        }
        if (thanks.some((t) => msg.includes(t))) {
          thinkingEl.remove();
          this.addMessage(
            "You're welcome!<br>Let me know if you need more info.",
            "bot"
          );
          return;
        }
        if (howAreYou.some((h) => msg.includes(h))) {
          thinkingEl.remove();
          this.addMessage(
            "I'm great, thank you!<br>How can I assist you about the conference?",
            "bot"
          );
          return;
        }

        // Call Gemini API
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${CHATBOT_CONFIG.apiKey}`;

        const context = this.getConferenceContext();
        const chatHistory = [
          {
            role: "model",
            parts: [{ text: context }],
          },
          {
            role: "user",
            parts: [
              {
                text: `Using the details above, answer in a very short, concise, complete, attractive, and friendly English style (like a helpful assistant). Do not repeat greetings like "Hey there" or "Hello". Make sure the reply is easy to read, covers all important points, and highlights key info in bold. Don't use negative terms like can't be always positive personality. Here is the question: ${userMessage}`,
              },
            ],
          },
        ];

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: chatHistory,
          }),
        });

        const data = await response.json();
        thinkingEl.remove();

        let botText = "Sorry, I couldn't understand that. Please try again.";
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          botText = data.candidates[0].content.parts[0].text;
        }

        this.addMessage(botText, "bot");
      } catch (error) {
        document.getElementById(thinkingId)?.remove();
        this.addMessage(`Error: ${error.message}`, "bot");
      }
    }

    beautify(text) {
      // Code blocks
      text = text.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
      // Inline code
      text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
      // Bold
      text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
      // Italic
      text = text.replace(/\*(.*?)\*/g, "<i>$1</i>");
      // Lists
      text = text.replace(/(?:^|\n)[*-]\s*(.*?)(?=\n|$)/g, "<li>$1</li>");
      text = text.replace(/(?:^|\n)\d+\.\s*(.*?)(?=\n|$)/g, "<li>$1</li>");
      // Paragraphs
      text = text.replace(/\n{2,}/g, "</p><p>");
      // Line breaks
      text = text.replace(/\n/g, "<br>");
      // Wrap lists
      text = text.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
      // Wrap in paragraph
      text = `<p>${text}</p>`;

      return text;
    }

    getConferenceContext() {
      if (!this.conferenceData) return "Conference data is loading...";

      const conf = this.conferenceData.conference;

      let context = `
AHEAD 2025 International Conference
Title: ${conf.title}
Tagline: ${conf.tagline || conf.description}
Description: ${conf.description}
Format: ${conf.format}
Location: ${conf.location.name}, ${conf.location.city}, ${
        conf.location.state
      }, ${conf.location.country}
Address: ${conf.location.address}
Conference Dates: ${conf.dates.conference}
Workshop Date: ${conf.dates.workshop}
Contact Email: ${conf.contact.email}
Contact Phone: ${conf.contact.phone}
Website: ${conf.website}

CONFERENCE TRACKS:`;

      // Add tracks information
      if (this.conferenceData.tracks) {
        this.conferenceData.tracks.forEach((track, index) => {
          context += `
${index + 1}. ${track.name}
   Description: ${track.description}
   Sub-themes: ${track.sub_themes.join(", ")}`;
        });
      }

      // Add important dates
      if (this.conferenceData.important_dates) {
        const dates = this.conferenceData.important_dates;
        context += `

IMPORTANT DATES:
- Call for Papers: ${dates.call_for_papers}
- Submission Deadline: ${dates.submission_deadline}
- Acceptance Notification: ${dates.acceptance_notification}
- Early Bird Registration: ${dates.early_bird_registration}
- Late Registration: ${dates.late_registration}
- Fee Waiver Submission: ${dates.fee_waiver_submission}
- Fee Waiver Decision: ${dates.fee_waiver_decision}`;
      }

      // Add registration fees
      if (
        this.conferenceData.registration &&
        this.conferenceData.registration.fees
      ) {
        const fees = this.conferenceData.registration.fees;
        context += `

REGISTRATION FEES:
Early Bird:
- Indian: ${fees.early_bird.Indian}
- Indian Student: ${fees.early_bird.Indian_Student}
- LMIC: ${fees.early_bird.LMIC}
- LMIC Student: ${fees.early_bird.LMIC_Student}
- Foreign: ${fees.early_bird.Foreign}
- Foreign Student: ${fees.early_bird.Foreign_Student}

Online Participation:
- Indian: ${fees.online_fee.Indian}
- Indian Student: ${fees.online_fee.Indian_Student}
- LMIC: ${fees.online_fee.LMIC}
- LMIC Student: ${fees.online_fee.LMIC_Student}
- Foreign: ${fees.online_fee.Foreign}
- Foreign Student: ${fees.online_fee.Foreign_Student}`;
      }

      // Add highlights
      if (this.conferenceData.highlights) {
        context += `

CONFERENCE HIGHLIGHTS:
${this.conferenceData.highlights
  .map((highlight) => `- ${highlight}`)
  .join("\n")}`;
      }

      // Add submission information
      if (this.conferenceData.submission) {
        const sub = this.conferenceData.submission;
        context += `

SUBMISSION GUIDELINES:
- Maximum submissions per presenter: ${sub.rules.max_submissions_per_presenter}
- Review process: ${sub.rules.blind_review ? "Blind review" : "Open review"}
- Format: ${sub.rules.format}
- Maximum file size: ${sub.rules.max_file_size_mb}MB
- Preferred length: ${sub.rules.preferred}
- Submission types: ${sub.types.join(", ")}
- Submission link: ${sub.submission_link}`;
      }

      context += `

For all answers, use only the information provided in this context. If the question is outside this scope, reply: "Sorry, I can only answer questions about the AHEAD 2025 International Conference."`;

      return context;
    }
  }

  // Initialize widget when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => new ChatbotWidget());
  } else {
    new ChatbotWidget();
  }
})();
