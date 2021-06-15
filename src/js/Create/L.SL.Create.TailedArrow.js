import PlotUtils from "../L.SL.PlotUtils"
import Constants from '../L.SL.Constants'

// 燕尾箭头
function tailedArrow(pnts, options) {
    const arrowOptions = {
        headHeightFactor: 0.18,
        headWidthFactor: 0.3,
        neckHeightFactor: 0.85,
        neckWidthFactor: 0.15,
        tailWidthFactor: 0.1,
        headTailFactor: 0.8,
        swallowTailFactor: 1,
        swallowTailPnt: null
    }
    // 计算箭尾
    let tailLeft = pnts[0]
    let tailRight = pnts[1]
    if (PlotUtils.isClockWise(pnts[0], pnts[1], pnts[2])) {
        tailLeft = pnts[1]
        tailRight = pnts[0]
    }
    const midTail = PlotUtils.mid(tailLeft, tailRight)
    const bonePnts = [midTail].concat(pnts.slice(2))
    // 计算箭头
    const headPnts = getArrowHeadPoints(bonePnts, tailLeft, tailRight, arrowOptions)
    const neckLeft = headPnts[0]
    const neckRight = headPnts[4]
    const tailWidth = PlotUtils.distance(tailLeft, tailRight)
    const allLen = PlotUtils.getBaseLength(bonePnts)
    const len = allLen * arrowOptions.tailWidthFactor * arrowOptions.swallowTailFactor
    arrowOptions.swallowTailPnt = PlotUtils.getThirdPoint(bonePnts[1], bonePnts[0], 0, len, true);
    const factor = tailWidth / allLen
    // 计算箭身
    const bodyPnts = getArrowBodyPoints(bonePnts, neckLeft, neckRight, factor)
    // 整合
    const count = bodyPnts.length;
    let leftPnts = [tailLeft].concat(bodyPnts.slice(0, count / 2));
    leftPnts.push(neckLeft);
    let rightPnts = [tailRight].concat(bodyPnts.slice(count / 2, count));
    rightPnts.push(neckRight);
    // 圆滑效果
    leftPnts = PlotUtils.getQBSplinePoints(leftPnts);
    rightPnts = PlotUtils.getQBSplinePoints(rightPnts);

    const pList = [leftPnts.concat(headPnts, rightPnts.reverse(), [arrowOptions.swallowTailPnt, leftPnts[0]])]
    const arrow = L.polygon(pList, options)
    arrow._plotNodes = pnts
    arrow._shape = 'TailedArrow'
    return arrow
}
// 获取箭头部分的点
function getArrowHeadPoints(points, tailLeft, tailRight, arrowOptions) {
    let len = PlotUtils.getBaseLength(points);
    let headHeight = len * arrowOptions.headHeightFactor;
    let headPnt = points[points.length - 1];
    len = PlotUtils.distance(headPnt, points[points.length - 2]);
    const tailWidth = PlotUtils.distance(tailLeft, tailRight);
    if (headHeight > tailWidth * arrowOptions.headTailFactor) {
        headHeight = tailWidth * arrowOptions.headTailFactor;
    }
    const headWidth = headHeight * arrowOptions.headWidthFactor;
    const neckWidth = headHeight * arrowOptions.neckWidthFactor;
    headHeight = headHeight > len ? len : headHeight;
    const neckHeight = headHeight * arrowOptions.neckHeightFactor;
    const headEndPnt = PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, headHeight, true);
    const neckEndPnt = PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, neckHeight, true);
    const headLeft = PlotUtils.getThirdPoint(headPnt, headEndPnt, Constants.HALF_PI, headWidth, false);
    const headRight = PlotUtils.getThirdPoint(headPnt, headEndPnt, Constants.HALF_PI, headWidth, true);
    const neckLeft = PlotUtils.getThirdPoint(headPnt, neckEndPnt, Constants.HALF_PI, neckWidth, false);
    const neckRight = PlotUtils.getThirdPoint(headPnt, neckEndPnt, Constants.HALF_PI, neckWidth, true);
    return [neckLeft, headLeft, headPnt, headRight, neckRight];
}
// 获取箭身部分的点
function getArrowBodyPoints(points, neckLeft, neckRight, tailWidthFactor) {
    const allLen = PlotUtils.wholeDistance(points);
    const len = PlotUtils.getBaseLength(points);
    const tailWidth = len * tailWidthFactor;
    const neckWidth = PlotUtils.distance(neckLeft, neckRight);
    const widthDif = (tailWidth - neckWidth) / 2;
    let tempLen = 0, leftBodyPnts = [], rightBodyPnts = [];
    for (let i = 1; i < points.length - 1; i++) {
        const angle = PlotUtils.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2;
        tempLen += PlotUtils.distance(points[i - 1], points[i]);
        const w = (tailWidth / 2 - tempLen / allLen * widthDif) / Math.sin(angle);
        const left = PlotUtils.getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true);
        const right = PlotUtils.getThirdPoint(points[i - 1], points[i], angle, w, false);
        leftBodyPnts.push(left);
        rightBodyPnts.push(right);
    }
    return leftBodyPnts.concat(rightBodyPnts);
}

export default tailedArrow