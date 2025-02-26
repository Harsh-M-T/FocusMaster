// Function to start speech recognition
const startSpeechRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = true; // Capture continuous speech
    recognition.interimResults = false; // Only final results
  
    let transcribedText = '';
  
    // Event handler for speech recognition results
    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcribedText += event.results[i][0].transcript + ' ';
      }
    };
  
    // Event handler when speech recognition ends
    recognition.onend = () => {
      console.log('Transcribed Text:', transcribedText);
  
      // Get the search feed from storage
      chrome.storage.local.get('searchFeed', (data) => {
        const { searchFeed } = data;
        if (searchFeed) {
          // Send the transcribed text and search feed to the backend for analysis
          fetch('http://localhost:5000/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transcribedText, searchFeed }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (!data.match) {
                // Display an alert if the video does not match
                alert(data.alert);
              }
            })
            .catch((error) => {
              console.error('Error analyzing video:', error);
            });
        }
      });
    };
  
    // Start speech recognition
    recognition.start();
  
    // Stop speech recognition after 60 seconds
    setTimeout(() => {
      recognition.stop();
      console.log('Speech recognition stopped after 60 seconds.');
    }, 60000); // 60 seconds
  };
  
  // Start speech recognition when the script is injected
  startSpeechRecognition();