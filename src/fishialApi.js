// Fishial.AI API Integration
// This file contains utility functions for integrating with the Fishial.AI API

// API configuration from environment variables
const API_CONFIG = {
  keyId: import.meta.env.VITE_FISHIAL_API_KEY,
  keySecret: import.meta.env.VITE_FISHIAL_API_SECRET,
  authUrl: import.meta.env.VITE_FISHIAL_AUTH_URL,
  apiBaseUrl: import.meta.env.VITE_FISHIAL_API_BASE_URL
};

// Get file metadata for upload
const getFileMetadata = async (file) => {
  const name = file.name;
  const mimeType = file.type || 'application/octet-stream';
  const byteSize = file.size;
  
  // Calculate MD5 checksum
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('MD5', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Convert to base64 like the API expects
  const binaryString = String.fromCharCode.apply(null, hashArray);
  const checksum = btoa(binaryString);
  
  return { name, mimeType, byteSize, checksum };
};

// Get authentication token
export const getAuthToken = async () => {
  try {
    const response = await fetch(API_CONFIG.authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: API_CONFIG.keyId,
        client_secret: API_CONFIG.keySecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw new Error('Failed to authenticate with Fishial.AI API');
  }
};

// Get upload URL for image
export const getUploadUrl = async (file, authToken) => {
  try {
    const metadata = await getFileMetadata(file);
    
    const response = await fetch(`${API_CONFIG.apiBaseUrl}/recognition/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        blob: {
          filename: metadata.name,
          content_type: metadata.mimeType,
          byte_size: metadata.byteSize,
          checksum: metadata.checksum,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Upload URL request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting upload URL:', error);
    throw new Error('Failed to get upload URL');
  }
};

// Upload image to cloud
export const uploadImage = async (file, uploadData) => {
  try {
    const { url, headers } = uploadData['direct-upload'];
    
    const uploadHeaders = {
      'Content-Disposition': headers['Content-Disposition'],
      'Content-MD5': headers['Content-MD5'],
      'Content-Type': '', // Intentionally empty as per API docs
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers: uploadHeaders,
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Image upload failed: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

// Request fish recognition
export const recognizeFish = async (signedId, authToken) => {
  try {
    const response = await fetch(
      `${API_CONFIG.apiBaseUrl}/recognition/image?q=${encodeURIComponent(signedId)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Recognition request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error recognizing fish:', error);
    throw new Error('Failed to recognize fish');
  }
};

// Complete fish identification process
export const identifyFish = async (imageFile, onProgress) => {
  try {
    // Step 1: Get authentication token
    onProgress && onProgress('Getting authentication token...');
    const authToken = await getAuthToken();

    // Step 2: Get upload URL
    onProgress && onProgress('Preparing image upload...');
    const uploadData = await getUploadUrl(imageFile, authToken);

    // Step 3: Upload image
    onProgress && onProgress('Uploading image...');
    await uploadImage(imageFile, uploadData);

    // Step 4: Request fish recognition
    onProgress && onProgress('Analyzing fish...');
    const recognitionResult = await recognizeFish(uploadData['signed-id'], authToken);

    onProgress && onProgress('Complete!');
    return recognitionResult;
  } catch (error) {
    console.error('Fish identification error:', error);
    throw error;
  }
};

// Send feedback for recognition result
export const sendFeedback = async (feedbackId, polygonId, feedbackType, suggestedName, authToken) => {
  try {
    const payload = {
      data: {
        type: 'ai-feedback-entries',
        attributes: {
          'polygon-id': polygonId,
          'feedback-type': feedbackType, // 'Agree', 'Disagree', or 'Unknown'
        },
      },
    };

    if (suggestedName && feedbackType === 'Disagree') {
      payload.data.attributes['suggested-name'] = suggestedName;
    }

    const response = await fetch(`${API_CONFIG.apiBaseUrl}/ai-feedbacks/${feedbackId}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Feedback submission failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending feedback:', error);
    throw new Error('Failed to send feedback');
  }
};
