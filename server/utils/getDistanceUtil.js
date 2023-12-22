// Fungsi untuk mengubah derajat ke radian
const deg2rad = (deg) => deg * (Math.PI / 180);

// Fungsi untuk menghitung jarak antara dua koordinat menggunakan formula Haversine
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius Bumi dalam kilometer(rerata radius)

  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Jarak dalam kilometer
  return parseFloat(distance.toFixed(2));
};

module.exports = getDistance;
