"use strict"

// register the application module
b4w.register("christmas", function(exports, require) {

// import modules used by the app
var m_app       = require("app");
var m_data      = require("data");
var m_scene = b4w.require("scenes");
var m_ctr = b4w.require("controls");
var m_light = b4w.require("lights");
var m_anim = b4w.require("animation");
var m_material = b4w.require("material");
var m_sfx = b4w.require("sfx");
var m_preloader = require("preloader");



//global vars
var _attempt = 0;

//buttons
var _btRed, _btGreen, _btBlue;
var _st_sens1, _st_sens2, _st_sens3;

//"ABC" - true
var _result_buttons="";

var _btWrong;
var st_btWrong;
var _btWrong2;
var st_btWrong2;
var _btWrong3;
var st_btWrong3;
var _btWrong4;
var st_btWrong4;
var _btWrong5;
var st_btWrong5;
var _btWrong6;
var st_btWrong6;

var _btSuccess;
var _st_btSuccess;

var _lamps = new Array();
var _StarLight_energy, _GreenLight1_energy, _GreenLight2_energy, _BlueLight1_energy, _BlueLight2_energy, _RedLight1_energy;

var _star, _toyRed1, _toyGreen1, _toyGreen2, _toyBlue1, _toyBlue2;
var _mat_Red, _mat_Green, _mat_Blue;

var _sfx_Bell1,_sfx_Bell2,_sfx_Bell3, _sfx_Wrong, _sfx_Success, _sfx_Final;

var fire1, fire2, fire3;
var _star1,_star2,_star3;

var _text1, _text2, _text3;

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
 * callback executed when the app is initizalized 
 */
function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }
    m_preloader.create_simple_preloader({
            bg_color:"#0CB5FF",
            bar_color:"#FFF",
            background_container_id: "preloader",
            canvas_container_id: "main_canvas_container",
            preloader_fadeout: true
    });
    load();
}

/**
 * load the scene data
 */
function load() {
    var p_cb = preloader_cb;
    m_data.load("christmas.json", load_cb,p_cb,true);
}

function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}
/**
 * callback executed when the scene is loaded
 */
