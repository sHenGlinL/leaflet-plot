import Draw from './L.SL.Draw';
import createFun from '../Create/L.SL.Create.DoubleArrow'

Draw.DoubleArrow = Draw.extend({
  initialize(map) {
    this._map = map
    this._shape = 'DoubleArrow'
  },
  enable(options) {
    this.drawOn()
    this._map.on("click", evt => {
      this.tempGp.layerNode.push([evt.latlng.lat, evt.latlng.lng])
      this.tempGp.layerNodeLen = this.tempGp.layerNode.length
      this.tempGp.tempNode.push(this.addNode(evt.latlng))
      if (this.tempGp.layerNodeLen === 7) {
        this.tempGp.layerNode.splice(this.tempGp.layerNodeLen - 2)
        const arrow = createFun(this.tempGp.layerNode, options).addTo(this._map)
        this.clearTemps()
        this.drawOff()
        this._map.fire('sl:create', {
          shape: this._shape,
          layer: arrow,
        })
      }
    });
    this._map.on("mousemove", evt => {
      if (this.tempGp.layerNodeLen >= 2) {
        if (this.tempGp.tempLayer) this.tempGp.tempLayer.remove();
        const index = this.tempGp.layerNodeLen === 2 ? 2 : this.tempGp.layerNodeLen - 1
        this.tempGp.layerNode[index] = [
          evt.latlng.lat,
          evt.latlng.lng
        ]
        this.tempGp.tempLayer = createFun(this.tempGp.layerNode, options).addTo(this._map)
      }
    });
    this._map.on("dblclick", () => {
      if (this.tempGp.layerNodeLen < 4) return
      this.tempGp.layerNode.splice(this.tempGp.layerNodeLen - 2)
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