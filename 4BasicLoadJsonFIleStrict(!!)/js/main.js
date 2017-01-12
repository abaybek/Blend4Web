"use strict";
console.log("start");

b4w.register("main", function(exports, require) {

console.log("main started");

var m_app = require("app");
var m_data = require("data");
var m_cfg     = require("config");
var m_cont    = require("container");
var m_mouse   = require("mouse");
var m_tex     = require("textures");
var m_scenes  = require("scenes");
var m_version = require("version");

var DEBUG = (m_version.type() === "DEBUG");

exports.init = function() {
m_app.init({
        canvas_container_id: "canvas_cont",
        callback: init_cb,
        physics_enabled: false,
        alpha: true,
        show_fps: true,
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
    load_cb();
}

function load_cb() {
	console.log("data loaded");
	m_data.load("data/untitled.json", loaded_cb);
}

function loaded_cb() {
	console.log("camera control enabled");
	m_app.enable_camera_controls();
}

});


b4w.require("main").init();

console.log("end");