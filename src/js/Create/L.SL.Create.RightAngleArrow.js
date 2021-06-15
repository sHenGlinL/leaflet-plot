import PlotUtils from "../L.SL.PlotUtils"
import Constants from '../L.SL.Constants'

// 直箭头
function rightAngleArrow(pnts, options) {
    const arrowOptions = {
        // tailWidthDactor: 0.15, // 尾部宽度倍数
        // neckWidthFactor: 0.2, // 颈部宽度倍数
        // headWidthFactor: 0.25, // 头部宽度倍数
        // headAngle: Math.PI / 8.5, // 头部角度
        // neckAngle: Math.PI / 13 // 颈部角度
        tailWidthDactor: 0.2, // 尾部宽度倍数
        neckWidthFactor: 0.25, // 颈部宽度倍数
        headWidthFactor: 0.3, // 头部宽度倍数
        headAngle: Math.PI / 4, // 头部角度
        neckAngle: Math.PI * 0.17741 // 颈部角度
    }
    const pnt1 = pnts[0]
    const pnt2 = pnts[1]
    const len = PlotUtils.getBaseLength(pnts)
    const tailWidth = len * arrowOptions.tailWidthDactor
    const neckWidth = len * arrowOptions.neckWidthFactor
    const headWidth = len * arrowOptions.headWidthFactor
    const tailLeft = PlotUtils.getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, true)
    const tailRight = PlotUtils.getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, false)
    const headLeft = PlotUtils.getThirdPoint(pnt1, pnt2, arrowOptions.headAngle, headWidth, false)
    const headRight = PlotUtils.getThirdPoint(pnt1, pnt2, arrowOptions.headAngle, headWidth, true)
    const neckLeft = PlotUtils.getThirdPoint(pnt1, pnt2, arrowOptions.neckAngle, neckWidth, false)
    const neckRight = PlotUtils.getThirdPoint(pnt1, pnt2, arrowOptions.neckAngle, neckWidth, true)
    const pList = [tailLeft, neckLeft, headLeft, pnt2, headRight, neckRight, tailRight]

    const arrow = L.polygon(pList, options)
    arrow._plotNodes = pnts
    arrow._shape = 'RightAngleArrow'
    return arrow
}

export default rightAngleArrow