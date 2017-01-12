"use strict"

// register the application module
b4w.register("simple_app", function(exports, require) {

// import modules used by the app
var m_anim      = require("animation");
var m_app       = require("app");
var m_cfg       = require("config");
var m_data      = require("data");
var m_mouse     = require("mouse");
var m_preloader = require("preloader");
var m_scenes    = require("scenes");
var m_version   = require("version");

var DEBUG = (m_version.type() === "DEBUG");

var _previous_selected_obj = null;

/**
 * export the method to initialize the app (called at the bottom of this file)
 */
exports.init = function() {
    var show_fps = DEBUG;

    var url_params = m_app.get_url_params();

    if (url_params && "show_fps" in url_params)
        show_fps = true;

    m_app.init({
        canvas_container_id: "viewport",
        callback: init_cb,
        show_fps: show_fps,
        console_verbose: true,
        assets_dds_available: !DEBUG,
        assets_min50_available: !DEBUG,
        autoresize: true
    });
}

/**
 * callback executed when the app is initizalized 
 */
function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_preloader.create_preloader();
    canvas_elem.addEventListener("mousedown", main_canvas_click, false);
    canvas_elem.addEventListener("touchstart", main_canvas_click, false);

    load();
}

function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}

/**
 * load the scene data
 */
function load() {
    var load_path = "data/simple_app.json";
    m_data.load(load_path, load_cb, preloader_cb);
}

/**
 * callback executed when the scene is loaded
 */
function load_cb(data_id) {
	var seen = [];
    m_app.enable_camera_controls();
    // for(var val in m_scenes.get_all_objects()){
    // 	console.log(m_scenes.get_all_objects()[val]['name']);
    // 	console.log(m_anim.get_anim_names(m_scenes.get_all_objects()[val]));
    // }
    // place your code here

}
var _global_picked_obj;

function main_canvas_click(e) {
    if (e.preventDefault)
        e.preventDefault();
    var foo = document.getElementById("controls");

    while (foo.hasChildNodes()) {
        foo.removeChild(foo.firstChild);
    }

    var x = m_mouse.get_coords_x(e);
    var y = m_mouse.get_coords_y(e);

    var obj = m_scenes.pick_object(x, y);
    if (obj){
	    _global_picked_obj = obj;
	    console.log(obj['name']);
	   	console.log(m_anim.get_anim_names(obj));

	   	// for (var temp in m_anim.get_anim_names(obj)){
	   	// 	console.log(m_anim.get_anim_names(obj)[temp]);
	   	// 	var temp2 = m_anim.get_anim_length(obj)[temp];
	   	// 	add(m_anim.get_anim_names(obj)[temp] ,temp2);
	   	// }
	   	m_anim.apply_def(obj);
	   	console.log(m_anim.get_current_anim_name(obj));

	   	var temp2 = m_anim.get_anim_length(obj,m_anim.SLOT_0);
	   	add(m_anim.get_current_anim_name(obj, m_anim.SLOT_0), temp2);
	}
    _previous_selected_obj
    /*
    if (obj) {
        if (_previous_selected_obj_previous_selected_obj) {
            m_anim.stop(_previous_selected_obj);
            m_anim.set_frame(_previous_selected_obj, 0);
        }
        _previous_selected_obj = obj;

        m_anim.apply_def(obj);
        m_anim.play(obj);
    }*/
};

function add(type, animLength) {
  //Create an input type dynamically.  
  var element = document.createElement("input");
  //Assign different attributes to the element. 
  element.type = "range";
  element.value = type; // Really? You want the default value to be the type string?
  element.name = "P"; // And the name too?
  element.innerHTML = type;
  element.min = 0;
  element.max = animLength;
  element.onclick = function() { // Note this is a function
     //m_anim.apply(_global_picked_obj, type);
     //m_anim.play(_global_picked_obj);
  };
  element.onchange = function(){
  	//m_anim.set_first_frame(_global_picked_obj, element.value);
  	m_anim.set_frame(_global_picked_obj, element.value, m_anim.SLOT_0);
  	// m_anim.set_last_frame(_global_picked_obj, element.value);
  	console.log(type);
  	console.log(m_anim.get_anim_length(_global_picked_obj) + ': '+ element.value);
  	console.log("changed");
  }

  var foo = document.getElementById("controls");
  //Append the element in page (in span).  
  foo.appendChild(element);


  var element2 = document.createElement("input");
  element2.type = "button";
  element2.value = type; // Really? You want the default value to be the type string?
  element2.name = "P"; // And the name too?
  element2.innerHTML = type;
  element2.onclick = function(){
  	m_anim.play(_global_picked_obj, m_anim.SLOT_0);
   	console.log(m_anim.get_anim_start_frame(_global_picked_obj, m_anim.SLOT_0));
  	console.log("clicked");
  }
  var foo = document.getElementById("controls");
  //Append the element in page (in span).  
  foo.appendChild(element2); 
};


});

// import the app module and start the app by calling the init method
b4w.require("simple_app").init();
