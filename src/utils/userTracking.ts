/**
 * User Tracking Utilities
 * 
 * Functions to:
 * - Generate unique user ID
 * - Track session duration
 * - Get location information
 */

/**
 * Generate or retrieve unique user ID
 * Uses localStorage to persist across sessions
 */
export const getUserId = (): string => {
  const STORAGE_KEY = 'beefree_playground_user_id';
  let userId = localStorage.getItem(STORAGE_KEY);
  
  if (!userId) {
    // Generate unique ID: timestamp + random string
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(STORAGE_KEY, userId);
  }
  
  return userId;
};

/**
 * Get session start time (stored when page loads)
 */
export const getSessionStartTime = (): number => {
  const STORAGE_KEY = 'beefree_playground_session_start';
  let startTime = localStorage.getItem(STORAGE_KEY);
  
  if (!startTime) {
    startTime = Date.now().toString();
    localStorage.setItem(STORAGE_KEY, startTime);
  }
  
  return parseInt(startTime, 10);
};

/**
 * Calculate session duration in seconds
 */
export const getSessionDuration = (): number => {
  const startTime = getSessionStartTime();
  const duration = Math.floor((Date.now() - startTime) / 1000); // seconds
  return duration;
};

/**
 * Get location information (country, city) via IP
 * Falls back to browser geolocation if available
 */
export const getLocationInfo = async (): Promise<{ country?: string; city?: string; location?: string }> => {
  try {
    // Try IP-based location service
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name || data.country_code,
        city: data.city,
        location: data.city && data.country_name 
          ? `${data.city}, ${data.country_name}` 
          : data.country_name || data.country_code || 'Unknown'
      };
    }
  } catch (err) {
    console.log('IP location service unavailable');
  }

  // Fallback: try browser geolocation
  try {
    if (navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            // Reverse geocode coordinates (simplified - would need API key)
            resolve({
              location: `Lat: ${position.coords.latitude.toFixed(2)}, Lon: ${position.coords.longitude.toFixed(2)}`
            });
          },
          () => {
            resolve({ location: 'Unknown' });
          },
          { timeout: 3000 }
        );
      });
    }
  } catch (err) {
    console.log('Geolocation unavailable');
  }

  return { location: 'Unknown' };
};

/**
 * Format date and time
 */
export const getFormattedDateTime = (): { date: string; time: string } => {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
  const time = now.toLocaleTimeString('en-US', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  return { date, time };
};

