String.prototype.supplant = function (str) {
  return this.replace(/{([^{}]*)}/g, function (a, b) {
    var r = str[b];

    return typeof r === 'string' || typeof r === 'number' ? r : a;
  });
}

var toBase64 = function (image) {
  return image.toDataURL('image/jpeg').replace('data:image/jpeg;base64,', '');
};