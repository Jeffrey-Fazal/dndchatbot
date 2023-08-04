async function getCompletion(promptText) {
    const spinner = document.getElementById('spinner');
    spinner.style.display = "block"; // Show spinner
    try {
        const response = await fetch('/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: promptText })
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();

        // Display user's message
        displayMessage('User', promptText);

        // Display model's response
        displayMessage('Assistant', data.completion);

        // Update chat history (ensure chatHistory is declared elsewhere in your code)
        chatHistory = data.chatHistory;
    spinner.style.display = "none"; // Hide spinner

    } catch (error) {
        console.error("Error fetching completion:", error);
        displayMessage('Assistant', 'Sorry, I encountered an error.');
    spinner.style.display = "none"; // Hide spinner
    }
}

function displayMessage(role, message) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    
    // Sanitize the message to prevent potential XSS attacks
    const sanitizedMessage = document.createTextNode(`${role}: ${message}`);
    
    messageDiv.className = role.toLowerCase();
    messageDiv.appendChild(sanitizedMessage);
    chatBox.appendChild(messageDiv);

    // Auto-scroll to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}
