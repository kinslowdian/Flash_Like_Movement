var trace = function(msg){ console.log(msg); };

var control;

var loopList;

var HIT_TEST;

var Control = function()
{
	this.fl = {};
}

Control.prototype.init = function()
{
	this.fl.target_x = 0;
	this.fl.target_y = 0;

	this.fl.target_safe_x = 0;
	this.fl.target_safe_y = 0;

	this.fl.target_move = 20;

	this.fl.x = 0;
	this.fl.y = 0;

	this.fl.move = 2;
	this.fl.moveX = 0;
	this.fl.moveY = 0;

	this.signal = false;

	this.dir = "";
}

$(document).ready(function(){ init(); });


function init()
{
	control = new Control();
	control.init();

	hitTest_init();

	loopList = new Array();

	loopList.push(onEnterFrame_direction);
	loopList.push(onEnterFrame_stepper);
	loopList.push(hack_hitTest);
	loopList.push(onEnterFrame_move);



	window.requestAnimationFrame(onEnterFrame);

	move_init(true);
}


function hitTest_init()
{
	HIT_TEST = {};

	HIT_TEST.hit_edge = false;
}

function move_init(run)
{
	if(run)
	{
		control.signal = true;

		$(window)[0].addEventListener("keydown", move_event, false);
		$(window)[0].addEventListener("keyup", move_event, false);
	}

	else
	{
		control.signal = false;

		$(window)[0].removeEventListener("keydown", move_event, false);
		$(window)[0].removeEventListener("keyup", move_event, false);
	}
}

function move_event(event)
{
	var tempSignal = "";

	if(event.type === "keyup")
	{
		control.dir = "STILL";
	}

	if(event.type === "keydown")
	{
		switch(event.keyCode)
		{
			case 37:
			{
				// LEFT
				tempSignal = "LEFT";

				break;
			}

			case 38:
			{
				// UP
				tempSignal = "UP";

				break;
			}

			case 39:
			{
				// RIGHT
				tempSignal = "RIGHT";

				break;
			}

			case 40:
			{
				// DOWN
				tempSignal = "DOWN";

				break;
			}

			default:
			{
				tempSignal = "STILL";
			}
		}

		if(control.signal)
		{
			control.dir = tempSignal;
		}
	}
}

function onEnterFrame()
{
	for(var i in loopList)
	{
		loopList[i]();
	}

	window.requestAnimationFrame(onEnterFrame);
}

function onEnterFrame_direction()
{
	if(control.signal)
	{
		if(control.dir === "UP")
		{
			if(control.fl.y == control.fl.target_y)
			{
				control.fl.moveY = -(control.fl.move);
				control.fl.target_y -= control.fl.target_move;
			}
		}

		else if(control.dir === "DOWN")
		{
			if(control.fl.y == control.fl.target_y)
			{
				control.fl.moveY = control.fl.move;
				control.fl.target_y += control.fl.target_move;
			}
		}

		if(control.dir === "LEFT")
		{
			if(control.fl.x == control.fl.target_x)
			{
				control.fl.moveX = -(control.fl.move);
				control.fl.target_x -= control.fl.target_move;
			}
		}

		else if(control.dir === "RIGHT")
		{
			if(control.fl.x == control.fl.target_x)
			{
				control.fl.moveX = control.fl.move;
				control.fl.target_x += control.fl.target_move;
			}
		}
	}

	else
	{

	}
}

function hack_hitTest()
{
	HIT_TEST.hits = $(".collideCheck-player").collision(".collideCheck-field");

	if(HIT_TEST.hits[0] != undefined || HIT_TEST.hits[0] != null)
	{
		if($(HIT_TEST.hits[0]).attr("data-npc") === "edge")
		{
			HIT_TEST.hit_edge = true;

			control.signal = false;
		}
	}

	else
	{

	}

	$(".status p").html(HIT_TEST.hit_edge.toString());

	hack_hitTest_update();
}

function hack_hitTest_update()
{
	if(HIT_TEST.hit_edge)
	{
		// HIT ISSUE SO USE SAFE X & Y (EXTRA WRITE)

		control.fl.target_x = control.fl.target_safe_x;
		control.fl.target_y = control.fl.target_safe_y;

		// RESET CONTROL AND HIT TEST

		// REVERSE LOGIC??

		if(HIT_TEST.hit_edge)
		{
			HIT_TEST.hit_edge = false;
		}

		if(!control.signal)
		{
			control.signal = true;
		}

		// REVERSE LOGIC??
	}

	else
	{
		// SAFE VALUES UPDATED

		control.fl.target_safe_x = control.fl.target_x;
		control.fl.target_safe_y = control.fl.target_y;
	}
}


function onEnterFrame_stepper()
{
	var css;

	var finalMoveX;
	var finalMoveY;

	if(control.signal)
	{
		// USE TARGET X & Y

		finalMoveX = control.fl.target_x;
		finalMoveY = control.fl.target_y;
	}

	else
	{
		// HIT ISSUE SO USE SAFE X & Y

		finalMoveX = control.fl.target_safe_x;
		finalMoveY = control.fl.target_safe_y;
	}

	css = {
					"-webkit-transform"	: "translate(" + finalMoveX + "px, " + finalMoveY + "px)",
					"transform"					: "translate(" + finalMoveX + "px, " + finalMoveY + "px)"
				};

	$(".hitTest").css(css);
}

function onEnterFrame_move()
{
	var css;

	if(control.fl.x != control.fl.target_x)
	{
		// ADD NORMAL MOVEMENT
		control.fl.x += control.fl.moveX;
	}

	if(control.fl.y != control.fl.target_y)
	{
		// ADD NORMAL MOVEMENT
		control.fl.y += control.fl.moveY;
	}

	css = {
					"-webkit-transform"	: "translate(" + control.fl.x + "px, " + control.fl.y + "px)",
					"transform"					: "translate(" + control.fl.x + "px, " + control.fl.y + "px)"
				};

	$(".player").css(css);

}

