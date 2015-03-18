
var control;

var HIT_TEST;

var Control = function()
{
	this.fl = {};
}

Control.prototype.init = function()
{
	this.fl.x 				= 0;
	this.fl.x_target 	= 0;
	this.fl.x_safe		= 0;

	this.fl.y 				= 0;
	this.fl.y_target 	= 0;
	this.fl.y_safe		= 0;

	this.fl.move			= 40;
	this.animate 			= false;

	this.signal				= "";
}

Control.prototype.updateX = function(x)
{
	this.fl.x_target += x;

	if(this.fl.x_target != this.fl.x)
	{
		// this.animate = true;
	}
}

Control.prototype.updateY = function(y)
{
	this.fl.y_target += y;

	if(this.fl.y_target != this.fl.y)
	{
		// this.animate = true;
	}
}

Control.prototype.updateXY = function(x, y)
{
	this.fl.x_target += x;
	this.fl.y_target += y;
}


function control_init()
{
	control = new Control();

	control.init();

	hitTest_init();
}

function control_run(run)
{
	if(run)
	{
		// CONTROLS
		$(window)[0].addEventListener("keydown", control_event, false);
		$(window)[0].addEventListener("keyup", control_event, false);

		// PLAYER
		$(".player").addClass("tween-controlPlayer");

		$(".tween-controlPlayer")[0].addEventListener("webkitTransitionEnd", control_cssAddEvent, false);
		$(".tween-controlPlayer")[0].addEventListener("transitionend", control_cssAddEvent, false);
	}

	else
	{
		// CONTROLS
		$(window)[0].removeEventListener("keydown", control_event, false);
		$(window)[0].removeEventListener("keyup", control_event, false);

		// PLAYER
		$(".tween-controlPlayer")[0].removeEventListener("webkitTransitionEnd", control_cssAddEvent, false);
		$(".tween-controlPlayer")[0].removeEventListener("transitionend", control_cssAddEvent, false);

		$(".player").removeClass("tween-controlPlayer");
	}
}

function control_event(event)
{
	if(!control.animate && event.type === "keydown")
	{
		// U
		if(event.keyCode == 38)
		{
			control.signal = "U";
			// control.updateY(-control.fl.move);
			control.updateXY(0, -control.fl.move);
		}

		// D
		else if(event.keyCode == 40)
		{
			control.signal = "D";
			// control.updateY(control.fl.move);
			control.updateXY(0, control.fl.move);
		}

		// L
		else if(event.keyCode == 37)
		{
			control.signal = "L";
			// control.updateX(-control.fl.move);
			control.updateXY(-control.fl.move, 0);
		}

		// R
		else if(event.keyCode == 39)
		{
			control.signal = "R";
			// control.updateX(control.fl.move);
			control.updateXY(control.fl.move, 0);
		}

		control_cssAdd();

		if(control.animate)
		{
			// control_cssAdd();
		}
	}
}

function control_cssAdd()
{
	var css;
	var reset_hitTest = false;


	css = {
					"-webkit-transform" : "translate(" + control.fl.x_target + "px, " + control.fl.y_target + "px)",
					"transform" 				: "translate(" + control.fl.x_target + "px, " + control.fl.y_target + "px)"
				};

	$(".hitTest").css(css);

	hitTest_check();

	if(HIT_TEST.hit_edge)
	{
		reset_hitTest = true;
	}

	else
	{
		control.fl.x_safe = control.fl.x_target;
		control.fl.y_safe = control.fl.y_target;

		$(".player").css(css);
	}

	if(reset_hitTest)
	{
		reset_hitTest = false;

		css = {
						"-webkit-transform" : "translate(" + control.fl.x_safe + "px, " + control.fl.y_safe + "px)",
						"transform" 				: "translate(" + control.fl.x_safe + "px, " + control.fl.y_safe + "px)"
					};

		control.fl.x_target = control.fl.x_safe;
		control.fl.y_target = control.fl.y_safe;

		$(".hitTest").css(css);
		hitTest_init();
	}
}

function control_cssAddEvent(event)
{
	control.fl.x = control.fl.x_target;
	ontrol.fl.y = control.fl.y_target;

	control.animate = false;
}





function hitTest_init()
{
	HIT_TEST = {};

	HIT_TEST.hit_portal_id = "";
	HIT_TEST.hit_enemy_id = "";

	HIT_TEST.hit_edge = false;
	HIT_TEST.hit_portal = false;
	HIT_TEST.hit_enemy = false;
}

function hitTest_check()
{
	HIT_TEST.hits = $(".collideCheck-player").collision(".collideCheck-field");

	if(HIT_TEST.hits[0] != undefined || HIT_TEST.hits[0] != null)
	{
		if($(HIT_TEST.hits[0]).attr("data-npc") === "edge")
		{
			HIT_TEST.hit_edge = true;
		}
	}

}


