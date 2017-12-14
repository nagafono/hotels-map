import {constants} from './constants';
import {customOverlayFactory} from "./custom-overlay";
import {DataHandler} from "./data-handler";

export class CaptionHandler {
  constructor(googleMap, elementSelector) {
    this.isCaptionShown = false;
    this.googleMap = googleMap;
    this.captionElement = document.querySelector(elementSelector);
    this.customOverlay = customOverlayFactory();
    this.dataHandler = new DataHandler();
  }

  /**
   * Inject hotel popup caption element
   * @param latLng - latitude and longitude in google maps format where caption suppose to be injected
   * @param zoneId - hotel zone id
   */
  injectCaption(latLng, zoneId) {
    if (this.isCaptionShown) {
      return;
    }
    this.isCaptionShown = true;
    this._setCaptionTextAndStyle(this.captionElement, zoneId);
    this._createCustomOverlay(this.captionElement, latLng);

    // removing flickering effect
    setTimeout(() => this.captionElement.classList.remove('hidden'), 100);
  }

  /**
   * Remove hotel popup caption from the googleMap
   */
  removeCaption() {
    this.isCaptionShown = false;
    this.captionElement.classList.add('hidden');
  }

  /**
   * Create custom overlay over the googleMap
   * @param el - overlay element
   * @param latLng - latitude and longitude in google maps format where caption suppose to be injected
   * @private
   */
  _createCustomOverlay(el, latLng) {
    const customOverlay = new this.customOverlay(el, latLng);
    customOverlay.setMap(this.googleMap);
  }

  /**
   * Set text and style for the specific hotel popup caption
   * @param el - caption element
   * @param zoneId - hotel zone id
   * @private
   */
  _setCaptionTextAndStyle(el, zoneId) {
    const zoneData = this.dataHandler.getZoneDataById(zoneId);
    let logoEl = el.querySelector('img');
    let nameEl = el.querySelector('.caption-text-name');
    let priceEl = el.querySelector('.caption-text-price');
    let durationEl = el.querySelector('.caption-text-duration');
    let paymentNotSupportedElement = el.querySelector('.caption-text-payment-not-supported');

    nameEl.innerHTML = zoneData.name;
    priceEl.innerHTML = zoneData.service_price + zoneData.currency;
    durationEl.innerHTML = 'Reception: ' + zoneData.reception_working_time;

    if (zoneData.payment_is_allowed === '0') {
      el.style.borderColor = constants.SUPPORTED_PAYMENT_COLOR;
      priceEl.style.color = constants.SUPPORTED_PAYMENT_COLOR;
      logoEl.setAttribute('src', constants.HOTEL_GREEN_ICON);
      paymentNotSupportedElement.classList.add('hidden');
    } else {
      el.style.borderColor = constants.UNSUPPORTED_PAYMENT_COLOR;
      priceEl.style.color = constants.UNSUPPORTED_PAYMENT_COLOR;
      logoEl.setAttribute('src', constants.HOTEL_GREY_ICON);
      paymentNotSupportedElement.classList.remove('hidden');
    }
  }
}