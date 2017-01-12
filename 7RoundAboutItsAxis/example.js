"use strict";

b4w.register("example_main", function(exports, require) {

var m_app    = require("app");
var m_data   = require("data");
var m_main   = require("main");
var m_scenes = require("scenes");
var m_mouse = require("mouse");
var m_trans = require("transform");
var m_ctl       = require("controls");
var m_util = require("util");

var ANIM_TIME = 1;
var ROT_ANGLE = 2*Math.PI;

var _timeline = -1;
var _curr_obj_angle = 0;
var _obj_euler = new Float32Array(3);
var _obj_quat = new Float32Array(4);

exports.init = function() {
    m_app.init({
        canvas_container_id: "canvas3d", 
        callback: init_cb,
        physics_enabled: false,
        alpha: false
    });
}

function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_app.enable_controls(canvas_elem);
    window.onresize = on_resize;
    on_resize();
    load();
}

function load() {
    m_data.load("empty.json", load_cb);
}

function load_cb(data_id) {
    m_app.enable_camera_controls();
    var empty = m_scenes.get_object_by_name("Empty");
    var obj = m_scenes.get_object_by_dupli_name_list(["Group", "lampFan"], empty);

    m_trans.set_translation(obj, -2, 0, 2);
    m_trans.set_scale(obj, 1);

    init_animation(obj);
    var main_canvas = m_main.get_canvas_elem();
    main_canvas.addEventListener("mousedown", main_canvas_down);
}

function main_canvas_down(e) {
    var x = m_mouse.get_coords_x(e);
    var y = m_mouse.get_coords_y(e);
    var obj = m_scenes.pick_object(x, y);

    if (obj && m_scenes.get_object_name(obj) == "Group*lampFan") {
        m_trans.get_rotation(obj, _obj_quat);
        m_util.quat_to_euler(_obj_quat, _obj_euler);
        _curr_obj_angle = _obj_euler[1];
        _timeline = m_main.global_timeline();; //start animation
    }
}

function init_animation(obj) {

    var t_sensor = m_ctl.create_timeline_sensor();
    var e_sensor = m_ctl.create_elapsed_sensor();

    var logic_func = function(s) {
        // s[0] = m_main.global_timeline() (t_sensor value)
        return s[0] - _timeline < ANIM_TIME;
    }

    var cam_move_cb = function(obj, id, pulse) {

        if (pulse == 1) {
            // elapsed = frame time (e_sensor value)
            var elapsed = m_ctl.get_sensor_value(obj, id, 1);
            var delta = elapsed / ANIM_TIME;
            _curr_obj_angle += ROT_ANGLE * delta;
            m_trans.set_rotation_euler(obj, 0, _curr_obj_angle, 0);
        } 
        //else
         //   m_scenes.apply_glow_anim(obj, 0.2, 3.8, 1); //the end of animation
    }

    m_ctl.create_sensor_manifold(obj, "ROTATION", m_ctl.CT_CONTINUOUS,
        [t_sensor, e_sensor], logic_func, cam_move_cb);
}


function on_resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    m_main.resize(w, h);
}


});

b4w.require("example_main").init();