// utils/extractCoordinates.js
function extractCoordinatesFromURL(url) {
    // Match something like @21.1458,79.0882 or !3d21.1458!4d79.0882
    const regex1 = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const regex2 = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;

    let match = url.match(regex1);
    if (match) return [parseFloat(match[2]), parseFloat(match[1])]; // [lng, lat]

    match = url.match(regex2);
    if (match) return [parseFloat(match[2]), parseFloat(match[1])]; // [lng, lat]

    return null;
}

module.exports = extractCoordinatesFromURL;
