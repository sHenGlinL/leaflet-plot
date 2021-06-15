import Draw from './L.SL.Draw';
import createFun from '../Create/L.SL.Create.StraightArrow'

Draw.StraightArrow = Draw.extend({
  initialize(map) {
    this._map = map
    this._shape = 'StraightArrow'
  },
  enable(options) {
    this.drawOn()
    this._map.on("click", evt => {
      this.tempGp.layerNode.push([evt.latlng.lat, evt.latlng.lng])
      this.tempGp.layerNodeLen = this.tempGp.layerNode.length
      this.tempGp.tempNode.push(this.addNode(evt.latlng))
      if (this.tempGp.layerNodeLen === 3) {
        this.tempGp.layerNode.pop()
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
      if (this.tempGp.layerNodeLen >= 1) {
        if (this.tempGp.tempLayer) this.tempGp.tempLayer.remove()
        this.tempGp.layerNode[this.tempGp.layerNodeLen] = [
          evt.latlng.lat,
          evt.latlng.lng
        ]
        this.tempGp.tempLayer = createFun(this.tempGp.layerNode, options).addTo(this._map)
      }
    })
  }
})