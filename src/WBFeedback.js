const Constants = require('./Constants');

class WBFeedback {
  constructor(feedback) {
    Object.assign(this, feedback);
  }

  /**
   * It takes a string as an argument, and if that string is not 'min', it adds
   * 'SizeUri' to the end of it. Then it returns an array of photos, where each
   * photo is a string that is the concatenation of the base URL for feedback
   * images, and the photo's size URI
   * @param [size=min] - The size of the image you want to get.
   * @returns An array of the photos with the size specified.
   */
  getPhotos(size = 'min') {
    size += 'SizeUri';
    return this.photos.map((photo) => Constants.URLS.IMAGES.FEEDBACK_BASE + photo[size]);
  }
}

module.exports = WBFeedback;