function load_cb(data_id) {
    m_app.enable_controls();

    //ini
    init ();

    var sel_sensor = m_ctr.create_selection_sensor(_btRed, true);
    _st_sens1 = m_ctr.create_custom_sensor(0);
    var sens1 = new Array ();
    sens1 = [sel_sensor, _st_sens1];
    m_ctr.create_sensor_manifold (_btRed, "btRed", m_ctr.CT_SHOT, sens1, function(s) {return s[0]&& s[1]==0}, sel_sensor_cb, null);


    var sel_sensor2 = m_ctr.create_selection_sensor(_btBlue, true);
    _st_sens2 = m_ctr.create_custom_sensor(0);
    var sens2 = new Array ();
    sens2 = [sel_sensor2, _st_sens2];
    m_ctr.create_sensor_manifold (_btRed, "btBlue", m_ctr.CT_SHOT, sens2, function(s) {return s[0]&& s[1]==0}, sel_sensor_cb2, null);


    var sel_sensor3 = m_ctr.create_selection_sensor(_btGreen, true);
    _st_sens3 = m_ctr.create_custom_sensor(0);
    var sens3 = new Array ();
    sens3 = [sel_sensor3, _st_sens3];
    m_ctr.create_sensor_manifold (_btRed, "btGreen", m_ctr.CT_SHOT, sens3, function(s) {return s[0]&& s[1]==0}, sel_sensor_cb3, null);


    var logic_wrong= function(s) {
        var sum = m_ctr.get_custom_sensor(_st_sens1)+m_ctr.get_custom_sensor(_st_sens2)+m_ctr.get_custom_sensor(_st_sens3);
        s[0] = false;
        if (sum==3 && _result_buttons !="ABC" && _attempt ==0) s[0] = true;
        return s[0];
    }

    var logic_wrong2= function(s) {
        var sum = m_ctr.get_custom_sensor(_st_sens1)+m_ctr.get_custom_sensor(_st_sens2)+m_ctr.get_custom_sensor(_st_sens3);
        s[0] = false;
        if (sum==3 && _result_buttons !="ABC" && _attempt ==1) s[0] = true;
        return s[0];
    }

    var logic_wrong3= function(s) {
        var sum = m_ctr.get_custom_sensor(_st_sens1)+m_ctr.get_custom_sensor(_st_sens2)+m_ctr.get_custom_sensor(_st_sens3);
        s[0] = false;
        if (sum==3 && _result_buttons !="ABC" && _attempt ==2) s[0] = true;
        return s[0];
    }

    var logic_wrong4= function(s) {
        var sum = m_ctr.get_custom_sensor(_st_sens1)+m_ctr.get_custom_sensor(_st_sens2)+m_ctr.get_custom_sensor(_st_sens3);
        s[0] = false;
        if (sum==3 && _result_buttons !="ABC" && _attempt ==3) s[0] = true;
        return s[0];
    }

    var logic_wrong5= function(s) {
        var sum = m_ctr.get_custom_sensor(_st_sens1)+m_ctr.get_custom_sensor(_st_sens2)+m_ctr.get_custom_sensor(_st_sens3);
        s[0] = false;
        if (sum==3 && _result_buttons !="ABC" && _attempt ==4) s[0] = true;
        return s[0];
    }    

    var logic_wrong6= function(s) {
        var sum = m_ctr.get_custom_sensor(_st_sens1)+m_ctr.get_custom_sensor(_st_sens2)+m_ctr.get_custom_sensor(_st_sens3);
        s[0] = false;
        if (sum==3 && _result_buttons !="ABC" && _attempt ==5) s[0] = true;
        return s[0];
    }

    var logic_success= function(s) {
        var sum = m_ctr.get_custom_sensor(_st_sens1)+m_ctr.get_custom_sensor(_st_sens2)+m_ctr.get_custom_sensor(_st_sens3);
        s[0] = false;
        if (sum==3 && _result_buttons =="ABC") s[0] = true;
        return s[0];
    }

    st_btWrong = m_ctr.create_custom_sensor(false);
    m_ctr.create_sensor_manifold (_btWrong, "btWrong", m_ctr.CT_SHOT, [st_btWrong], logic_wrong, wrong_cb, null);
    var sel_btWrong = m_ctr.create_selection_sensor(_btWrong, true);
    m_ctr.create_sensor_manifold (_btWrong, "sel_btWrong", m_ctr.CT_SHOT, [sel_btWrong], null, sel_wrong_cb, null);

    st_btWrong2 = m_ctr.create_custom_sensor(false);
    m_ctr.create_sensor_manifold (_btWrong2, "btWrong2", m_ctr.CT_SHOT, [st_btWrong2], logic_wrong2, wrong2_cb, null);
    var sel_btWrong2 = m_ctr.create_selection_sensor(_btWrong2, true);
    m_ctr.create_sensor_manifold (_btWrong2, "sel_btWrong", m_ctr.CT_SHOT, [sel_btWrong2], null, sel_wrong2_cb, null);

    st_btWrong3 = m_ctr.create_custom_sensor(false);
    m_ctr.create_sensor_manifold (_btWrong3, "btWrong3", m_ctr.CT_SHOT, [st_btWrong3], logic_wrong3, wrong3_cb, null);
    var sel_btWrong3 = m_ctr.create_selection_sensor(_btWrong3, true);
    m_ctr.create_sensor_manifold (_btWrong3, "sel_btWrong", m_ctr.CT_SHOT, [sel_btWrong3], null, sel_wrong3_cb, null);

    st_btWrong4 = m_ctr.create_custom_sensor(false);
    m_ctr.create_sensor_manifold (_btWrong4, "btWrong4", m_ctr.CT_SHOT, [st_btWrong4], logic_wrong4, wrong4_cb, null);
    var sel_btWrong4 = m_ctr.create_selection_sensor(_btWrong4, true);
    m_ctr.create_sensor_manifold (_btWrong4, "sel_btWrong", m_ctr.CT_SHOT, [sel_btWrong4], null, sel_wrong4_cb, null);

    st_btWrong5 = m_ctr.create_custom_sensor(false);
    m_ctr.create_sensor_manifold (_btWrong5, "btWrong5", m_ctr.CT_SHOT, [st_btWrong5], logic_wrong5, wrong5_cb, null);
    var sel_btWrong5 = m_ctr.create_selection_sensor(_btWrong5, true);
    m_ctr.create_sensor_manifold (_btWrong5, "sel_btWrong", m_ctr.CT_SHOT, [sel_btWrong5], null, sel_wrong5_cb, null); 

    st_btWrong6 = m_ctr.create_custom_sensor(false);
    m_ctr.create_sensor_manifold (_btWrong6, "btWrong6", m_ctr.CT_SHOT, [st_btWrong6], logic_wrong6, wrong6_cb, null);
    var sel_btWrong6 = m_ctr.create_selection_sensor(_btWrong6, true);
    m_ctr.create_sensor_manifold (_btWrong6, "sel_btWrong", m_ctr.CT_SHOT, [sel_btWrong6], null, sel_wrong6_cb, null);    

    _st_btSuccess = m_ctr.create_custom_sensor(false);
    m_ctr.create_sensor_manifold (_btSuccess, "btSuccess", m_ctr.CT_SHOT, [_st_btSuccess], logic_success, success_cb, null);
    var sel_btSuccess = m_ctr.create_selection_sensor(_btSuccess, true);
    m_ctr.create_sensor_manifold (_btSuccess, "sel_btSuccess", m_ctr.CT_SHOT, [sel_btSuccess], null, sel_btSuccess_cb, null);     
}


