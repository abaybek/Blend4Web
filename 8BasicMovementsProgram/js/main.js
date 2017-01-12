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


var speed = 2;

function main_cb (obj,id) {

    var elapsed = m_ctl.get_sensor_value(obj, id, 0); 
 //    console.log(id)
 //    console.log(obj)
	// console.log(elapsed)
	// console.log(speed)
    //move    
    m_trans.move_local(obj, speed*elapsed, 0, 0);	

}

function main2_cb (obj,id) {

    var elapsed = m_ctl.get_sensor_value(obj, id, 0); 
 //    console.log(id)
 //    console.log(obj)
	// console.log(elapsed)
	// console.log(speed)
    //move    
    m_trans.rotate_x_local(obj, speed*elapsed);	

}
	var temp = 1;
function main3_cb (obj,id) {

    var elapsed = m_ctl.get_sensor_value(obj, id, 0); 
    console.log(id)
    console.log(obj)
	console.log(elapsed)
	console.log(speed)
    //move    
    temp = temp * ((speed*elapsed)/40 + 1)
    console.log(temp)
    m_trans.set_scale(obj, temp);	

}


function load_cb(data_id) {
    m_app.enable_camera_controls();
	var obj = m_scs.get_object_by_name("gem_1");
	var obj2 = m_scs.get_object_by_name("gem_2");
	var obj3 = m_scs.get_object_by_name("gem_3");
	var elapsed_sensor = m_ctl.create_elapsed_sensor();
	m_ctl.create_sensor_manifold(obj, "MAIN", m_ctl.CT_CONTINUOUS, [elapsed_sensor], null, main_cb, [obj, "main"]);
	m_ctl.create_sensor_manifold(obj2, "MAIN2", m_ctl.CT_CONTINUOUS, [elapsed_sensor], null, main2_cb, [obj2, "main2"]);
	m_ctl.create_sensor_manifold(obj3, "MAIN3", m_ctl.CT_CONTINUOUS, [elapsed_sensor], null, main3_cb, [obj3, "main3"]);
}

});

b4w.require("instancing").init(); 