import Edit from './L.SL.Edit';
import Create from '../Create/L.SL.Create'

Edit.Arrow = Edit.extend({
  initialize(layer) {
    this._layer = layer
  },
  enable() {
    this._map = this._layer._map

    // cancel when map isn't available, this happens when the polygon is removed before this fires
    if (!this._map) {
      return;
    }

    if (!this.isArrow) {
      throw new Error(`Error: Please Edit Arrow`)
    }

    // init markers
    this._initMarkers()

    // if arrow gets removed from map, disable edit mode
    this._layer.on('remove', this._onLayerRemove, this)

    this._map.on('sl:disable', this._onLayerRemove, this)
  },
  disable() {
    this._markerGroup.clearLayers()
    // remove onRemove listener
    this._layer.off('remove', this._onLayerRemove, this)
    
    this._map.off('sl:disable', this._onLayerRemove, this)
  },
  _onLayerRemove(e) {
    this.disable(e.target);
  },
  _initMarkers() {
    const map = this._map;
    const coords = this._layer._plotNodes

    // cleanup old ones first
    if (this._markerGroup) {
      this._markerGroup.clearLayers()
    }
    // add markerGroup to map
    this._markerGroup = new L.LayerGroup();

    // create markers
    this._markers = coords.map(item => this._createMarker(item))

    // add markerGroup to map
    map.addLayer(this._markerGroup)
  },
  _createMarker(latlng) {
    const marker = new L.Marker(latlng, {
      draggable: true,
      icon: L.divIcon({ className: 'marker-icon' })
    });

    // marker.on('dragstart', this._onMarkerDragStart, this);
    marker.on('move', this._onMarkerDrag, this);
    marker.on('dragend', this._onMarkerDragEnd, this);

    this._markerGroup.addLayer(marker);

    return marker;
  },
  findDeepMarkerIndex(arr, marker) {
    // thanks for the function, Felix Heck
    let result

    const run = path => (v, i) => {
      const iRes = path.concat(i)

      if (v._leaflet_id === marker._leaflet_id) {
        result = iRes
        return true
      }

      return Array.isArray(v) && v.some(run(iRes))
    };
    arr.some(run([]))

    let returnVal = {}

    if (result) {
      returnVal = {
        indexPath: result,
        index: result[result.length - 1],
        parentPath: result.slice(0, result.length - 1),
      }
    }

    return returnVal
  },
  updateArrowCoordsFromMarkerDrag(marker) {
    // update coords
    const coords = this._layer._plotNodes

    // get marker latlng
    let latlng = marker.getLatLng()
    latlng = [latlng.lat, latlng.lng]

    // get indexPath of Marker
    const { index } = this.findDeepMarkerIndex(
      this._markers,
      marker
    )

    // update coord
    // const parent = indexPath.length > 1 ? get(coords, parentPath) : coords;
    // parent.splice(index, 1, latlng);
    coords.splice(index, 1, latlng)

    // set new coords on layer
    const latlngs = Create[this._layer._shape](coords, this._layer.options).getLatLngs()
    this._layer.setLatLngs(latlngs)
  },
  _onMarkerDrag(e) {
    const marker = e.target

    this.updateArrowCoordsFromMarkerDrag(marker)
  },
  _onMarkerDragEnd() {
    this._layer.fire('sl:edit')
  }
})