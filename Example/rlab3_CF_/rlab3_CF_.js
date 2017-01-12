"use strict"

// register the application module
b4w.register("rlab3_CF_", function(exports, require) {

// import modules used by the app
var m_app       = require("app");
var m_data      = require("data");
var m_scenes    = require("scenes");
var m_transform = require("transform");
var m_tsr       = require("tsr");
var m_quat      = require("quat");

/*
button control class
*/
class ButtonCl{
    constructor(cnt,rot){
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
        }

    init_button() {
    var button = document.getElementById("button1");
    button.addEventListener("click", this.on_press1.bind(this));
        button = document.getElementById("button2");
    button.addEventListener("click", this.on_press2.bind(this));
        button = document.getElementById("button3");
    button.addEventListener("click", this.on_press3.bind(this));
    
    var slider = document.getElementById("sliderX");
        slider.addEventListener("input", this.on_change_x.bind(this));
    slider = document.getElementById("sliderY");
        slider.addEventListener("input", this.on_change_y.bind(this));
    slider = document.getElementById("sliderZ");
        slider.addEventListener("input", this.on_change_z.bind(this));
    

                }
    
    on_press1 () { 
        this.rotationX +=  0.02;
        this.rotateXYZ();
            }
    on_press2 () {
        this.rotationY +=  0.02;
        this.rotateXYZ();
    
            }
    on_press3 () {
        this.rotationZ +=  0.02;
        this.rotateXYZ();
                }
    on_change_x () {
        var slider = document.getElementById("sliderX");
        this.rotationX = slider.value / 180 * Math.PI;
        this.rotateXYZ();
            }
    on_change_y () {
        var slider = document.getElementById("sliderY");
        this.rotationZ = slider.value / 180 * Math.PI;
        this.rotateXYZ();
            }
    on_change_z () {
        var slider = document.getElementById("sliderZ");
        this.rotationY = slider.value / 180 * Math.PI;
        console.log('slider Z')
        this.rotateXYZ();

        //console.log(slider.value)
        //console.log(this.rotationY)
            }

    rotateXYZ(){
                var cube = m_scenes.get_object_by_name("Cube");
                //создаем кватернион из углов

                var qI = m_quat.create(); m_quat.normalize(qI, qI);
                //m_transform.get_rotation(cube, qI);

                var qx  = m_quat.create(); m_quat.rotateX(qI, this.rotationX, qx);
                var qy  = m_quat.create(); m_quat.rotateY(qI, this.rotationY, qy);
                var qz  = m_quat.create(); m_quat.rotateZ(qI, this.rotationZ, qz);
                
                var quat_rot = m_quat.create(); 

                m_quat.multiply(qy, qx, quat_rot); 
                m_quat.multiply(quat_rot, qz, quat_rot);
                
                var transVec = m_tsr.create();
                m_tsr.set_quat(quat_rot, transVec);

                console.log(quat_rot)

                 //m_transform.set_rotation(cube, 0.1, 0.1, 0.1, 0);
                m_transform.set_tsr_rel(cube, transVec);  
                }

    }

var button_obj  = new ButtonCl(0,0);

/**
 * export the method to initialize the app (called at the bottom of this file)
 */
exports.init = function() {
    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        show_fps: true,
        console_verbose: true,
        autoresize: true
    });
}

/**
 * callback executed when the app is initialized 
 */
function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    // ignore right-click on the canvas element
    canvas_elem.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    load();
}

/**
 * load the scene data
 */
function load() {
    m_data.load("rlab3_CF_.json", load_cb);
}

/**
 * callback executed when the scene is loaded
 */
function load_cb(data_id) {
    m_app.enable_camera_controls();
    button_obj.init_button();
    // place your code here

}


function init_menu() {
    var button = document.getElementById("button1");
    button.addEventListener("click", Button_function)
}

function Button_function(){
    console.log('button_pressed')
    var cube = m_scenes.get_object_by_name("Cube");

    var transVec = m_tsr.from_values(0,0,0,1,0.1,0.1,0.1,1);
    //m_transform.set_rotation(cube, 0.1, 0.1, 0.1, 0);
    m_transform.set_tsr(cube, transVec);
}


});

// import the app module and start the app by calling the init method
b4w.require("rlab3_CF_").init();
