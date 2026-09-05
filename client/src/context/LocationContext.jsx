import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

// Default coordinates: Noida / Delhi NCR
const DEFAULT_LOCATION = {
  latitude: 28.6270,
  longitude: 77.3726,
  city: 'Noida',
  formattedAddress: 'Sector 62, Noida, NCR',
  radiusKm: 10
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('lsf_location');

      if (saved) {
        return JSON.parse(saved);
      }

      return DEFAULT_LOCATION;
    } catch (error) {
      console.error('Failed to load saved location:', error);
      return DEFAULT_LOCATION;
    }
  });

  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);

  // Save location whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('lsf_location', JSON.stringify(location));
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  }, [location]);

  // Convert latitude/longitude into city and address
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            Accept: 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          `Reverse geocoding failed with status ${response.status}`
        );
      }

      const data = await response.json();

      console.log('REVERSE GEOCODING RESULT:', data);

      return data;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  // Get user's current browser location
  const requestBrowserLocation = () => {
    console.log('LOCATION BUTTON FUNCTION CALLED');

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errorMessage =
          'Geolocation is not supported by your browser';

        console.error(errorMessage);

        setGeoError(errorMessage);
        reject(errorMessage);
        return;
      }

      console.log('GEOLOCATION API AVAILABLE');

      setGeoLoading(true);
      setGeoError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            console.log('LOCATION SUCCESS');

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log('Latitude:', latitude);
            console.log('Longitude:', longitude);

            // Get actual address from coordinates
            const addressData = await getAddressFromCoordinates(
              latitude,
              longitude
            );

            const address = addressData?.address;

            // Nominatim can return different fields depending on location
            const city =
              address?.city ||
              address?.town ||
              address?.municipality ||
              address?.county ||
              'Your Location';

            const formattedAddress =
              addressData?.display_name ||
              'Current Geolocation';

            console.log('DETECTED CITY:', city);
            console.log('DETECTED ADDRESS:', formattedAddress);

            const newLocation = {
              ...location,
              latitude,
              longitude,
              city,
              formattedAddress
            };

            setLocation(newLocation);
            setGeoLoading(false);

            resolve(newLocation);
          } catch (error) {
            console.error(
              'Error while processing detected location:',
              error
            );

            // GPS worked, so even if reverse geocoding fails,
            // keep the actual coordinates.
            const newLocation = {
              ...location,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              city: 'Your Location',
              formattedAddress: 'Current Geolocation'
            };

            setLocation(newLocation);
            setGeoLoading(false);

            resolve(newLocation);
          }
        },

        (error) => {
          console.error('LOCATION ERROR');
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);

          setGeoLoading(false);

          let errorMessage = 'Failed to get location';

          if (error.code === error.PERMISSION_DENIED) {
            errorMessage =
              'Location permission denied. Please allow location access.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage =
              'Location information is unavailable.';
          } else if (error.code === error.TIMEOUT) {
            errorMessage =
              'Location request timed out. Please try again.';
          }

          setGeoError(errorMessage);
          reject(errorMessage);
        },

        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    });
  };

  // Update search radius
  const updateRadius = (newRadiusKm) => {
    setLocation((previousLocation) => ({
      ...previousLocation,
      radiusKm: Number(newRadiusKm)
    }));
  };

  // Manually set a city location
  const setCityLocation = (cityName, lat, lng) => {
    setLocation((previousLocation) => ({
      ...previousLocation,
      city: cityName,
      formattedAddress: `${cityName}, India`,
      latitude: lat,
      longitude: lng
    }));

    setGeoError(null);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        geoLoading,
        geoError,
        requestBrowserLocation,
        updateRadius,
        setCityLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);