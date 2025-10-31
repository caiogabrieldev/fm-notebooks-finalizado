let API_URL;

if (location.hostname == "localhost") {
  API_URL = "http://localhost:80"
} else {
  API_URL = "http://72.61.35.121:80"
}
const chatbotBtn = document.querySelector('.chatbot-fixed');
const chatbotWindow = document.querySelector('.chatbot-window');
const chatbotOverlay = document.querySelector('.chatbot-overlay');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotInput = document.querySelector('.chatbot-input');
const chatbotSend = document.querySelector('.chatbot-send');
const chatbotMessages = document.querySelector('.chatbot-messages');
const quickActionBtns = document.querySelectorAll('.quick-action-btn');


function toggleChatbot() {
  const isOpen = chatbotWindow.classList.contains('active');

  if (isOpen) {
    closeChatbot();
  } else {
    openChatbot();
  }
}

function openChatbot() {
  chatbotWindow.classList.add('active');
  chatbotOverlay.classList.add('active');
  chatbotBtn.setAttribute('aria-expanded', 'true');
  chatbotWindow.setAttribute('aria-hidden', 'false');
  chatbotInput.focus();
}

function closeChatbot() {
  chatbotWindow.classList.remove('active');
  chatbotOverlay.classList.remove('active');
  chatbotBtn.setAttribute('aria-expanded', 'false');
  chatbotWindow.setAttribute('aria-hidden', 'true');
}


function addMessage(content, isBot = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;

  const currentTime = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${isBot ? 'robot' : 'user'}"></i>
            </div>
            <div class="message-content">
                <p>${content}</p>
                <span class="message-time">${currentTime}</span>
            </div>
        `;

  chatbotMessages.appendChild(messageDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}


function sendMessage() {
  const message = {
    message: chatbotInput.value
  }
  if (message) {
    addMessage(message.message, false);
    chatbotInput.value = '';

    fetch(API_URL + '/perguntar-assistente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
      .then(res => res.json())
      .then(data =>
        (addMessage(data.msg, true))
      )
      .catch(err => console.error('Erro:', err));


  }




}



chatbotBtn.addEventListener('click', toggleChatbot);
chatbotClose.addEventListener('click', closeChatbot);
chatbotOverlay.addEventListener('click', closeChatbot);
chatbotSend.addEventListener('click', sendMessage);

chatbotInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});


quickActionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const message = btn.getAttribute('data-message');
    addMessage(message, false);

    setTimeout(() => {
      addMessage('Entendi! Vou conectá-lo com um especialista que pode ajudá-lo melhor. Aguarde um momento.', true);
    }, 1000);
  });
});


document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && chatbotWindow.classList.contains('active')) {
    closeChatbot();
  }
});