var trace = function(msg){ console.log(msg); };

var control;

var loopList;

var HIT_TEST;

var basic;

$(document).ready(function(){ init(); });


function init()
{
	control = {};

	control.fl = {};

	// VELOCITY
	control.fl.vx = 0;
	control.fl.vy = 0;


	// SAFE X Y
	control.fl.sx = 0;
	control.fl.sy = 0;


	// TARGET X Y
	control.fl.tx = 0;
	control.fl.ty = 0;

	// FINAL X Y
	control.fl.dx = 0;
	control.fl.dy = 0;

	// CSS X Y
	control.fl.x = 0;
	control.fl.y = 0;

	// STORE X Y
	// control.fl.cx = 0;
	// control.fl.cy = 0;

	// MOVE EASING
	control.fl.move = 4;
	control.fl.easing = 0.1;
	control.fl.moveSafe = 20;

	control.signal = false;

	control.dir = "";

	hitTest_init();

	loopList = new Array();
	loopList.push(onEnterFrame_dirs);
	loopList.push(onEnterFrame_hitTest);
	// HACK
	// loopList.push(logic);
	// HACK
	loopList.push(onEnterFrame_move);

	window.requestAnimationFrame(onEnterFrame);

	createBasic();

	move_init(true);
}

function createBasic()
{
	var _wall;

	basic = {};

	basic.list = new Array();

	_wall = new wall("border-t", 0, -40, 320, 40);
	basic.list.push(_wall);

	_wall = new wall("border-b", 0, 500, 320, 40);
	basic.list.push(_wall);

	_wall = new wall("border-l", -40, 0, 40, 2000);
	basic.list.push(_wall);

	_wall = new wall("border-r", 320, 0, 40, 2000);
	basic.list.push(_wall);

	_wall = new wall("border-m", 0, 160, 120, 120);
	basic.list.push(_wall);
}

var wall = function(_c, _x, _y, _w, _h)
{
	this.c = _c;
	this.x = _x;
	this.y = _y;
	this.w = _w;
	this.h = _h;
}

function logic()
{
	for(var i in basic.list)
	{
		// if(control.fl.sx < (basic.list[i].x + basic.list[i].w))
		// {
		// 	trace(basic.list[i]);
		// }

		// trace(basic.list[i].x + basic.list[i].w);


		// if(control.fl.sx < (basic.list[i].x + basic.list[i].w))
		// {
		// 	if(control.fl.sy >= basic.list[i].y && control.fl.sy < basic.list[i].h)
		// 	{
		// 		trace(basic.list[i]);
		// 	}
		// }
	}
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

		// control.allow = false;
	}

	if(event.type === "keydown")
	{
		switch(event.keyCode)
		{
			case 37:
			{
				// LEFT

				//	control.dir = "LEFT";
				tempSignal = "LEFT";

				break;
			}

			case 38:
			{
				// UP

				//	control.dir = "UP";
				tempSignal = "UP";

				break;
			}

			case 39:
			{
				// RIGHT

				// control.dir = "RIGHT";
				tempSignal = "RIGHT";

				break;
			}

			case 40:
			{
				// DOWN

				// control.dir = "DOWN";
				tempSignal = "DOWN";

				break;
			}

			default:
			{
				control.dir = "STILL";
			}
		}

		if(control.signal)
		{
			control.dir = tempSignal;
		}

		// onEnterFrame_dirs();
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

function onEnterFrame_dirs()
{
	var css;

	var finalMoveX = 0;
	var finalMoveY = 0;

	if(control.dir === "UP")
	{
		if(HIT_TEST.hit_edge)
		{
			control.dir = "DOWN";

			finalMoveY = (control.fl.move * 1);
		}

		else
		{
			finalMoveY = -control.fl.move;
		}

		// control.fl.sy -= control.fl.move;
	}

	else if(control.dir === "DOWN")
	{
		if(HIT_TEST.hit_edge)
		{
			control.dir = "UP";

			finalMoveY = -(control.fl.move * 1);
		}

		else
		{
			finalMoveY = control.fl.move;
		}

		// control.fl.sy += control.fl.move;
	}

	if(control.dir === "LEFT")
	{
		if(HIT_TEST.hit_edge)
		{
			control.dir = "RIGHT";

			finalMoveX = (control.fl.move * 1);
		}

		else
		{
			finalMoveX = -control.fl.move;
		}

		// control.fl.sx -= control.fl.move;
	}

	else if(control.dir === "RIGHT")
	{
		if(HIT_TEST.hit_edge)
		{
			control.dir = "LEFT";

			finalMoveX = -(control.fl.move * 1);
		}

		else
		{
			finalMoveX = control.fl.move;
		}

		// control.fl.sx += control.fl.move;
	}

	control.fl.sx += finalMoveX;
	control.fl.sy += finalMoveY;

	css = {
					"-webkit-transform"	: "translate(" + control.fl.sx + "px, " + control.fl.sy + "px)",
					"transform"			: "translate(" + control.fl.sx + "px, " + control.fl.sy + "px)"
				};

	$(".hitTest").css(css);
}

function onEnterFrame_hitTest()
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
		HIT_TEST.hit_edge = false;

		control.signal = true;
	}

	$(".status p").html(HIT_TEST.hit_edge.toString());
}


function onEnterFrame_move()
{
	var css;

	if(!HIT_TEST.hit_edge)
	{
		if(control.fl.tx != control.fl.sx)
		{
			control.fl.tx = control.fl.sx;
		}

		if(control.fl.ty != control.fl.sy)
		{
			control.fl.ty = control.fl.sy;
		}

		// control.fl.tx = control.fl.sx;
		// control.fl.ty = control.fl.sy;


		control.fl.dx = control.fl.tx - control.fl.x;
		control.fl.dy = control.fl.ty - control.fl.y;

		// MET TARGET X (0px)
		if(Math.abs(control.fl.dx) < 1)
		{
			control.fl.x = Math.floor(control.fl.tx);
		}

		else
		{
			control.fl.vx = control.fl.dx * control.fl.easing;
			control.fl.x += control.fl.vx;
		}

		// MET TARGET Y (0px)
		if(Math.abs(control.fl.dy) < 1)
		{
			control.fl.y = Math.floor(control.fl.ty);
		}

		else
		{
			control.fl.vy = control.fl.dy * control.fl.easing;
			control.fl.y += control.fl.vy;
		}



		css = 	{
							"-webkit-transform"	: "translate(" + control.fl.x + "px, " + control.fl.y + "px)",
							"transform"			: "translate(" + control.fl.x + "px, " + control.fl.y + "px)"
						};

		$(".player").css(css);
	}

	else
	{
		// HIT_TEST.hit_edge = false;
	}
}