function sel_wrong_cb () {
    _attempt = _attempt+1;
    m_anim.set_first_frame(_btWrong);
    reset_all();
}

function wrong_cb () {
    m_anim.apply_def(_btWrong);
    m_anim.set_behavior(_btWrong, m_anim.AB_FINISH_STOP);
    m_anim.set_speed(_btWrong, 1);
    m_anim.play(_btWrong);
    m_sfx.play(_sfx_Wrong,1.3);
}

function sel_wrong2_cb () {
    _attempt = _attempt+1;
    m_anim.set_first_frame(_btWrong2);
    reset_all();
}

function wrong2_cb () {
    m_anim.apply_def(_btWrong2);
    m_anim.set_behavior(_btWrong2, m_anim.AB_FINISH_STOP);
    m_anim.set_speed(_btWrong2, 1);
    m_anim.play(_btWrong2);
    m_sfx.play(_sfx_Wrong,1.3);
}

function sel_wrong3_cb () {
    _attempt = _attempt+1;
    m_anim.set_first_frame(_btWrong3);
    reset_all();
}

function wrong3_cb () {
    m_anim.apply_def(_btWrong3);
    m_anim.set_behavior(_btWrong3, m_anim.AB_FINISH_STOP);
    m_anim.set_speed(_btWrong3, 1);
    m_anim.play(_btWrong3);
    m_sfx.play(_sfx_Wrong,1.3);
}

function sel_wrong4_cb () {
    _attempt = _attempt+1;
    m_anim.set_first_frame(_btWrong4);
    reset_all();
}

function wrong4_cb () {
    m_anim.apply_def(_btWrong4);
    m_anim.set_behavior(_btWrong4, m_anim.AB_FINISH_STOP);
    m_anim.set_speed(_btWrong4, 1);
    m_anim.play(_btWrong4);
    m_sfx.play(_sfx_Wrong,1.3);
}

function sel_wrong5_cb () {
    _attempt = _attempt+1;
    m_anim.set_first_frame(_btWrong5);
    reset_all();
}

function wrong5_cb () {
    m_anim.apply_def(_btWrong5);
    m_anim.set_behavior(_btWrong5, m_anim.AB_FINISH_STOP);
    m_anim.set_speed(_btWrong5, 1);
    m_anim.play(_btWrong5);
    m_sfx.play(_sfx_Wrong,1.3);
}

