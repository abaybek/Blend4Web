 "use strict"

b4w.register("instancing", function(exports, require) {

var m_app     = require("app");
var m_data    = require("data");
var m_scs     = require("scenes");
var m_obj     = require("objects");
var m_trans   = require("transform");
var m_cfg     = require("config");
var m_version = require("version");
var m_ctl    = require("controls");

var DEBUG = (m_version.type() === "DEBUG");

var APP_ASSETS_PATH = m_cfg.get_std_assets_path() + "code_snippets/instancing";
var NUM_OF_POINTS = 10;
var POS = 10;

var _monkeys_num = 0;

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
    m_data.load("data/CUBE.json", load_cb);
}


var speed = 0.1;

function main_cb (obj,id) {
	
	
    var elapsed = m_ctl.get_sensor_value(obj, id, 0); 
    console.log(id)
    console.log(obj)
	console.log(elapsed)
	console.log(speed)
    //move    
    m_trans.move_local(obj, speed*elapsed, 0, 0);	

}


function load_cb(data_id) {
    m_app.enable_camera_controls();
	var obj = m_scs.get_object_by_name("Cube");
	var elapsed_sensor = m_ctl.create_elapsed_sensor();
	m_ctl.create_sensor_manifold(obj, "MAIN", m_ctl.CT_CONTINUOUS, [elapsed_sensor], null, main_cb, [obj, "main"]);
}

});

b4w.require("instancing").init(); 