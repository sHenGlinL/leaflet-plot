// 双箭头
import PlotUtils from "../L.SL.PlotUtils"
import Constants from '../L.SL.Constants'

function doubleArrow(pnts, options) {
    const arrowOptions = {
        connPoint: null,
        tempPoint4: null,
        fixPointCount: 4
    }
    var pnt1 = pnts[0];
    var pnt2 = pnts[1];
    var pnt3 = pnts[2];
    var count = pnts.length;
    if (count == 3)
        arrowOptions.tempPoint4 = getTempPoint4(pnt1, pnt2, pnt3);
    else
        arrowOptions.tempPoint4 = pnts[3];
    if (count == 3 || count == 4)
        arrowOptions.connPoint = PlotUtils.mid(pnt1, pnt2);
    else
        arrowOptions.connPoint = pnts[4];
    var leftArrowPnts, rightArrowPnts;
    if (PlotUtils.isClockWise(pnt1, pnt2, pnt3)) {
        leftArrowPnts = getArrowPoints(pnt1, arrowOptions.connPoint, arrowOptions.tempPoint4, false);
        rightArrowPnts = getArrowPoints(arrowOptions.connPoint, pnt2, pnt3, true);
    } else {
        leftArrowPnts = getArrowPoints(pnt2, arrowOptions.connPoint, pnt3, false);
        rightArrowPnts = getArrowPoints(arrowOptions.connPoint, pnt1, arrowOptions.tempPoint4, true);
    }
    var m = leftArrowPnts.length;
    var t = (m - 5) / 2;

    var llBodyPnts = leftArrowPnts.slice(0, t);
    var lArrowPnts = leftArrowPnts.slice(t, t + 5);
    var lrBodyPnts = leftArrowPnts.slice(t + 5, m);

    var rlBodyPnts = rightArrowPnts.slice(0, t);
    var rArrowPnts = rightArrowPnts.slice(t, t + 5);
    var rrBodyPnts = rightArrowPnts.slice(t + 5, m);

    rlBodyPnts = PlotUtils.getBezierPoints(rlBodyPnts);
    var bodyPnts = PlotUtils.getBezierPoints(rrBodyPnts.concat(llBodyPnts.slice(1)));
    lrBodyPnts = PlotUtils.getBezierPoints(lrBodyPnts);

    var pList = rlBodyPnts.concat(rArrowPnts, bodyPnts, lArrowPnts, lrBodyPnts);
    const arrow = L.polygon(pList, options)
    arrow._plotNodes = pnts
    arrow._shape = 'DoubleArrow'
    return arrow
}

// 计算对称点
function getTempPoint4(linePnt1, linePnt2, point) {
    var midPnt = PlotUtils.mid(linePnt1, linePnt2);
    var len = PlotUtils.distance(midPnt, point);
    var angle = PlotUtils.getAngleOfThreePoints(linePnt1, midPnt, point);
    var symPnt, distance1, distance2, mid;
    if (angle < Constants.HALF_PI) {
        distance1 = len * Math.sin(angle);
        distance2 = len * Math.cos(angle);
        mid = PlotUtils.getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, false);
        symPnt = PlotUtils.getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, true);
    }
    else if (angle >= Constants.HALF_PI && angle < Math.PI) {
        distance1 = len * Math.sin(Math.PI - angle);
        distance2 = len * Math.cos(Math.PI - angle);
        mid = PlotUtils.getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, false);
        symPnt = PlotUtils.getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, false);
    }
    else if (angle >= Math.PI && angle < Math.PI * 1.5) {
        distance1 = len * Math.sin(angle - Math.PI);
        distance2 = len * Math.cos(angle - Math.PI);
        mid = PlotUtils.getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, true);
        symPnt = PlotUtils.getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, true);
    }
    else {
        distance1 = len * Math.sin(Math.PI * 2 - angle);
        distance2 = len * Math.cos(Math.PI * 2 - angle);
        mid = PlotUtils.getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, true);
        symPnt = PlotUtils.getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, false);
    }
    return symPnt;
}

