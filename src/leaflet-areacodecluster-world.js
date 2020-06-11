export default {
  isValid: function(areacode) {
    return !!areacode.match(/^[A-Z]{2}$/);
  },
  resolve: function(zoom, areacode) {
    if (zoom <= 1) return "00";
    if (zoom <= 6) return areacode;
    return "";
  }
};
