export default {
  isValid: function(areacode) {
    return !!areacode.match(/^[0-9]{5}$/);
  },
  resolve: function(zoom, areacode) {
    if (zoom <= 4) return "00000";
    if (zoom <= 8) return areacode.replace(/[0-9]{3}$/, "000");
    if (zoom <= 12) return areacode;
    return "";
  }
};