function getArrowPoints(pnt1, pnt2, pnt3, clockWise) {
    const arrowOptions = {
        headHeightFactor: 0.25,
        headWidthFactor: 0.3,
        neckHeightFactor: 0.85,
        neckWidthFactor: 0.15,
    }
    var midPnt = PlotUtils.mid(pnt1, pnt2);
    var len = PlotUtils.distance(midPnt, pnt3);
    var midPnt1 = PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.3, true);
    var midPnt2 = PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.5, true);
    //var midPnt3=PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.7, true);
    midPnt1 = PlotUtils.getThirdPoint(midPnt, midPnt1, Constants.HALF_PI, len / 5, clockWise);
    midPnt2 = PlotUtils.getThirdPoint(midPnt, midPnt2, Constants.HALF_PI, len / 4, clockWise);
    //midPnt3=PlotUtils.getThirdPoint(midPnt, midPnt3, Constants.HALF_PI, len / 5, clockWise);

    var points = [midPnt, midPnt1, midPnt2, pnt3];
    // 计算箭头部分
    var arrowPnts = getArrowHeadPoints_double(points, arrowOptions);
    var neckLeftPoint = arrowPnts[0];
    var neckRightPoint = arrowPnts[4];
    // 计算箭身部分
    var tailWidthFactor = PlotUtils.distance(pnt1, pnt2) / PlotUtils.getBaseLength(points) / 2;
    var bodyPnts = getArrowBodyPoints_double(points, neckLeftPoint, neckRightPoint, tailWidthFactor);
    var n = bodyPnts.length;
    var lPoints = bodyPnts.slice(0, n / 2);
    var rPoints = bodyPnts.slice(n / 2, n);
    lPoints.push(neckLeftPoint);
    rPoints.push(neckRightPoint);
    lPoints = lPoints.reverse();
    lPoints.push(pnt2);
    rPoints = rPoints.reverse();
    rPoints.push(pnt1);
    return lPoints.reverse().concat(arrowPnts, rPoints);
}

function getArrowHeadPoints_double(points, arrowOptions) {
    var len = PlotUtils.getBaseLength(points);
    var headHeight = len * arrowOptions.headHeightFactor;
    var headPnt = points[points.length - 1];
    // var tailWidth = PlotUtils.distance(tailLeft, tailRight);
    var headWidth = headHeight * arrowOptions.headWidthFactor;
    var neckWidth = headHeight * arrowOptions.neckWidthFactor;
    var neckHeight = headHeight * arrowOptions.neckHeightFactor;
    var headEndPnt = PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, headHeight, true);
    var neckEndPnt = PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, neckHeight, true);
    var headLeft = PlotUtils.getThirdPoint(headPnt, headEndPnt, Constants.HALF_PI, headWidth, false);
    var headRight = PlotUtils.getThirdPoint(headPnt, headEndPnt, Constants.HALF_PI, headWidth, true);
    var neckLeft = PlotUtils.getThirdPoint(headPnt, neckEndPnt, Constants.HALF_PI, neckWidth, false);
    var neckRight = PlotUtils.getThirdPoint(headPnt, neckEndPnt, Constants.HALF_PI, neckWidth, true);
    return [neckLeft, headLeft, headPnt, headRight, neckRight];
}

function getArrowBodyPoints_double(points, neckLeft, neckRight, tailWidthFactor) {
    var allLen = PlotUtils.wholeDistance(points);
    var len = PlotUtils.getBaseLength(points);
    var tailWidth = len * tailWidthFactor;
    var neckWidth = PlotUtils.distance(neckLeft, neckRight);
    var widthDif = (tailWidth - neckWidth) / 2;
    var tempLen = 0, leftBodyPnts = [], rightBodyPnts = [];
    for (var i = 1; i < points.length - 1; i++) {
        var angle = PlotUtils.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2;
        tempLen += PlotUtils.distance(points[i - 1], points[i]);
        var w = (tailWidth / 2 - tempLen / allLen * widthDif) / Math.sin(angle);
        var left = PlotUtils.getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true);
        var right = PlotUtils.getThirdPoint(points[i - 1], points[i], angle, w, false);
        leftBodyPnts.push(left);
        rightBodyPnts.push(right);
    }
    return leftBodyPnts.concat(rightBodyPnts);
}

export default doubleArrow