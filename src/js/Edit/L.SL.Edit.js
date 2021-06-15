const Edit = L.Class.extend({
  isArrow() {
    return this._layer._shape?.includes('Arrow') || false
  },
})

export default Edit