 "use strict";

b4w.register("camera_move_styles", function(exports, require) {

var m_app     = require("app");
var m_cam     = require("camera");
var m_cfg     = require("config");
var m_data    = require("data");
var m_scenes  = require("scenes");
var m_trans   = require("transform");
var m_util    = require("util");
var m_version = require("version");
var m_mouse   = require("mouse");
var m_scenes    = require("scenes");
var m_anim      = require("animation");
var m_obj       = require("objects");


var DEBUG = (m_version.type() === "DEBUG");

var DIST_LIMITS = {
    min: 5,
    max: 20
};

var TARGET_POS = [];
var TARGET_PIVOT = new Float32Array([1.5, 0, 0]);



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

    load();
}

function load() {
    m_data.load("data/controforceWeirTypes.json", load_cb);
    

}

function load_cb(data_id) {	
    m_app.enable_camera_controls();
    init_interface();
 }
    

function init_interface(){
	var getObject = "MESH";
	//console.log("start")

	var controls_container = document.createElement("div");
    controls_container.id = "controls_container";

    var allObj = m_scenes.get_all_objects();
    for(var val in allObj){
    	if(m_scenes.get_object_type(allObj[val]) == getObject && m_obj.get_meta_tags(allObj[val])['description'] == "1"){
    		var tempButton = create_button(allObj[val]['name'], m_trans.get_translation_rel(allObj[val]));
    		//.log(m_obj.get_meta_tags(allObj[val])['description']);
    		tempButton.onclick = button_index;//(;
    		controls_container.append(tempButton);
    		//console.log(m_anim.get_anim_names(allObj[val]))
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

    TARGET_POS.push(pos_of_obj);

    var label = document.createElement("label");
    label.className = "text";
    label.textContent = caption;

    button.appendChild(label);
    id_button = id_button + 1;
    return button;
}

function button_index(){
	console.log(this.id);
	clicked_button = this.id;
	target_camera_action();
}

function target_camera_action() {

    var camera = m_scenes.get_active_camera();

    m_cam.target_setup(camera, { pos: new Float32Array([TARGET_POS[clicked_button][0] + 15, TARGET_POS[clicked_button][1], TARGET_POS[clicked_button][2]]), pivot: TARGET_POS[clicked_button], 
            dist_lim: DIST_LIMITS 
        });
    // setting some rotation
    m_cam.rotate_camera(camera, Math.PI/1, -Math.PI/6, true, true);   
}



});
b4w.require("camera_move_styles").init(); 
