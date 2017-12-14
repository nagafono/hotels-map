import './styles/style.scss';
import HotelMap from './hotel-map'

// googleMap callback initialization suppose to be done
// in the global scope and before google api is declared
window.initMap = () => {
  const el = document.querySelector('.map');
  const map = new google.maps.Map(el, {
    center: {lat: 0, lng: 0},
    zoom: 2
  });
  const hotelMap = new HotelMap(map);
  hotelMap
    .setCurrentLocationMarker()
    .setHotels()
    .setViewport();
};
