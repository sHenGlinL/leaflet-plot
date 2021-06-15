
import './polyfills';
import { version } from '../../package.json'

import Map from './L.SL.Map'

import Create from './Create/L.SL.Create'

import Draw from './Draw/L.SL.Draw'
import './Draw/L.SL.Draw.StraightArrow'
import './Draw/L.SL.Draw.DoubleArrow'
import './Draw/L.SL.Draw.RightAngleArrow'
import './Draw/L.SL.Draw.TailedArrow'

import Edit from './Edit/L.SL.Edit'
import './Edit/L.SL.Edit.Arrow'

import '../css/layers.css'

L.SL = L.SL || {
  version,
  Map,
  Draw,
  Edit,
  Create,

  initialize() {
    this.addInitHooks()
  },

  addInitHooks() {
    function initMap() {
      this.sl = undefined
      this.sl = new L.SL.Map(this)
    }
    L.Map.addInitHook(initMap);

    function initArrow() {
      this.sl = undefined;
      this.sl = new L.SL.Edit.Arrow(this)
    }
    L.Polygon.addInitHook(initArrow);
    L.Polyline.addInitHook(initArrow);
  }
}

// refer to leaflet-geoman
L.SL.initialize()