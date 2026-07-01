(function() {
  // 1. Haal configuratie op uit de script tag
  const scriptTag = document.currentScript;
  const botId = scriptTag.getAttribute('data-bot-id') || 'demo';
  const primaryColor = scriptTag.getAttribute('data-color') || '#3B82F6';
  
  // 2. Inject CSS
  const style = document.createElement('style');
  style.innerHTML = \`
    #ryl-chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #ryl-chat-toggle {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background-color: \${primaryColor};
      color: white;
      border: none;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
    }
    #ryl-chat-toggle:hover {
      transform: scale(1.05);
    }
    #ryl-chat-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 350px;
      height: 500px;
      max-height: calc(100vh - 100px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }
    #ryl-chat-window.ryl-open {
      display: flex;
    }
    #ryl-chat-header {
      background-color: \${primaryColor};
      color: white;
      padding: 16px;
      font-weight: 600;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #ryl-chat-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 20px;
    }
    #ryl-chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background-color: #f9fafb;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .ryl-msg {
      max-width: 80%;
      padding: 12px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
    }
    .ryl-msg-user {
      align-self: flex-end;
      background-color: \${primaryColor};
      color: white;
      border-bottom-right-radius: 4px;
    }
    .ryl-msg-bot {
      align-self: flex-start;
      background-color: #e5e7eb;
      color: #1f2937;
      border-bottom-left-radius: 4px;
    }
    #ryl-chat-input-area {
      padding: 12px;
      background: white;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
    }
    #ryl-chat-input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 20px;
      outline: none;
      font-size: 14px;
    }
    #ryl-chat-input:focus {
      border-color: \${primaryColor};
    }
    #ryl-chat-submit {
      background-color: \${primaryColor};
      color: white;
      border: none;
      border-radius: 20px;
      padding: 0 16px;
      cursor: pointer;
      font-weight: 500;
    }
    .ryl-loading-dots {
      display: flex;
      gap: 4px;
      padding: 8px 12px;
    }
    .ryl-dot {
      width: 6px;
      height: 6px;
      background-color: #9ca3af;
      border-radius: 50%;
      animation: ryl-bounce 1.4s infinite ease-in-out both;
    }
    .ryl-dot:nth-child(1) { animation-delay: -0.32s; }
    .ryl-dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes ryl-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  \`;
  document.head.appendChild(style);

  // 3. Inject HTML
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'ryl-chat-widget';
  widgetContainer.innerHTML = \`
    <div id="ryl-chat-window">
      <div id="ryl-chat-header">
        <span>Klantenservice</span>
        <button id="ryl-chat-close">&times;</button>
      </div>
      <div id="ryl-chat-messages">
        <div class="ryl-msg ryl-msg-bot">Hallo! Hoe kan ik je vandaag helpen?</div>
      </div>
      <div id="ryl-chat-input-area">
        <input type="text" id="ryl-chat-input" placeholder="Typ je bericht..." />
        <button id="ryl-chat-submit">Zend</button>
      </div>
    </div>
    <button id="ryl-chat-toggle">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    </button>
  \`;
  document.body.appendChild(widgetContainer);

  // 4. Logic
  const toggleBtn = document.getElementById('ryl-chat-toggle');
  const closeBtn = document.getElementById('ryl-chat-close');
  const chatWindow = document.getElementById('ryl-chat-window');
  const input = document.getElementById('ryl-chat-input');
  const submitBtn = document.getElementById('ryl-chat-submit');
  const messagesContainer = document.getElementById('ryl-chat-messages');

  let messages = [];

  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('ryl-open');
    if(chatWindow.classList.contains('ryl-open')) input.focus();
  });

  closeBtn.addEventListener('click', () => chatWindow.classList.remove('ryl-open'));

  const appendMessage = (text, sender) => {
    const div = document.createElement('div');
    div.className = \`ryl-msg ryl-msg-\${sender}\`;
    div.innerText = text;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const showLoading = () => {
    const div = document.createElement('div');
    div.id = 'ryl-loading';
    div.className = 'ryl-msg ryl-msg-bot ryl-loading-dots';
    div.innerHTML = '<div class="ryl-dot"></div><div class="ryl-dot"></div><div class="ryl-dot"></div>';
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const removeLoading = () => {
    const loading = document.getElementById('ryl-loading');
    if(loading) loading.remove();
  };

  const sendMessage = async () => {
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    input.value = '';
    messages.push({ role: 'user', content: text });

    showLoading();

    try {
      // Gebruik de host van het huidige script als basis-URL (voor lokale dev) of een hardcoded productie URL
      const scriptUrl = new URL(scriptTag.src);
      const apiUrl = \`\${scriptUrl.origin}/api/chatbot/chat\`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, botId })
      });

      removeLoading();

      if (!response.ok) throw new Error('API Error');

      // Simple handling for streaming response text chunks 
      // (For a truly robust implementation, read the stream fully. Here we just await text for simplicity in vanilla JS)
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botResponse = "";
      
      const botDiv = document.createElement('div');
      botDiv.className = 'ryl-msg ryl-msg-bot';
      messagesContainer.appendChild(botDiv);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        // The Vercel AI SDK format streams chunks starting with '0:'
        const chunk = decoder.decode(value);
        const lines = chunk.split('\\n');
        for (const line of lines) {
          if (line.startsWith('0:')) {
            const textChunk = JSON.parse(line.slice(2));
            botResponse += textChunk;
            botDiv.innerText = botResponse;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }
      }

      messages.push({ role: 'assistant', content: botResponse });

    } catch (err) {
      console.error(err);
      removeLoading();
      appendMessage("Sorry, er is een fout opgetreden. Probeer het later opnieuw.", 'bot');
    }
  };

  submitBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

})();
