// useChatSession.js
import { useState } from 'react';
import { createChatSession, submitQuery } from '../api/apiservices';

export const useChatSession = (apiKey, externalUserId) => {
  const [sessionId, setSessionId] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const initializeSession = async () => {
    try {
      const session = await createChatSession(apiKey, externalUserId);
      setSessionId(session);
    } catch (err) {
      setError(err.message);
    }
  };

  const sendQuery = async (query) => {
    if (!sessionId) {
      setError('Session not initialized');
      return;
    }
    try {
      const queryResponse = await submitQuery(apiKey, sessionId, query);
      setResponse(queryResponse);
    } catch (err) {
      setError(err.message);
    }
  };

  return { sessionId, response, error, initializeSession, sendQuery };
};
