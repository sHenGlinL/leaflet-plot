const Draw = L.Class.extend({
  tempGp: {
    layerNode: [],
    layerNodeLen: 0,
    tempNode: [],
    tempLayer: null,
  },
  initialize(map) {
    this._map = map

    // define all possible shapes that can be drawn
    this.shapes = ['StraightArrow', 'DoubleArrow', 'RightAngleArrow', 'TailedArrow']

    // initiate drawing class for our shapes
    this.shapes.forEach(shape => {
      this[shape] = new L.SL.Draw[shape](this._map)
    })
  },
  getShapes() {
    // if somebody wants to know what shapes are available
    return this.shapes;
  },
  enable(shape, options) {
    if (!shape) {
      throw new Error(
        `Error: Please pass a shape as a parameter. Possible shapes are: ${this.getShapes().join(
          ','
        )}`
      );
    }

    // enable draw for a shape
    this[shape].enable(options);
  },
  addNode(latlng) {
    const node = L.marker(latlng, {
      icon: L.divIcon({ className: 'marker-icon' })
    })
    node.addTo(this._map)
    return node
  },
  clearTemps() {
    this.tempGp.tempLayer && this.tempGp.tempLayer.remove()
    this.tempGp.tempNode.map(el => el.remove())

    this.tempGp.layerNode = []
    this.tempGp.layerNodeLen = 0
    this.tempGp.tempNode = []
    this.tempGp.tempLayer = null
  },
  drawOn() {
    this.clearTemps()
    this._map.doubleClickZoom.disable()
    // change map cursor
    this._map._container.style.cursor = 'crosshair'
    // 移除监听地图事件
    this.unable()
  },
  drawOff() {
    if (this._shape) {
      this.unable()
    } else {
      this.shapes.forEach(shape => {
        this[shape].unable()
      })
    }
    
    this._map.doubleClickZoom.enable()
    // reset cursor
    this._map._container.style.cursor = '';
  },
})

export default Draw