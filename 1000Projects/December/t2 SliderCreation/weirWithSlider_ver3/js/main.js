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
var m_preloader = require("preloader");


var DEBUG = (m_version.type() === "DEBUG");

var _prev_mouse_x = 0;
var _prev_mouse_y = 0;

var _controlled_bone = null;

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

    canvas_elem.addEventListener("mousedown", click_cb, false);
    canvas_elem.addEventListener("mousemove", mousemove_cb, false);

    canvas_elem.addEventListener("mouseup", mouseup_cb, false);
    canvas_elem.addEventListener("mouseout", mouseup_cb, false);

}

function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}

function load() {
    m_data.load("data/model.json", load_cb, preloader_cb);
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
        console.log(allObj[val])
     }


    m_anim.apply(m_scenes.get_object_by_name("Box009"), "water", m_anim.SLOT_1)
    m_anim.apply(m_scenes.get_object_by_name("Rectangle001"), "Rectangle001Action", m_anim.SLOT_2)
}

var index = 0;

function create_slider(slider_name) {
    
    var slider = init_slider(slider_name);
    var value_label = document.getElementById(slider_name);

    var value = 0;

    slider.id = "slider";
    slider.min = 1;
    slider.max = 200;
    slider.step = 0.1;
    slider.value = value;
    value_label.textContent = slider.value;

    function slider_changed(e) {
        m_anim.set_frame(m_scenes.get_object_by_name("Box009"), Math.round(slider.value), m_anim.SLOT_1);
        m_anim.set_frame(m_scenes.get_object_by_name("Rectangle001"), Math.round(slider.value), m_anim.SLOT_2);
        console.log(slider.value)
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




function click_cb(e) {
    if (e.preventDefault)
        e.preventDefault();

    // var x = e.clientX;
    // var y = e.clientY;
    var x = m_mouse.get_coords_x(e);
    var y = m_mouse.get_coords_y(e);

    var obj = m_scenes.pick_object(x, y);

    if (!obj)
        return;

    m_app.disable_camera_controls();

    switch(obj.name) {
    case "Rectangle001":
        _controlled_bone = "Rectangle001";
        break;
    default:
        break;
    }
}

function mousemove_cb(e) {

    if (!_controlled_bone)
        return;

    
    var m_x = e.clientX - _prev_mouse_x;
    var m_y = e.clientY - _prev_mouse_y;

    // console.log(m_y)
    var move = 20;
    if (m_y > move)
        m_y = move / 2;
    else if (m_y < -move)
        m_y = -move / 2;
    else{
        m_y = m_y / 2;
        console.log(m_y)
    }

    var frame = m_anim.get_frame(m_scenes.get_object_by_name("Box009"),m_anim.SLOT_1);
    var framePos = Math.round(frame + m_y);

    console.log(Math.abs(frame + m_y))
    if (framePos > 100){
        framePos = 100;
    }
    else if (framePos < 0){
        framePos = 0;
    }
    var value_label = document.getElementById("Frame");
    value_label.textContent = framePos;
    var slider = document.getElementById("slider");
    slider.value = framePos;

    m_anim.set_frame(m_scenes.get_object_by_name("Box009"),Math.round(framePos) , m_anim.SLOT_1);
    m_anim.set_frame(m_scenes.get_object_by_name("Rectangle001"), Math.round(framePos), m_anim.SLOT_2);


    _prev_mouse_x = e.clientX;
    _prev_mouse_y = e.clientY;
}

function mouseup_cb() {
    if (_controlled_bone)
        m_app.enable_camera_controls();
    _controlled_bone = null;
}




});
b4w.require("camera_move_styles").init(); 
