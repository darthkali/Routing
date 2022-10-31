const width = 512;
const height = 512;
const polygon = [[223, 431], [50, 176], [136, 50], [400, 50], [500, 176], [500, 400], [400, 500], [200, 500]];
// const polygon = [[225, 431], [50, 176], [136, 19], [225, 158], [314, 19], [400, 176], [225, 431]]
const redColor = [255, 0, 0];
const greenColor = [0, 255, 0];
const pointSize = 5;

function setup() {
    createCanvas(width, height);
    drawPolygon(polygon);
noLoop();
}
function draw() {
    //colorPolygon(polygon);
    noFill();
    stroke(255, 255, 0);
    noStroke();
    //stroke color
    drawPolygon(polygon);

    colorPolygon(polygon);
    // if(rayCasting([mouseX, mouseY], polygon)){
    //     fill(greenColor);
    //     ellipse(mouseX, mouseY, pointSize, pointSize);
    // }else{
    //     fill(redColor);
    //     ellipse(mouseX, mouseY, pointSize, pointSize);
    // }
}

function colorPolygon(polygon) {
    for (let x = 0; x < width/10; x++) {
        for (let y = 0; y < height/10; y++) {
            let waypoint = [x*10, y*10];
            if (rayCasting(waypoint, polygon)) {
                fill(greenColor);
                ellipse(waypoint[0], waypoint[1], pointSize, pointSize);
            } else {
                fill(redColor);
                ellipse(waypoint[0], waypoint[1], pointSize, pointSize);
            }
        }
        j = 0
    }
}

function drawPolygon(polygon) {
    beginShape();
    for (let i = 0; i < polygon.length; i++) {
        vertex(polygon[i][0], polygon[i][1]);
    }
    endShape(CLOSE);
}

function rayCasting(point, polygon) {
    let n = polygon.length,
        count = 0,
        x = point[0],
        y = point[1],
        x1, x2, y1, y2;

    for (let i = 0; i < n ; ++i) {
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