function sel_wrong6_cb () {
    _attempt = 5;
    m_anim.set_first_frame(_btWrong6);
    reset_all();
}

function wrong6_cb () {
    m_anim.apply_def(_btWrong6);
    m_anim.set_behavior(_btWrong6, m_anim.AB_FINISH_STOP);
    m_anim.set_speed(_btWrong6, 1);
    m_anim.play(_btWrong6);
    m_sfx.play(_sfx_Wrong,1.3);
}

function sel_btSuccess_cb () {

    m_anim.set_first_frame(_btSuccess);

    m_scene.show_object(fire1);
    m_scene.show_object(fire2);
    m_scene.show_object(fire3);

    m_scene.show_object(_text1);
    m_scene.show_object(_text2);
    m_scene.show_object(_text3);

    m_scene.show_object(_star1);
    m_scene.show_object(_star2);

    var new_year1 = m_scene.get_object_by_name("newyear1");
    var new_year2 = m_scene.get_object_by_name("newyear2");
    var new_year3 = m_scene.get_object_by_name("2016");

    m_anim.apply_def(new_year1);
    m_anim.set_behavior(new_year1, m_anim.AB_FINISH_STOP);
    m_anim.set_speed(new_year1, 1);
    m_anim.play(new_year1);

    m_anim.apply_def(new_year2);
    m_anim.set_behavior(new_year2, m_anim.AB_FINISH_STOP);
    m_anim.set_speed(new_year2, 1);
    m_anim.play(new_year2);

    m_anim.apply_def(new_year3);
    m_anim.set_behavior(new_year3, m_anim.AB_FINISH_STOP);
    m_anim.set_speed(new_year3, 1);
    m_anim.play(new_year3);
    m_sfx.cyclic(_sfx_Final, true);
    m_sfx.play(_sfx_Final);
}

function success_cb () {
    m_anim.apply_def(_btSuccess);
    m_anim.set_behavior(_btSuccess, m_anim.AB_FINISH_STOP);
    m_anim.set_speed(_btSuccess, 1);
    m_anim.play(_btSuccess);
    m_sfx.play(_sfx_Success,1.3);
}

function sel_sensor_cb () {
        m_ctr.set_custom_sensor(_st_sens1, 1);

        _result_buttons = _result_buttons+"A";
        m_scene.set_outline_intensity(_btRed, 1);

        m_anim.apply_def(_btRed);
        m_anim.set_behavior(_btRed, m_anim.AB_FINISH_STOP);
        m_anim.set_speed(_btRed, 1);
        m_anim.play(_btRed);
        
        for(var i=0; i<_lamps.length; i++) {
            if (_lamps[i].name == "StarLight") {
                var param = m_light.get_light_params(_lamps[i]);
                param.light_energy = _StarLight_energy;
                m_light.set_light_params(_lamps[i], param);
            }
            if (_lamps[i].name == "RedLight1") {
                var param = m_light.get_light_params(_lamps[i]);
                param.light_energy = _RedLight1_energy ;
                m_light.set_light_params(_lamps[i], param);
            }
        }
        
        //set emitter
         m_material.set_emit_factor(_star, "red", _mat_Red);
         m_material.set_emit_factor(_toyRed1, "red", _mat_Red);

         m_sfx.play(_sfx_Bell1);
}

function sel_sensor_cb2 () {
    m_ctr.set_custom_sensor(_st_sens2, 1);

    _result_buttons = _result_buttons+"B";

        m_scene.set_outline_intensity(_btBlue, 1);

        m_anim.apply_def(_btBlue);
        m_anim.set_behavior(_btBlue, m_anim.AB_FINISH_STOP);
        m_anim.set_speed(_btBlue, 1);
        m_anim.play(_btBlue);
        
        for(var i=0; i<_lamps.length; i++) {
            if (_lamps[i].name == "BlueLight1") {
                var param = m_light.get_light_params(_lamps[i]);
                param.light_energy = _StarLight_energy;
                m_light.set_light_params(_lamps[i], param);
            }
            if (_lamps[i].name == "BlueLight2") {
                var param = m_light.get_light_params(_lamps[i]);
                param.light_energy = _RedLight1_energy ;
                m_light.set_light_params(_lamps[i], param);
            }
        }
        
        //set emitter
         m_material.set_emit_factor(_toyBlue1, "blue", _mat_Blue);
         m_material.set_emit_factor(_toyBlue2, "blue", _mat_Blue);

         m_sfx.play(_sfx_Bell2);
}

