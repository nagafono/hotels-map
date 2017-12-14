import {constants} from './constants';
import {CaptionHandler} from "./caption-handler";
import {BookHotel} from "./book-hotel";
import {DataHandler} from "./data-handler";
import {Polygones} from "./polygones";

class HotelMap {
  constructor(googleMap) {
    this.googleMap = googleMap;
    this.hotelPolygones = {};
    this.bookHotel = new BookHotel(this.googleMap, '.book-hotel-button');
    this.caption = new CaptionHandler(this.googleMap, '.caption');
    this.polygones = new Polygones(this.googleMap);
    this.dataHandler = new DataHandler();
    this.activePolygonId = undefined;

    this._addFilterButtonListener('.filter');
    this.isFilterOn = false;

    this.mainMarker = undefined;
    this._handleBrowserResize();
  }

  /**
   * Set viewport by given coordinates from hotel-zones.js
   */
  setViewport() {
    const defaultBounds = this.dataHandler.getDefaultBounds();
    const northEast = new google.maps.LatLng(defaultBounds.north, defaultBounds.east);
    const southWest = new google.maps.LatLng(defaultBounds.south, defaultBounds.west);
    const currentBounds = new google.maps.LatLngBounds(southWest, northEast);
    this.googleMap.fitBounds(currentBounds);

    return this;
  }

  /**
   * Set the marker of the current location
   */
  setCurrentLocationMarker() {
    const coordinates = this.dataHandler.getCurrentLocationCoordinates();
    this.mainMarker = this.setMarker(coordinates.lat, coordinates.lng, true, constants.BED_ICON);
    this._currentLocationMarkerListener(this.mainMarker);
    return this;
  }

  /**
   * Set a marker on the googleMap
   * @param latitude - expected marker latitude
   * @param longitude - expected marker longitude
   * @param [draggable] - true, if marker suppose to be draggable
   * @param [icon] - custom marker icon image
   */
  setMarker(latitude, longitude, draggable = false, icon = '') {
    return new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: this.googleMap,
      draggable: draggable,
      icon : icon
    });
  }

  /**
   * Set hotel zones
   */
  setHotels() {
    const hotelData = this.dataHandler.getZonesData();

    hotelData.forEach((hotelZone) => {
      const primaryColor = this.dataHandler.isPaymentAllowed(hotelZone.id)
        ? constants.SUPPORTED_PAYMENT_COLOR
        : constants.UNSUPPORTED_PAYMENT_COLOR;

      let polygonPaths = hotelZone.polygon
        .split(',')
        .map(polygonLocation => this.dataHandler.convertStringToCoordinates(polygonLocation));

      this.hotelPolygones[hotelZone.id] = this.polygones.createPolygon(polygonPaths, primaryColor);
    });

    return this;
  }

  /**
   * Handle with dragging of current location marker
   * @param marker - google maps marker object
   * @private
   */
  _currentLocationMarkerListener(marker) {
    google.maps.event.addListener(marker, 'drag', (e) => {
      const previousPolygonId = this.activePolygonId;

      // find current polygon under the marker
      this.activePolygonId = Object.keys(this.hotelPolygones)
        .find(id => google.maps.geometry.poly.containsLocation(e.latLng, this.hotelPolygones[id]));

      // clean up if there is no polygons under the marker
      if (!this.activePolygonId) {
        this.caption.removeCaption();
        this.bookHotel.deactivateBookHotelButton();

        // remove highlighting from polygon which was escaped
        if (previousPolygonId && !this._isPolygonHiddenByFilter(previousPolygonId)) {
          this.polygones.blurPolygon(this.hotelPolygones[previousPolygonId]);
        }
        return;
      }

      // if payment is allowed in polygon, activate start button
      if (this.dataHandler.isPaymentAllowed(this.activePolygonId)) {
        this.bookHotel.activateBookHotelButton();
      }

      // if polygon is not hidden by filter, highlight it
      if (!this._isPolygonHiddenByFilter(this.activePolygonId)) {
        this.caption.injectCaption(e.latLng, this.activePolygonId);
        this.polygones.focusPolygon(this.hotelPolygones[this.activePolygonId]);
      }
    });
  }

  /**
   * Check if polygon is hidden by filter
   * @return {boolean} - true, if hidden
   * @private
   */
  _isPolygonHiddenByFilter(polygonId) {
    this.dataHandler.isPaymentAllowed(polygonId);
    return this.isFilterOn && !this.dataHandler.isPaymentAllowed(polygonId);
  }

  /**
   * Add filter listener button to the googleMap
   * @param elementSelector
   * @private
   */
  _addFilterButtonListener(elementSelector) {
    this.filterButton = document.querySelector(elementSelector);
    this.filterButton.addEventListener('click', () => {
      this.isFilterOn = !this.isFilterOn;
      const hotelData = this.dataHandler.getZonesData();

      hotelData.forEach((hotelZone) => {
        if (!this.dataHandler.isPaymentAllowed(hotelZone.id)) {
          if (this.isFilterOn) {
            this.polygones.hidePolygon(this.hotelPolygones[hotelZone.id]);
          } else {
            this.polygones.blurPolygon(this.hotelPolygones[hotelZone.id])
          }
        }
      });
    });
  }

  /**
   * Center map around the marker on window resize
   * @private
   */
  _handleBrowserResize() {
    google.maps.event.addDomListener(window, 'resize', () => {
      const markerPosition = this.mainMarker.getPosition();
      this.googleMap.setCenter(markerPosition);
    });
  }
}

export default HotelMap;