import { useRef, useEffect } from "react";

const GoogleMap = ({ lat, lng }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize the map
    const mapOptions = {
      center: { lat, lng },
      zoom: 14,
    };
    const map = new window.google.maps.Map(mapRef.current, mapOptions);

    new window.google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: "Hotel Location",
    });
  }, [lat, lng]);

  return <div ref={mapRef} style={{ height: "400px" }}></div>;
};

export default GoogleMap;
