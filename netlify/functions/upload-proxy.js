// netlify/functions/upload-proxy.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Parse the multipart form data
  const boundary = event.headers['content-type'].split('boundary=')[1];
  if (!boundary) {
    return { statusCode: 400, body: 'Invalid form data' };
  }

  // Forward the request to Craftly API
  try {
    const response = await fetch('https://hello.craftlyrobot.com/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        // Forward any auth headers if needed
        ...(event.headers.authorization && { 'Authorization': event.headers.authorization })
      },
      body: event.body
    });

    const data = await response.json();
    
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
