const rayCast = require('./rayCastingAlgorithm.js')
const geoJson = require('./geoJsonHandler.js')

//input 2 Koordinaten
//coordinateStart = [lat, lon]
//coordinateEnd = [lat, lon]
//durchlaufe alle in einem abstand von X punkte auf der linie zwischen start und end
//durchlaufe alle relevanten sperrzonen und schaue ob der punkt in der sperrzone liegt
//wenn ja, dann berechne eine neue route


//FH lon 11.039945, 50.984062
//Bhf lon 11.038489, 50.970533
// sqrt((fhlon-bhflon)^2 + (fhlat-bhflat)^2) = 1.4km
// länge zwischen den punkten 0,0136071

// schrittweite = 0,0001
function calculateAngle(coordinateStart, coordinateEnd) {
    return Math.atan2(coordinateEnd.lat - coordinateStart.lat, coordinateEnd.lon - coordinateStart.lon);
}

function calculateNextCoordinate(coordinate, angle, stepSize) {
    return {
        lat: coordinate.lat + stepSize * Math.sin(angle),
        lon: coordinate.lon + stepSize * Math.cos(angle)
    };
}


//https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/

// Given three collinear points p, q, r, the function checks if
// point q lies on line segment 'pr'
function onSegment(p, q, r) {
    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);


}

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p, q, r) {

    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
    // for details of below formula.
    let val = (q.y - p.y) * (r.x - q.x) -
        (q.x - p.x) * (r.y - q.y);

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
        return true;

    // Special Cases
    // p1, q1 and p2 are collinear and p2 lies on segment p1q1
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;

    // p1, q1 and q2 are collinear and q2 lies on segment p1q1
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;

    // p2, q2 and p1 are collinear and p1 lies on segment p2q2
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;

    // p2, q2 and q1 are collinear and q1 lies on segment p2q2
    if (o4 === 0 && onSegment(p2, q1, q2)) return true;

    return false; // Doesn't fall in any of the above cases
}

function intersectsLineWithPolygon(lineSegment, polygon) {

    // polygon
    // 0 ---- 1 ---- 2 ---- 3 ---- 4
    // line1 = 01
    // line2 = 12
    // line3 = 23
    // line4 = 34
    // line5 = 40


    // lineSegment
    // 0 ---- 1
    let polySegments

    for (let i = 0; i < polygon.length; i++) {
        let start
        let end
        start = {lon: polygon[i].lon, lat: polygon[i].lat}
        if (i === polygon.length - 1) {
            end = {lon: polygon[0].lon, lat: polygon[0].lat}
        } else {
            end = {lon: polygon[i + 1].lon, lat: polygon[i + 1].lat}
        }

        polySegments.push({
            start: start,
            end: end
        })
    }

    for (const polySegment in polySegments) {
        if(doIntersect(lineSegment.start, lineSegment.end, polySegment.start, polySegment.end)){
            return true
        }
    }
}

function test() {
    let p1
    let q1
    let p2
    let q2

    p1 = {x: 1, y: 1}
    q1 = {x: 10, y: 1}
    p2 = {x: 1, y: 2}
    q2 = {x: 10, y: 2}
    console.log(doIntersect(p1, q1, p2, q2))

    p1 = {x: 10, y: 1}
    q1 = {x: 0, y: 10}
    p2 = {x: 0, y: 0}
    q2 = {x: 10, y: 10}
    console.log(doIntersect(p1, q1, p2, q2))

    p1 = {x: -5, y: -5}
    q1 = {x: 0, y: 0}
    p2 = {x: 1, y: 1}
    q2 = {x: 10, y: 10}
    console.log(doIntersect(p1, q1, p2, q2))
}


test()


