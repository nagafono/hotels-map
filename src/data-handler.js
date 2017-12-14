import hotelZones from './hotel-zones';

export class DataHandler {
  constructor() {

  }

  /**
   * Get hotel zone data by zone id from provided json
   * @param zoneId - zone id
   * @return {Object} - zone data
   * @private
   */
  getZoneDataById(zoneId) {
    let data = {};

    // "for" loop was chosen to have an opportunity to break from the loop
    for (let zone of hotelZones.location_data.zones) {
      if (zone.id === zoneId) {
        data = zone;
        break;
      }
    }
    return data;
  }

  /**
   * Check if the payment is allowed in current zone
   * @param zoneId - zone data
   * @return {boolean}
   */
  isPaymentAllowed(zoneId) {
    let zone = this.getZoneDataById(zoneId);
    return zone.payment_is_allowed === '0';
  }

  /**
   * Get default bounds
   * @return {Object} - object with default bounds (west, east, north, south)
   */
  getDefaultBounds() {
    return hotelZones.location_data.bounds;
  }

  /**
   * Get the data about the zones
   * @return {Object} - object with he data about the zones
   */
  getZonesData() {
    return hotelZones.location_data.zones;
  }

  /**
   * Get current location
   * @return {Object} - object with latitude and longitude of current location
   */
  getCurrentLocationCoordinates() {
    return this.convertStringToCoordinates(hotelZones.current_location);
  }

  /**
   * Convert string to latitude and longitude.
   * Expected to be separated with comma.
   * @param string - string with coordinates
   * @return {object} - object with 2 properties: latitude and longitude
   */
  convertStringToCoordinates(string) {
    let coordinates = string.trim().split(/[\s,]+/);
    return {
      lat: parseFloat(coordinates[0]),
      lng: parseFloat(coordinates[1])
    };
  }
}