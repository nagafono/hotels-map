/**
 * Initialization for google maps overlay
 * @return {customOverlay}
 */
export function customOverlayFactory() {
  // for initialization we need to keep "this" from internal scope
  const customOverlay = function(el, latlng) {
    this.element = el;
    this.latlng = latlng;
  };

  customOverlay.prototype = new google.maps.OverlayView();
  customOverlay.prototype.draw = function () {
    let panes = this.getPanes();
    let point = this.getProjection().fromLatLngToDivPixel(this.latlng);
    panes.overlayImage.appendChild(this.element);
    this.element.style.left = point.x + 'px';
    this.element.style.top = point.y + 'px';
  };

  return customOverlay;
}