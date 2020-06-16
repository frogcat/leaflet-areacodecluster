export default function(zoom, areaCode) {
  if (zoom <= 1) return "";
  if (zoom <= 6) return areaCode;
  return null;
};
