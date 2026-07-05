import { NextResponse } from "next/server";
import { prisma } from "@rebuildyourlife/database";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const chatbotId = resolvedParams.id;

  try {
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
    });

    if (!chatbot) {
      return new NextResponse("console.error('Chatbot not found');", {
        headers: { "Content-Type": "application/javascript" },
      });
    }

    const host = process.env.NEXT_PUBLIC_APP_URL || "https://rebuildyourlife.eu";

    const scriptContent = `
      (function() {
        if (document.getElementById('ryl-chatbot-root')) return;

        // Create widget container
        var container = document.createElement('div');
        container.id = 'ryl-chatbot-root';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '999999';
        container.style.fontFamily = 'sans-serif';
        document.body.appendChild(container);

        var isOpen = false;
        var visitorId = 'v_' + Math.random().toString(36).substr(2, 9);
        var messages = [{ role: 'assistant', content: 'Hi! Hoe kan ik je helpen?' }];

        function render() {
          container.innerHTML = '';

          // Toggle Button
          var btn = document.createElement('button');
          btn.style.width = '60px';
          btn.style.height = '60px';
          btn.style.borderRadius = '50%';
          btn.style.backgroundColor = '${chatbot.themeColor}';
          btn.style.color = 'white';
          btn.style.border = 'none';
          btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          btn.style.cursor = 'pointer';
          btn.style.fontSize = '24px';
          btn.style.display = 'flex';
          btn.style.alignItems = 'center';
          btn.style.justifyContent = 'center';
          btn.innerHTML = isOpen ? '✕' : '💬';
          btn.onclick = function() { isOpen = !isOpen; render(); };
          
          if (!isOpen) {
            container.appendChild(btn);
            return;
          }

          // Chat Window
          var windowEl = document.createElement('div');
          windowEl.style.width = '350px';
          windowEl.style.height = '500px';
          windowEl.style.backgroundColor = '#fff';
          windowEl.style.borderRadius = '16px';
          windowEl.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
          windowEl.style.display = 'flex';
          windowEl.style.flexDirection = 'column';
          windowEl.style.overflow = 'hidden';
          windowEl.style.marginBottom = '16px';

          // Header
          var header = document.createElement('div');
          header.style.backgroundColor = '${chatbot.themeColor}';
          header.style.color = 'white';
          header.style.padding = '16px';
          header.style.fontWeight = 'bold';
          header.style.fontSize = '16px';
          header.innerText = '${chatbot.name}';
          windowEl.appendChild(header);

          // Messages Area
          var messagesDiv = document.createElement('div');
          messagesDiv.style.flex = '1';
          messagesDiv.style.padding = '16px';
          messagesDiv.style.overflowY = 'auto';
          messagesDiv.style.display = 'flex';
          messagesDiv.style.flexDirection = 'column';
          messagesDiv.style.gap = '8px';
          
          messages.forEach(function(msg) {
            var bubble = document.createElement('div');
            bubble.style.padding = '10px 14px';
            bubble.style.borderRadius = '12px';
            bubble.style.maxWidth = '85%';
            bubble.style.lineHeight = '1.4';
            bubble.style.fontSize = '14px';
            
            if (msg.role === 'user') {
              bubble.style.backgroundColor = '${chatbot.themeColor}';
              bubble.style.color = '#fff';
              bubble.style.alignSelf = 'flex-end';
            } else {
              bubble.style.backgroundColor = '#f1f5f9';
              bubble.style.color = '#0f172a';
              bubble.style.alignSelf = 'flex-start';
            }
            bubble.innerText = msg.content;
            messagesDiv.appendChild(bubble);
          });
          windowEl.appendChild(messagesDiv);

          // Input Area
          var form = document.createElement('form');
          form.style.padding = '16px';
          form.style.borderTop = '1px solid #e2e8f0';
          form.style.display = 'flex';
          form.style.gap = '8px';
          form.onsubmit = function(e) {
            e.preventDefault();
            var text = input.value.trim();
            if(!text) return;
            
            messages.push({ role: 'user', content: text });
            input.value = '';
            render();

            // Auto-scroll
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            // Fetch reply
            fetch('${host}/api/chatbot/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chatbotId: '${chatbot.id}',
                visitorId: visitorId,
                messages: messages
              })
            })
            .then(res => res.json())
            .then(data => {
              if(data.reply) {
                messages.push({ role: 'assistant', content: data.reply });
                render();
                setTimeout(function() {
                  var msgsArea = document.getElementById('ryl-chatbot-root').querySelector('div > div:nth-child(2)');
                  if(msgsArea) msgsArea.scrollTop = msgsArea.scrollHeight;
                }, 50);
              }
            })
            .catch(err => console.error(err));
          };

          var input = document.createElement('input');
          input.type = 'text';
          input.placeholder = 'Typ een bericht...';
          input.style.flex = '1';
          input.style.padding = '10px 12px';
          input.style.borderRadius = '8px';
          input.style.border = '1px solid #cbd5e1';
          input.style.outline = 'none';
          
          var submitBtn = document.createElement('button');
          submitBtn.type = 'submit';
          submitBtn.innerText = '➤';
          submitBtn.style.backgroundColor = '${chatbot.themeColor}';
          submitBtn.style.color = 'white';
          submitBtn.style.border = 'none';
          submitBtn.style.borderRadius = '8px';
          submitBtn.style.padding = '0 16px';
          submitBtn.style.cursor = 'pointer';

          form.appendChild(input);
          form.appendChild(submitBtn);
          windowEl.appendChild(form);

          container.appendChild(windowEl);
          container.appendChild(btn);

          // Auto-scroll on render
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        render();
      })();
    `;

    return new NextResponse(scriptContent, {
      headers: {
        "Content-Type": "application/javascript",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600"
      },
    });

  } catch (error: any) {
    return new NextResponse("console.error('Widget load error');", {
      headers: { "Content-Type": "application/javascript" },
    });
  }
}
