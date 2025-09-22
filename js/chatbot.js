// HawkSpine Chatbot Configuration
class HawkSpineChatbot {
  constructor() {
    this.messagesDiv = document.getElementById('chat-log');
    this.userInput = document.getElementById('user-input');
    this.sendBtn = document.getElementById('send-btn');
    this.loader = document.getElementById('loader');
    this.chatContainer = document.querySelector('.chat-container');
    
    this.init();
  }

  init() {
    // Welcome message
    this.appendMessage("Hello! I am your HawkSpine support assistant. Ask me anything about HawkSpine's products, usage, or support. I can answer you in any language.", 'bot');

    // Event listeners
    this.sendBtn.onclick = () => this.sendMessage();
    this.userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg ' + sender;
    msgDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'Bot'}:</strong> ${text}`;
    this.messagesDiv.appendChild(msgDiv);
    this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
    
    // Animation halo when bot responds
    if(sender === 'bot' && this.chatContainer) {
      this.chatContainer.classList.remove('halo');
      void this.chatContainer.offsetWidth; // force reflow
      this.chatContainer.classList.add('halo');
      setTimeout(() => this.chatContainer.classList.remove('halo'), 1200);
    }
  }

  async sendMessage() {
    const text = this.userInput.value.trim();
    if (!text) return;
    
    this.appendMessage(text, 'user');
    this.userInput.value = '';
    this.sendBtn.disabled = true;
    this.loader.style.display = 'flex';

    try {
      // Use Netlify function
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        this.appendMessage(data.reply, 'bot');
      } else {
        throw new Error('Backend API not available');
      }
    } catch (e) {
      console.error('Error calling backend API:', e);
      // Fallback to predefined responses
      const fallbackResponse = this.getFallbackResponse(text);
      this.appendMessage(fallbackResponse, 'bot');
    }
    
    this.loader.style.display = 'none';
    this.sendBtn.disabled = false;
  }


  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Price related questions
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('prix')) {
      return "For pricing information, please contact us directly at contact@hawkcell.com or call +33 4 87 25 55 85. We'll provide you with a personalized quote based on your specific needs.";
    }
    
    // Compatibility questions
    if (lowerMessage.includes('compatibility') || lowerMessage.includes('compatible') || lowerMessage.includes('mri') || lowerMessage.includes('ct')) {
      return "HawkSpine is 100% compatible with all MRI and CT scanners. It works with tunnel diameters ≥ 60 cm and magnetic fields ≥ 0.5 T. The device is made from non-magnetic materials and produces no artifacts on medical images.";
    }
    
    // Installation questions
    if (lowerMessage.includes('installation') || lowerMessage.includes('setup') || lowerMessage.includes('install')) {
      return "HawkSpine is designed for easy installation. Our technical team provides comprehensive training and support. The device requires minimal setup and can be quickly integrated into your existing workflow.";
    }
    
    // Support questions
    if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('aide')) {
      return "Our support team is here to help! You can reach us at contact@hawkcell.com or call +33 4 87 25 55 85. We provide technical support, training, and maintenance services for all HawkSpine products.";
    }
    
    // Warranty questions
    if (lowerMessage.includes('warranty') || lowerMessage.includes('garantie') || lowerMessage.includes('guarantee')) {
      return "HawkSpine comes with a comprehensive warranty. For specific warranty terms and conditions, please contact our support team at contact@hawkcell.com.";
    }
    
    // Shipping questions
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('livraison')) {
      return "We ship worldwide! Delivery times and costs vary by location. For specific shipping information to your region, please contact us at contact@hawkcell.com with your location details.";
    }
    
    // Training questions
    if (lowerMessage.includes('training') || lowerMessage.includes('formation') || lowerMessage.includes('learn')) {
      return "We provide comprehensive training for all HawkSpine users. This includes MRI safety basics, patient positioning skills, and coil configuration usage. Contact us to schedule training sessions.";
    }
    
    // Materials questions
    if (lowerMessage.includes('materials') || lowerMessage.includes('materiaux') || lowerMessage.includes('construction')) {
      return "HawkSpine is manufactured from premium medical-grade materials including high-grade POM-C (Polyoxymethylene copolymer), medical-grade Plexiglas (PMMA), and non-magnetic components for optimal safety and durability.";
    }
    
    // Hygiene questions
    if (lowerMessage.includes('hygiene') || lowerMessage.includes('cleaning') || lowerMessage.includes('nettoyage') || lowerMessage.includes('sterilization')) {
      return "HawkSpine is designed for easy cleaning and sterilization. It features quick disassembly, smooth surfaces, washable parts, and chemical resistance to medical-grade disinfection products.";
    }
    
    // Veterinary questions
    if (lowerMessage.includes('veterinary') || lowerMessage.includes('veterinaire') || lowerMessage.includes('animal')) {
      return "HawkSpine is designed exclusively for veterinary use. It's CE-compliant and specifically developed for veterinary MRI and CT imaging procedures. Not intended for human use.";
    }
    
    // Technical specifications
    if (lowerMessage.includes('specifications') || lowerMessage.includes('specs') || lowerMessage.includes('technical')) {
      return "HawkSpine features adjustable components, dual support system, height adjustment range, and secure locking mechanisms. For detailed technical specifications, visit our Technical Specifications page or contact our team.";
    }
    
    // Default response
    return "Thank you for your question! For detailed information about HawkSpine, please contact our support team at contact@hawkcell.com or call +33 4 87 25 55 85. We're here to help with all your veterinary imaging needs.";
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  new HawkSpineChatbot();
});