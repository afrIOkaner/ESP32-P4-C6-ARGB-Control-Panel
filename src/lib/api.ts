export const sendConfig = async (payload: any) => {
  try {
    const url = '/api/config';
    console.log('Sending config to ESP32:', JSON.stringify(payload, null, 2));
    
    /*
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
    */
    
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true };
  } catch (error) {
    console.error('Failed to send config:', error);
    return { success: false, error };
  }
};

export const sendState = async (payload: any) => {
  try {
    const url = '/api/state';
    console.log('Sending state to ESP32:', JSON.stringify(payload, null, 2));
    
    /*
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
    */
    
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true };
  } catch (error) {
    console.error('Failed to send state:', error);
    return { success: false, error };
  }
};
