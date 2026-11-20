import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default function drawNeedles(left, right) {
    drawNeedle(left);
}

function drawNeedle(percentage) {
    const width = 600;
    const height = 500;
    // Percentage = X (0-100), converted to decimals, then subtract 50% since needle starts at 50%
    // so angles less than 50% will move needle to the left & >50% will move needle to the right
    // then multiply by radians! conversion rate = pi radians/100%
    const angle = ((percentage / 100) - 0.5) * Math.PI; //also negative because angles move left

    var point0 = {x: width/2, y: height/10};
    var point1 = {x: width/2 + width/20, y: height/10 + 2 * height/3};
    var needleCenter = {x: width/2, y: height/10 + 2 * height/3};
    console.log(angle, point1.y, point1.x);

    // did some cool linear algebra to figure out how to rotate the needle
    //first scaling these points to the needle center as the origin
    point0.x = (point0.x - needleCenter.x)
    point0.y = (needleCenter.y - point0.y) //subtract since y scale is negative
    point1.x = (point1.x - needleCenter.x)
    point1.y = (needleCenter.y - point1.y)

    //now rotation!
    var new0x = point0.x * Math.cos(angle) + point0.y * Math.sin(angle);
    var new0y = -point0.x * Math.sin(angle) + point0.y * Math.cos(angle);
    var new1x = point1.x * Math.cos(angle) + point1.y * Math.sin(angle);
    var new1y = -point1.x * Math.sin(angle) + point1.y * Math.cos(angle);
    point0.x = new0x
    point0.y = new0y
    point1.x = new1x
    point1.y = new1y
    var needleCenterAngle = Math.atan2(point1.y, point1.x) //angle to start drawing the circle at the center
    console.log(needleCenterAngle, point0.x, point0.y, point1.x, point1.y);

    //scale back!
    point0.x = point0.x + needleCenter.x
    point0.y = needleCenter.y - point0.y
    point1.x = point1.x + needleCenter.x
    point1.y = needleCenter.y - point1.y

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    const needle = d3.path();
    needle.moveTo(point0.x, point0.y);
    needle.lineTo(point1.x, point1.y);
    needle.arc(needleCenter.x, needleCenter.y, width/20, -needleCenterAngle, -needleCenterAngle + Math.PI, false);
    needle.lineTo(point0.x, point0.y);
    needle.closePath();

    svg.append("path")
        .attr("d", needle.toString())
        .attr("stroke", "black")
        .attr("fill", "red");

    // Append the SVG element.
    container.append(svg.node());
}