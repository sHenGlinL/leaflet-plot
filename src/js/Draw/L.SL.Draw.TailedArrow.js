import Draw from './L.SL.Draw';
import createFun from '../Create/L.SL.Create.TailedArrow'

Draw.TailedArrow = Draw.extend({
  initialize(map) {
    this._map = map
    this._shape = 'TailedArrow'
  },
  enable(options) {
    this.drawOn()
    this._map.on("click", evt => {
      const lastTempNode = this.tempGp.tempNode[this.tempGp.tempNode.length - 1]
      if (lastTempNode && evt.latlng.lat === lastTempNode._latlng.lat && evt.latlng.lng == lastTempNode._latlng.lng) {
        return
      }

      this.tempGp.layerNode.push([evt.latlng.lat, evt.latlng.lng])
      this.tempGp.layerNodeLen = this.tempGp.layerNode.length
      this.tempGp.tempNode.push(this.addNode(evt.latlng))
    });
    this._map.on("mousemove", evt => {
      if (this.tempGp.layerNodeLen >= 2) {
        if (this.tempGp.tempLayer) this.tempGp.tempLayer.remove();
        const index = this.tempGp.layerNodeLen === 2 ? 2 : this.tempGp.layerNodeLen - 1
        this.tempGp.layerNode[index] = [
          evt.latlng.lat,
          evt.latlng.lng
        ]
        const arrow = createFun(this.tempGp.layerNode, options)
        if (arrow) {
          this.tempGp.tempLayer = arrow.addTo(this._map)
        }
      }
    });
    this._map.on("dblclick", () => {
      if (this.tempGp.layerNodeLen < 4) return
      this.tempGp.layerNode.splice(this.tempGp.layerNodeLen - 1)
      const arrow = createFun(this.tempGp.layerNode, options).addTo(this._map)
      this.clearTemps()
      this.drawOff()
      this._map.fire('sl:create', {
        shape: this._shape,
        layer: arrow,
      })
    });
  }
})