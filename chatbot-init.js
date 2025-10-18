(function() {
    'use strict';

    // Guard against double initialization
    if (window.__rcmChatbotInit) return;
    window.__rcmChatbotInit = true;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }

    function initChatbot() {
        try {
            // Create chatbot root container
            const root = document.createElement('div');
            root.id = 'rcm-chatbot-root';
            root.className = 'rcm-chatbot';
            document.body.appendChild(root);

            // Initialize chatbot UI
            setupChatbotUI(root);
        } catch (error) {
            console.warn('Chatbot initialization failed:', error);
            showFallbackMessage();
        }
    }

    function setupChatbotUI(root) {
        root.innerHTML = `
            <button id="rcm-chat-toggle" class="rcm-chat-toggle" aria-expanded="false" aria-controls="rcm-chat-panel" aria-label="Open chat">
                💬 Chat
            </button>
            <div id="rcm-chat-panel" class="rcm-chat-panel" role="dialog" aria-labelledby="rcm-chat-title" aria-hidden="true">
                <div class="rcm-chat-header">
                    <h2 id="rcm-chat-title">RCM Assistant</h2>
                    <button id="rcm-chat-close" class="rcm-chat-close" aria-label="Close chat">×</button>
                </div>
                <div id="rcm-chat-log" class="rcm-chat-log" role="log" aria-live="polite" aria-atomic="false">
                    <div class="rcm-quick-start">
                        <div class="rcm-quick-start-label">Quick start:</div>
                        <div class="rcm-quick-buttons">
                            <button class="rcm-quick-btn" data-message="What is RCM?">What is RCM?</button>
                            <button class="rcm-quick-btn" data-message="Tell me about Barry's writing">Barry's Writing</button>
                            <button class="rcm-quick-btn" data-message="What is Malestrum?">Malestrum</button>
                            <button class="rcm-quick-btn" data-message="How can Rutherford & Company help?">AI Consulting</button>
                        </div>
                    </div>
                </div>
                <div class="rcm-chat-input-area">
                    <label for="rcm-chat-input" class="rcm-visually-hidden">Type your message</label>
                    <input id="rcm-chat-input" class="rcm-chat-input" placeholder="Ask about RCM services..." type="text" autocomplete="off">
                    <button id="rcm-chat-send" class="rcm-chat-send" type="button">Send</button>
                </div>
            </div>
            <noscript>
                <div class="rcm-chat-fallback">
                    <a href="/contact.html">Contact us directly</a>
                </div>
            </noscript>
        `;

        // Get elements
        const toggleBtn = root.querySelector('#rcm-chat-toggle');
        const panel = root.querySelector('#rcm-chat-panel');
        const closeBtn = root.querySelector('#rcm-chat-close');
        const input = root.querySelector('#rcm-chat-input');
        const sendBtn = root.querySelector('#rcm-chat-send');
        const log = root.querySelector('#rcm-chat-log');

        // Chat state
        let isOpen = false;
        const messages = [{
            role: "system",
            content: "You are the helpful assistant for Rutherford Creative Media (RCM). RCM is a creative agency specializing in storytelling and leadership content. We help leaders and organizations tell their stories through various mediums including writing, content strategy, and creative consulting.\\n\\nKey services include:\\n- Leadership storytelling and content creation\\n- Creative writing and memoir services\\n- Strategic communications consulting\\n- Content development for executives and thought leaders\\n\\nOur platforms include Malestrum (creative works) and Rutherford & Company (consulting services).\\n\\nFor inquiries, direct users to contact Barry Rutherford at barrykarlrutherford@gmail.com or use the contact form on the website.\\n\\nBe helpful, professional, and concise. Focus on how RCM can help with storytelling and leadership communication needs."
        }];

        // Event listeners
        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', closeChat);
        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keydown', handleKeydown);

        // Quick start button listeners
        const quickBtns = root.querySelectorAll('.rcm-quick-btn');
        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                input.value = message;
                sendMessage();
            });
        });

        // Global keyboard handler
        document.addEventListener('keydown', handleGlobalKeydown);

        function toggleChat() {
            if (isOpen) {
                closeChat();
            } else {
                openChat();
            }
        }

        function openChat() {
            isOpen = true;
            panel.style.display = 'block';
            panel.setAttribute('aria-hidden', 'false');
            toggleBtn.setAttribute('aria-expanded', 'true');

            // Focus the input
            setTimeout(() => input.focus(), 100);
        }

        function closeChat() {
            isOpen = false;
            panel.style.display = 'none';
            panel.setAttribute('aria-hidden', 'true');
            toggleBtn.setAttribute('aria-expanded', 'false');

            // Return focus to toggle button
            toggleBtn.focus();
        }

        function handleKeydown(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        }

        function handleGlobalKeydown(e) {
            if (e.key === 'Escape' && isOpen) {
                closeChat();
            }

            // Trap focus within panel when open
            if (isOpen && e.key === 'Tab') {
                const focusableElements = panel.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }

        async function sendMessage() {
            const userText = input.value.trim();
            if (!userText) return;

            input.value = '';
            input.disabled = true;
            sendBtn.disabled = true;
            sendBtn.textContent = 'Sending...';

            // Add user message to log
            addMessageToLog('You', userText);
            messages.push({ role: 'user', content: userText });

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                const reply = data.reply || '';
                const assistant = { role: 'assistant', content: reply };
                messages.push(assistant);

                // Add assistant response to log
                addMessageToLog('Assistant', reply);
            } catch (error) {
                console.error('Chat error:', error);
                addMessageToLog('System', 'Sorry, the chat is temporarily unavailable. Please email us at barrykarlrutherford@gmail.com');
            } finally {
                input.disabled = false;
                sendBtn.disabled = false;
                sendBtn.textContent = 'Send';
                input.focus();
            }
        }

        function addMessageToLog(sender, content) {
            // Hide quick start buttons after first message
            const quickStart = log.querySelector('.rcm-quick-start');
            if (quickStart) {
                quickStart.style.display = 'none';
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = 'rcm-message';

            // Render markdown for assistant messages
            const renderedContent = sender === 'Assistant' ? renderMarkdown(content) : escapeHtml(content);

            messageDiv.innerHTML = `
                <div class="rcm-message-sender">${sender}:</div>
                <div class="rcm-message-content">${renderedContent}</div>
            `;
            log.appendChild(messageDiv);
            log.scrollTop = log.scrollHeight;
            return messageDiv;
        }
    }

    // Simple markdown renderer
    function renderMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Italic
            .replace(/`(.*?)`/g, '<code>$1</code>')            // Inline code
            .replace(/\n/g, '<br>')                            // Line breaks
            .replace(/- (.*?)(<br>|$)/g, '• $1$2');           // Bullet points
    }

    // HTML escape function
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }

    function showFallbackMessage() {
        const fallback = document.createElement('div');
        fallback.className = 'rcm-chat-error';
        fallback.innerHTML = `
            <div>Chat temporarily unavailable—<a href="mailto:barrykarlrutherford@gmail.com">email us</a></div>
        `;
        document.body.appendChild(fallback);

        // Auto-hide after 5 seconds
        setTimeout(() => fallback.remove(), 5000);
    }
})();