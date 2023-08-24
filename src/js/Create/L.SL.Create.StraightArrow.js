import PlotUtils from "../L.SL.PlotUtils"

// 细直箭头
function straightArrow(pnts, options) {
    const pnt1 = pnts[0];
    const pnt2 = pnts[1];
    const distance = PlotUtils.distance(pnt1, pnt2);
    const len = distance / 5;
    const leftPnt = PlotUtils.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, false);
    const rightPnt = PlotUtils.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, true);
    const pList = [pnt1, pnt2, leftPnt, pnt2, rightPnt]

    if (pList.some(p => isNaN(p[0]) || isNaN(p[1]))) return null

    const arrow = L.polyline(pList, options)
    arrow._plotNodes = pnts
    arrow._shape = 'StraightArrow'
    return arrow
}

export default straightArrow