function sel_sensor_cb3 () {
    m_ctr.set_custom_sensor(_st_sens3, 1);

    _result_buttons = _result_buttons+"C";
        m_scene.set_outline_intensity(_btGreen, 1);

        m_anim.apply_def(_btGreen);
        m_anim.set_behavior(_btGreen, m_anim.AB_FINISH_STOP);
        m_anim.set_speed(_btGreen, 1);
        m_anim.play(_btGreen);
        
        for(var i=0; i<_lamps.length; i++) {
            if (_lamps[i].name == "GreenLight1") {
                var param = m_light.get_light_params(_lamps[i]);
                param.light_energy = _StarLight_energy;
                m_light.set_light_params(_lamps[i], param);
            }
            if (_lamps[i].name == "GreenLight2") {
                var param = m_light.get_light_params(_lamps[i]);
                param.light_energy = _RedLight1_energy ;
                m_light.set_light_params(_lamps[i], param);
            }
        }
        
        //set emitter
         m_material.set_emit_factor(_toyGreen1, "green", _mat_Green);
         m_material.set_emit_factor(_toyGreen2, "green", _mat_Green);

         m_sfx.play(_sfx_Bell3);
}


//initialisation lamps
function init () {
    _lamps = new Array();
    _lamps=m_light.get_lamps();

    _btRed = m_scene.get_object_by_name("btRed");
    _btGreen = m_scene.get_object_by_name("btGreen");
    _btBlue = m_scene.get_object_by_name("btBlue");

    _btWrong = m_scene.get_object_by_name("btWrong");
    _btWrong2 = m_scene.get_object_by_name("btWrong2");
    _btWrong3 = m_scene.get_object_by_name("btWrong3");
    _btWrong4 = m_scene.get_object_by_name("btWrong4");    
    _btWrong5 = m_scene.get_object_by_name("btWrong5");      
    _btWrong6 = m_scene.get_object_by_name("btWrong6");
    _btSuccess = m_scene.get_object_by_name("btSuccess");   

    fire1 = m_scene.get_object_by_name("fire1");
    fire2 = m_scene.get_object_by_name("fire2");
    fire3 = m_scene.get_object_by_name("fire3");         

    m_scene.hide_object(fire1);
    m_scene.hide_object(fire2);
    m_scene.hide_object(fire3);

    _star1 = m_scene.get_object_by_name("Star1");
    _star2 = m_scene.get_object_by_name("Star2");

    m_scene.hide_object(_star1);
    m_scene.hide_object(_star2);

    _text1 = m_scene.get_object_by_name("text1");
    _text2 = m_scene.get_object_by_name("text2");
    _text3 = m_scene.get_object_by_name("text3");

    m_scene.hide_object(_text1);
    m_scene.hide_object(_text2);
    m_scene.hide_object(_text3);



    for(var i=0; i<_lamps.length; i++) {
            var param = m_light.get_light_params(_lamps[i]);

            if (_lamps[i].name == "StarLight")
                _StarLight_energy = param.light_energy;
            if (_lamps[i].name == "GreenLight1")
                _GreenLight1_energy = param.light_energy;
            if (_lamps[i].name == "BlueLight1")
                _BlueLight1_energy = param.light_energy;
            if (_lamps[i].name == "RedLight1")
                _RedLight1_energy = param.light_energy;
            if (_lamps[i].name == "GreenLight2")
                _GreenLight2_energy = param.light_energy;
            if (_lamps[i].name == "BlueLight2")
                _BlueLight2_energy = param.light_energy;

            param.light_energy = 0;
            if (_lamps[i].name != "GlobalLamp") m_light.set_light_params(_lamps[i], param);
        }

        _star = m_scene.get_object_by_name("Star"); 
        _toyRed1 = m_scene.get_object_by_name("toyRed1"); 
        _toyGreen1 = m_scene.get_object_by_name("toyGreen1"); 
        _toyGreen2 = m_scene.get_object_by_name("toyGreen2"); 
        _toyBlue1 = m_scene.get_object_by_name("toyBlue1"); 
        _toyBlue2 = m_scene.get_object_by_name("toyBlue2"); 

        _mat_Red = m_material.get_emit_factor(_toyRed1, "red");
        _mat_Green = m_material.get_emit_factor(_toyGreen1, "green");
        _mat_Blue = m_material.get_emit_factor(_toyBlue1, "blue");

        m_material.set_emit_factor(_star, "red", 0);
        m_material.set_emit_factor(_toyRed1, "red", 0);
        m_material.set_emit_factor(_toyGreen1, "green", 0);
        m_material.set_emit_factor(_toyGreen2, "green", 0);
        m_material.set_emit_factor(_toyBlue1, "blue", 0);
        m_material.set_emit_factor(_toyBlue2, "blue", 0);

        var sfx = m_sfx.get_speaker_objects();
        for(var i=0; i<sfx.length; i++) {
            if (sfx[i].name == "sfxBell1") {
                _sfx_Bell1 = sfx[i];
            }
            if (sfx[i].name == "sfxBell2") {
                 _sfx_Bell2 = sfx[i];
            }
            if (sfx[i].name == "sfxBell3") {
                _sfx_Bell3 = sfx[i];
            }
            if (sfx[i].name == "sfxWrong") {
                _sfx_Wrong = sfx[i];
            }
            if (sfx[i].name == "sfxSuccess") {
                _sfx_Success = sfx[i];
            }
            if (sfx[i].name == "sfxFinal") {
                _sfx_Final = sfx[i];
            }
        }
}

