export class Polygones {
  constructor(googleMap) {
    this.googleMap = googleMap;
  }

  /**
   * Create custom polygon on the googleMap
   * @param paths - coordinates in google maps format
   * @param color - polygon area color
   */
  createPolygon(paths, color) {
    let polygon = new google.maps.Polygon({
      paths: paths,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35
    });
    polygon.setMap(this.googleMap);
    return polygon;
  }

  /**
   * hide polygon on google map
   * @param polygon
   */
  hidePolygon(polygon) {
    this._modifyPolygonStyle(polygon, 0, 0);
  }

  /**
   * show/normalize polygon on google map
   * @param polygon
   */
  blurPolygon(polygon) {
    this._modifyPolygonStyle(polygon, 2, 0.35);
  }

  /**
   * highlight polygon on google map
   * @param polygon
   */
  focusPolygon(polygon) {
    this._modifyPolygonStyle(polygon, 4, 0.6);
  }

  /**
   * Modify polygon style
   * @param polygon
   * @param strokeWeight - border size
   * @param fillOpacity - opacity
   * @private
   */
  _modifyPolygonStyle(polygon, strokeWeight, fillOpacity) {
    polygon.setOptions({
      strokeWeight: strokeWeight,
      fillOpacity: fillOpacity
    });
  }
}