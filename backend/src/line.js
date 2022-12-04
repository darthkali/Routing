//https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/

// Given three collinear points p, q, r, the function checks if
// point q lies on line segment 'pr'
function onSegment(p, q, r) {
    return q.lon <= Math.max(p.lon, r.lon) && q.lon >= Math.min(p.lon, r.lon) &&
        q.lat <= Math.max(p.lat, r.lat) && q.lat >= Math.min(p.lat, r.lat);
}

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p, q, r) {

    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
    // for details of below formula.
    let val = (q.lat - p.lat) * (r.lon - q.lon) -
        (q.lon - p.lon) * (r.lat - q.lat);

    if (val === 0) return 0; // collinear

    return (val > 0) ? 1 : 2; // clock or counterclock wise
}

// The main function that returns true if line segment 'p1q1'
// and 'p2q2' intersect.
function doIntersect(p1, q1, p2, q2) {
    // Find the four orientations needed for general and
    // special cases
    let o1 = orientation(p1, q1, p2);
    let o2 = orientation(p1, q1, q2);
    let o3 = orientation(p2, q2, p1);
    let o4 = orientation(p2, q2, q1);

    // General case
    if (o1 !== o2 && o3 !== o4)
        return false; //true

    // Special Cases
    if (o1 === 0 && onSegment(p1, p2, q1)) { // p1, q1 and p2 are collinear and p2 lies on segment p1q1
        return true;
    } else if (o2 === 0 && onSegment(p1, q2, q1)) { // p1, q1 and q2 are collinear and q2 lies on segment p1q1
        return true;
    } else if (o3 === 0 && onSegment(p2, p1, q2)) {  // p2, q2 and p1 are collinear and p1 lies on segment p2q2
        return true;
    } else if (o4 === 0 && onSegment(p2, q1, q2)) { // p2, q2 and q1 are collinear and q1 lies on segment p2q2
        return true;
    }
    return true;  //false // Doesn't fall in any of the above cases
}

function createLineSegmentWithCoordinates(start, end) {
    console.log(start, end)
    return {
        "start": {"lon": start.lon, "lat": start.lat},
        "end": {"lon": end.lon, "lat": end.lat}
    }
}

module.exports = {doIntersect, createLineSegmentWithCoordinates}