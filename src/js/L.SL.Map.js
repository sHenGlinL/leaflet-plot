const Map = L.Class.extend({
  initialize(map) {
    this.map = map
    this.Draw = new L.SL.Draw(map)
    this.Create = L.SL.Create
  },
  enableDraw(shape , options) {
    this.Draw.enable(shape, options)
  },
  disableDraw() {
    this.Draw.drawOff()
    this.Draw.clearTemps()
    // TODO 停止绘制时，如何优雅的移除编辑的临时点
    this.map.fire('sl:disable')
  },
})

export default Map