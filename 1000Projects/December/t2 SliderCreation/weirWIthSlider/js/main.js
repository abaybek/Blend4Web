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
    m_data.load("data/model.json", load_cb);
}

function load_cb(data_id) {   
    m_app.enable_camera_controls();
    init_interface();
 }
    

function init_interface(){
	var main_interface_container = document.createElement("div");
    main_interface_container.className = "main_sliders_container";
    main_interface_container.setAttribute("id", "main_sliders_container");
    document.body.appendChild(main_interface_container);
    create_slider("Frame");

     var allObj = m_scenes.get_all_objects();
     for(var val in allObj){
     	m_anim.remove(allObj[val])
     }


    m_anim.apply(m_scenes.get_object_by_name("Box009"), "water", m_anim.SLOT_1)
    m_anim.apply(m_scenes.get_object_by_name("Rectangle001"), "Rectangle001Action", m_anim.SLOT_2)
}

var index = 0;

function create_slider(slider_name) {
    
    var slider = init_slider(slider_name);
    var value_label = document.getElementById(slider_name);

    var value = 0;

    slider.min = 1;
    slider.max = 200;
    slider.step = 0.1;
    slider.value = value;
    value_label.textContent = slider.value;

    function slider_changed(e) {
        m_anim.set_frame(m_scenes.get_object_by_name("Box009"), Math.round(slider.value), m_anim.SLOT_1);
        m_anim.set_frame(m_scenes.get_object_by_name("Rectangle001"), Math.round(slider.value), m_anim.SLOT_2);
        console.log(slider.value)
        index++;
        value_label.textContent = Math.round(slider.value) ;// slider.value;
    }

    if (is_ie11())
        slider.onchange = slider_changed;
    else
        slider.oninput = slider_changed;
}


function init_slider(name) {
    var container = document.createElement("div");
    container.className = "slider_container";

    var name_label = document.createElement("label");
    name_label.className = "text_label";
    name_label.textContent = name;

    var slider = document.createElement("input");
    slider.className = "input_slider";
    slider.setAttribute("type", "range");

    var value_label = document.createElement("label");
    value_label.className = "value_label";
    value_label.setAttribute("id", name);

    container.appendChild(name_label);
    container.appendChild(slider);
    container.appendChild(value_label);

    var border = document.createElement("div");
    border.className = "border";
    border.appendChild(container);

    var main_slider_container = document.getElementById("main_sliders_container");
    main_slider_container.appendChild(border);

    return slider;
}


function is_ie11() {
    return !(window.ActiveXObject) && "ActiveXObject" in window;
}



});
b4w.require("camera_move_styles").init(); 
