 "use strict";

b4w.register("camera_move_styles", function(exports, require) {

var m_app     = require("app");
var m_cont    = require("container")
var m_cam     = require("camera");
var m_cfg     = require("config");
var m_data    = require("data");
var m_scenes  = require("scenes");
var m_trans   = require("transform");
var m_util    = require("util");
var m_version = require("version");
var m_mouse   = require("mouse");
var m_ctl     = require("controls");
var m_scenes    = require("scenes");
var m_anim      = require("animation");
var m_obj       = require("objects");
var m_vec3    = require("vec3");
var m_time    = require("time");
var m_preloader = require("preloader");



var DEBUG = (m_version.type() === "DEBUG");

var DIST_LIMITS = {
    min: 0,
    max: 2
};

var TARGET_POS = [];
var TARGET_PIVOT = new Float32Array([1.5, 0, 0]);

var ANIM_TIME = 2;

var _anim_stop = false;
var _delta_target = ANIM_TIME;
var _cam_anim = {
    timeline: -ANIM_TIME,
    starting_eye: new Float32Array(3),
    starting_target: new Float32Array(3),
    final_eye: new Float32Array(3),
    final_target: new Float32Array(3),
    current_eye: new Float32Array(3),
    current_target: new Float32Array(3)
}

var _vec3_tmp = new Float32Array(3);



exports.init = function() {
    m_app.init({
        canvas_container_id: "canvas_cont",
        callback: init_cb,
        physics_enabled: false,
        alpha: true,
        // show_fps: true,
        autoresize: true,
        // assets_dds_available: !DEBUG,
        // assets_min50_available: !DEBUG,
        console_verbose: true,
        gl_debug: true
    });
}

function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_preloader.create_preloader();

    load();
}

function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}

function load() {
    m_data.load("data/l31_9.json", load_cb, preloader_cb);
    

}

function load_cb(data_id) {	
    m_app.enable_camera_controls();
    var camobj = m_scenes.get_active_camera();
    init_camera_animation(camobj);
    // m_cam.target_setup(camobj);
    

 }
    


function init_camera_animation(camobj) {

	init_interface();
    var t_sensor = m_ctl.create_timeline_sensor();
    var e_sensor = m_ctl.create_elapsed_sensor();

    var logic_func = function(s) {
        // s[0] = m_time.get_timeline() (t_sensor value)
        return s[0] - _cam_anim.timeline < ANIM_TIME;
    }

    var cam_move_cb = function(camobj, id, pulse) {

        if (pulse == 1) {
            if (_anim_stop) {
                _cam_anim.timeline = -ANIM_TIME;
                return;
            }
            // console.log(pulse)

            m_app.disable_camera_controls();

            // elapsed = frame time (e_sensor value)
            var elapsed = m_ctl.get_sensor_value(camobj, id, 1);
            var delta = elapsed / ANIM_TIME;

            m_vec3.subtract(_cam_anim.final_eye, _cam_anim.starting_eye, _vec3_tmp);
            m_vec3.scaleAndAdd(_cam_anim.current_eye, _vec3_tmp, delta, _cam_anim.current_eye);

            _delta_target -= elapsed; 
            delta = 1 - _delta_target * _delta_target / (ANIM_TIME * ANIM_TIME);
            m_vec3.subtract(_cam_anim.final_target, _cam_anim.starting_target, _vec3_tmp);
            m_vec3.scaleAndAdd(_cam_anim.starting_target, _vec3_tmp, delta, _cam_anim.current_target);

            m_cam.target_set_trans_pivot(camobj, _cam_anim.current_eye, _cam_anim.current_target);
            // m_cont.resize_to_container(true);
        } else {
            m_app.enable_camera_controls(false);
            // m_cont.resize_to_container(true);
            if (!_anim_stop)
                m_cam.target_set_trans_pivot(camobj, _cam_anim.final_eye, 
                        _cam_anim.final_target);
            else
                _anim_stop = false;
        }
    }

    m_ctl.create_sensor_manifold(camobj, "CAMERA_MOVE", m_ctl.CT_CONTINUOUS,
            [t_sensor, e_sensor], logic_func, cam_move_cb);
}

function init_interface(){
	var getObject = "EMPTY";
	//console.log("start")

	var controls_container = document.createElement("div");
    controls_container.id = "controls_container";

    var allObj = m_scenes.get_all_objects();
    for(var val in allObj){
    	console.log(allObj[val])
    	if(m_obj.get_meta_tags(allObj[val])){
	    	
    	if(m_scenes.get_object_type(allObj[val]) == getObject && m_obj.get_meta_tags(allObj[val])['category'] == "1"){
    			console.log(m_obj.get_meta_tags(allObj[val]))
    			console.log(m_trans.get_translation_rel(allObj[val]))
    			console.log(allObj[val])
	    		var tempButton = create_button(m_obj.get_meta_tags(allObj[val])['title'], m_trans.get_translation_rel(allObj[val]));
	    		tempButton.onclick = button_index;//(;
	    		controls_container.append(tempButton);
    		}
    	}
    }

    document.body.appendChild(controls_container);
    //console.log(TARGET_POS)
}



var id_button = 0; // count button 
var clicked_button = 0;
function create_button(caption, pos_of_obj) {
    var button = document.createElement("div");
    button.id = id_button;
    button.className = "button_container";
    //button.onclick = button_index;
    TARGET_POS.push(pos_of_obj);

    var label = document.createElement("label");
    label.className = "text";
    label.textContent = caption;

    button.appendChild(label);
    id_button = id_button + 1;
    return button;
}

// function button_index(){
//     clicked_button = this.id;
// 	console.log(this.id);
// 	target_camera_action();
// }

function button_index() {
    // console.log(this.id);
    clicked_button = this.id;
    var eye = new Float32Array([TARGET_POS[clicked_button][0], TARGET_POS[clicked_button][1], TARGET_POS[clicked_button][2]]);
    var target = TARGET_POS[clicked_button];
    console.log(target)

    if (eye && target) {
        var camobj = m_scenes.get_active_camera();
        var pos_view = eye;//m_trans.get_translation(eye);
        var pos_target = target;//m_trans.get_translation(target);
        start_camera_animation(camobj, pos_view, pos_target);
    } 

}

function start_camera_animation(camobj, pos_view, pos_target) {
    // retrieve camera current position
    
    
    console.log(camobj)	
    m_cam.target_get_pivot(camobj, _cam_anim.current_target);
    m_trans.get_translation(camobj, _cam_anim.current_eye);
    // console.log("1111")
    // set camera starting position
    m_vec3.copy(_cam_anim.current_target, _cam_anim.starting_target);
    m_vec3.copy(_cam_anim.current_eye, _cam_anim.starting_eye);
    // console.log("2222")

    // set camera final position
    m_vec3.copy(pos_view, _cam_anim.final_eye);
    m_vec3.copy(pos_target, _cam_anim.final_target);

    _delta_target = ANIM_TIME;

    _cam_anim.timeline = m_time.get_timeline();
}


// function target_camera_action() {

//     var camera = m_scenes.get_active_camera();

//     m_cam.target_setup(camera, { pos: , pivot: , 
//             dist_lim: DIST_LIMITS 
//         });
//     // setting some rotation
//     m_cam.rotate_camera(camera, Math.PI/1, -Math.PI/6, true, true);   
// }



});
b4w.require("camera_move_styles").init(); 
