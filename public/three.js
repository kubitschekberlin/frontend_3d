import $ from 'jquery'
import { Events3D } from './events_3d.js';
import RenderScene from '../lib/render_scene.js'
import { download } from '../lib/files.js';

$(function () {
  const scene = new RenderScene('#canvas_parent');
  new Events3D(scene.camera, scene.scene, scene.animate);
});