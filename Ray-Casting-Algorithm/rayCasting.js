function rayCasting(point, polygon) {
    let n = polygon.length,
        count = 0,
        x = point[0],
        y = point[1],
        x1, x2, y1, y2;

    for (let i = 0; i < n; ++i) {
        if (i === n - 1) {
            x1 = polygon[i][0];
            x2 = polygon[0][0];
            y1 = polygon[i][1];
            y2 = polygon[0][1];
        } else {
            x1 = polygon[i][0];
            x2 = polygon[i + 1][0];
            y1 = polygon[i][1];
            y2 = polygon[i + 1][1];
        }

        if (y < y1 !== y < y2 && x < (x2 - x1) * (y - y1) / (y2 - y1) + x1) {
            count += 1
        }
    }
    return count % 2 !== 0;
}

// export default rayCasting;