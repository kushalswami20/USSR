// Function to create a chat session
export async function createChatSession(apiKey, externalUserId) {
    const response = await fetch('https://api.on-demand.io/chat/v1/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        pluginIds: [],
        externalUserId: externalUserId
      })
    });
  
    const data = await response.json();
    return data.data.id; // Extract session ID
  }
  
  // Function to submit a query using the session ID
  export async function submitQuery(apiKey, sessionId, query) {
    const response = await fetch(`https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        endpointId: 'predefined-openai-gpt4o',
        query: query,
        pluginIds: ['plugin-1729879308'],
        responseMode: 'sync'
      })
    });
    console.log("Response status:", response.status);
    if (!response.ok) {
        console.error("API request failed with status:", response.status);
        throw new Error(`Failed to submit query, status code: ${response.status}`);
      }


    const data = await response.json();
    console.log("Data received from API:", data); 
    return data;
  }
  
//   // Example usage
//   (async () => {
//     const apiKey = '<replace_api_key>';
//     const externalUserId = '<replace_external_user_id>';
//     const query = 'Put your query here';
  
//     try {
//       const sessionId = await createChatSession(apiKey, externalUserId);
//       const response = await submitQuery(apiKey, sessionId, query);
//       console.log(response);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   })();