//reset all params
function reset_all () {

    m_scene.set_outline_intensity(_btRed, 0);
    m_anim.set_speed(_btRed, -1);
    m_anim.play(_btRed);

    m_scene.set_outline_intensity(_btGreen, 0);
    m_anim.set_speed(_btGreen, -1);
    m_anim.play(_btGreen);

    m_scene.set_outline_intensity(_btBlue, 0);
    m_anim.set_speed(_btBlue, -1);
    m_anim.play(_btBlue);

    _result_buttons = "";

    m_ctr.set_custom_sensor(_st_sens1, 0);
    m_ctr.set_custom_sensor(_st_sens2, 0);
    m_ctr.set_custom_sensor(_st_sens3, 0);

    for(var i=0; i<_lamps.length; i++) {
            var param = m_light.get_light_params(_lamps[i]);

            if (_lamps[i].name == "StarLight")
                _StarLight_energy = param.light_energy;
            if (_lamps[i].name == "GreenLight1")
                _GreenLight1_energy = param.light_energy;
            if (_lamps[i].name == "BlueLight1")
                _BlueLight1_energy = param.light_energy;
            if (_lamps[i].name == "RedLight1")
                _RedLight1_energy = param.light_energy;
            if (_lamps[i].name == "GreenLight2")
                _GreenLight2_energy = param.light_energy;
            if (_lamps[i].name == "BlueLight2")
                _BlueLight2_energy = param.light_energy;

            param.light_energy = 0;
            if (_lamps[i].name != "GlobalLamp") m_light.set_light_params(_lamps[i], param);
        }

        m_material.set_emit_factor(_star, "red", 0);
        m_material.set_emit_factor(_toyRed1, "red", 0);
        m_material.set_emit_factor(_toyBlue1, "blue", 0);
        m_material.set_emit_factor(_toyBlue2, "blue", 0);
        m_material.set_emit_factor(_toyGreen1, "green", 0);
        m_material.set_emit_factor(_toyGreen2, "green", 0);
}
});

// import the app module and start the app by calling the init method
b4w.require("christmas").init();
