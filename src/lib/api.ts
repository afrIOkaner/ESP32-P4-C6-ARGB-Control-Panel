export const sendLedState = async (payload: any) => {
  try {
    // In a real environment, this would be the ESP32 IP or relative path
    // e.g., const url = '/api/led/state';
    const url = "/api/led/state";

    // We use a placeholder console.log for the preview environment
    console.log("Sending payload to ESP32:", JSON.stringify(payload, null, 2));

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

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { success: true };
  } catch (error) {
    console.error("Failed to send LED state:", error);
    return { success: false, error };
  }
};
