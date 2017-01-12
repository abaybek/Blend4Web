 "use strict"

b4w.register("instancing", function(exports, require) {

var m_app     = require("app");
var m_data    = require("data");
var m_scs     = require("scenes");
var m_obj     = require("objects");
var m_trans   = require("transform");
var m_cfg     = require("config");
var m_version = require("version");
var m_ctl     = require("controls");
var m_mouse   = require("mouse");
var m_cont    = require("container");
var m_scenes  = require("scenes");
var m_util    = require("util");
var m_time   = require("time");

var DEBUG = (m_version.type() === "DEBUG");


var _world = null;
var _gem_1 = null;
var _gem_2 = null;
var _gem_3 = null;

exports.init = function() { 
    m_app.init({
        canvas_container_id: "canvas_cont",
        callback: init_cb,
        physics_enabled: false,
        show_fps: true,
        alpha: false,
        autoresize: true,
        assets_dds_available: !DEBUG,
        assets_min50_available: !DEBUG,
        console_verbose: true
    });
}

function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }   
    load();
}

function load() {
    m_data.load("data/simple_app.json", load_cb);
}


function load_cb(data_id) {
    m_app.enable_camera_controls();
    var container = m_cont.get_canvas();
    _world = m_scenes.get_world_by_name("World");
    _gem_1 = m_scenes.get_object_by_name("gem_1");
    _gem_2 = m_scenes.get_object_by_name("gem_2");
    _gem_3 = m_scenes.get_object_by_name("gem_3");
    init_animation(_gem_1);
    init_animation(_gem_2);
    init_animation(_gem_3);
    container.addEventListener("mousedown", main_canvas_down);
}

var ANIM_TIME = 2;
var ROT_ANGLE = 2*Math.PI;
var COMPRESS  = 0.5;
var ZPOSS     = 2;
var checkIfDone = [0,0,0];

var _timeline_1 = -1;
var _timeline_2 = -1;
var _timeline_3 = -1;

var _curr_obj_angle = 0;
var _curr_obj_compr = 1;
var _curr_obj_poss = 0;

var _obj_euler = new Float32Array(3);
var _obj_quat = new Float32Array(4);

function main_canvas_down(e) {
    var x = m_mouse.get_coords_x(e);
    var y = m_mouse.get_coords_y(e);
    var obj = m_scenes.pick_object(x, y);
    if (obj && m_scenes.get_object_name(obj) == "gem_1" && checkIfDone[0]==0) {
        m_trans.get_rotation(obj, _obj_quat);
        m_util.quat_to_euler(_obj_quat, _obj_euler);
        _curr_obj_angle = _obj_euler[1];
    	checkIfDone[0] = 1;
        _timeline_1 = m_time.get_timeline(); //start animation
    }else if(obj && m_scenes.get_object_name(obj) == "gem_2" && checkIfDone[1]==0){
       checkIfDone[1] = 1;
       _timeline_2 = m_time.get_timeline();
    }else if(obj && m_scenes.get_object_name(obj) == "gem_3" && checkIfDone[2]==0){
        checkIfDone[2] = 1;
       _timeline_3 = m_time.get_timeline(); //start animation
 
    }
}

    var disp = 0;


function init_animation(obj) {
    var timeComp = 0;
    var timeTran = 0;
    var t_sensor = m_ctl.create_timeline_sensor();
    var e_sensor = m_ctl.create_elapsed_sensor();

    var logic_func = function(s) {
        // s[0] = m_main.global_timeline() (t_sensor value)
        return s[0] - _timeline_1 < ANIM_TIME;
    }

    var logic_func_2 = function(s) {
        // s[0] = m_main.global_timeline() (t_sensor value)
        return s[0] - _timeline_2 < ANIM_TIME; 
    }

    var logic_func_3 = function(s) {
        // s[0] = m_main.global_timeline() (t_sensor value)
        return s[0] - _timeline_3 < ANIM_TIME;
    }

    var cam_move_cb = function(obj, id, pulse) {
        if (pulse == 1) {
            // elapsed = frame time (e_sensor value)
            var elapsed = m_ctl.get_sensor_value(obj, id, 1);
            var delta = elapsed / ANIM_TIME;
            _curr_obj_angle += ROT_ANGLE * delta;
            m_trans.set_rotation_euler(obj, 0, _curr_obj_angle, 0);
        }else{
        	checkIfDone[0] = 0;
        } 
    }
    
    var cam_tran_cb = function(obj, id, pulse) {
        if (pulse == 1) {
            // elapsed = frame time (e_sensor value)
            var elapsed = m_ctl.get_sensor_value(obj, id, 1);
            var delta = elapsed / ANIM_TIME;
            timeTran +=delta;
            if (timeTran > 0.5){
            _curr_obj_poss = -ZPOSS * delta;
            }else {
             _curr_obj_poss = ZPOSS * delta;
            }
            m_trans.move_local(obj,0,0, _curr_obj_poss);
        } else {
        	checkIfDone[1] = 0;
            timeTran = 0;
        } 
    }    
    
    var cam_comp_cb = function(obj, id, pulse) {
        if (pulse == 1) {
            // elapsed = frame time (e_sensor value)
            var elapsed = m_ctl.get_sensor_value(obj, id, 1);
            var delta = elapsed / ANIM_TIME;
            timeComp +=delta
            //console.log(timeComp);
            if (timeComp > 0.5){
            _curr_obj_compr -= COMPRESS * delta;
            }else {
             _curr_obj_compr += COMPRESS * delta;
            }
            m_trans.set_scale(obj, _curr_obj_compr);
            
        } else {
        	checkIfDone[2] = 0;
            timeComp = 0;
        } 
    }

    if (obj && m_scenes.get_object_name(obj) == "gem_1")
        m_ctl.create_sensor_manifold(obj, "ROTATION", m_ctl.CT_CONTINUOUS,
            [t_sensor, e_sensor], logic_func, cam_move_cb);
    if (obj && m_scenes.get_object_name(obj) == "gem_3")
        m_ctl.create_sensor_manifold(obj, "COMPRESSION", m_ctl.CT_CONTINUOUS,
            [t_sensor, e_sensor], logic_func_3, cam_comp_cb);
    if (obj && m_scenes.get_object_name(obj) == "gem_2")
        m_ctl.create_sensor_manifold(obj, "TRANSLATION", m_ctl.CT_CONTINUOUS,
            [t_sensor, e_sensor], logic_func_2, cam_tran_cb);

}


});

b4w.require("instancing").init(); 