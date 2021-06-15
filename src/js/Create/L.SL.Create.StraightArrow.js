import PlotUtils from "../L.SL.PlotUtils"

// 细直箭头
function straightArrow(pnts, options) {
    var pnt1 = pnts[0];
    var pnt2 = pnts[1];
    var distance = PlotUtils.distance(pnt1, pnt2);
    var len = distance / 5;
    var leftPnt = PlotUtils.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, false);
    var rightPnt = PlotUtils.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, true);
    const pList = [pnt1, pnt2, leftPnt, pnt2, rightPnt]

    const arrow = L.polyline(pList, options)
    arrow._plotNodes = pnts
    arrow._shape = 'StraightArrow'
    return arrow
}

export default straightArrow