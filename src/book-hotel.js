export class BookHotel {
  constructor(googleMap, elementSelector) {
    this.googleMap = googleMap;
    this.bookHotelButtonEl = document.querySelector(elementSelector);
    this._bookHotelButtonListener();
    this.isBookHotelButtonActive = false;
  }

  /**
   * Click listener for book hotel button
   * @private
   */
  _bookHotelButtonListener() {
    this.bookHotelButtonEl.addEventListener('click', () => {
      if (this.isBookHotelButtonActive) {
        alert('Work in progress!');
      }
    });
  }

  /**
   * Activate book hotel button
   */
  activateBookHotelButton() {
    this.isBookHotelButtonActive = true;
    this.bookHotelButtonEl.classList.add('book-hotel-button-active');
  }

  /**
   * Deactivate book hotel button
   */
  deactivateBookHotelButton() {
    this.isBookHotelButtonActive = false;
    this.bookHotelButtonEl.classList.remove('book-hotel-button-active');
  }
}