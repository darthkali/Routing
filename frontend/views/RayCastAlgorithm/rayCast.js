// import rayCastingAlgorithm from '../../backend/src/rayCastingAlgorithm.js';
// import axios from "/../../node_modules/axios/lib/axios.js";
// import axios from "/frontend/node_modules/axios/lib/axios.js";
// const axios = require("axios")
// import axios from 'axios';


const width = 600;
const height = 512;
const polygon = [[400, 431], [50, 176], [136, 50], [150, 300], [400, 50], [300, 500], [500, 176], [300, 400], [400, 480], [200, 500], [100, 450]];
// const polygon = [[223, 431], [50, 176], [136, 50], [400, 50], [500, 176], [500, 400], [400, 500], [200, 500]];
// const polygon = [[225, 441], [50, 186], [136, 29], [225, 168], [314, 29], [400, 186], [225, 441]]
const redColor = [255, 0, 0];
const greenColor = [0, 255, 0];
const pointSize = 5;

window.setup = function () {
    createCanvas(width, height);
    drawPolygon(polygon);
    noStroke();
    colorPolygon(polygon);
    labelPolygonPoints(polygon);
    noLoop();
}

async function colorPolygon(polygon) {
    for (let x = 0; x < width / 10; x++) {
        for (let y = 0; y < height / 10; y++) {
            let waypoint = [x * 10, y * 10];

            await axios.get('http://localhost:3000/calcRayCasting', {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                if (response.data.result) {
                    fill(greenColor);
                } else {
                    fill(redColor);
                }
                ellipse(waypoint[0], waypoint[1], pointSize, pointSize);
            })
        }
    }
}

function drawPolygon(polygon) {
    beginShape();
    for (let i = 0; i < polygon.length; i++) {
        vertex(polygon[i][0], polygon[i][1]);
    }
    endShape(CLOSE);
}

function labelPolygonPoints(polygon) {
    let textSizeVar = 10
    let labelHeight = textSizeVar + 10
    let labelHWidth = 70

    for (let i = 0; i < polygon.length; i++) {
        let polygonPointX = polygon[i][0]
        let polygonPointY = polygon[i][1]

        fill(255, 255, 255)
        stroke(1)

        rect(polygonPointX, polygonPointY - labelHeight, labelHWidth, labelHeight)
        textSize(textSizeVar);
        fill(0, 0, 0);
        let textField = i + "(" + polygonPointX + "," + polygonPointY + ")";
        text(textField, polygonPointX + 5, polygonPointY - (textSizeVar - 3));
    }
}

