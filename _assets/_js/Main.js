var trace = function(msg){ console.log(msg); };

var control;

var loopList;

var HIT_TEST;


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

	control.dir = "";

	hitTest_init();

	loopList = new Array();
	loopList.push(onEnterFrame_dirs);
	loopList.push(onEnterFrame_hitTest);
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

				control.dir = "LEFT";

				break;
			}

			case 38:
			{
				// UP

				control.dir = "UP";

				break;
			}

			case 39:
			{
				// RIGHT

				control.dir = "RIGHT";

				break;
			}

			case 40:
			{
				// DOWN

				control.dir = "DOWN";

				break;
			}

			default:
			{
				control.dir = "STILL";
			}
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

function onEnterFrame_dirs()
{
	var css;

	if(control.dir === "UP")
	{
		control.fl.sy -= control.fl.move;
	}

	else if(control.dir === "DOWN")
	{
		control.fl.sy += control.fl.move;
	}

	if(control.dir === "LEFT")
	{
		control.fl.sx -= control.fl.move;
	}

	else if(control.dir === "RIGHT")
	{
		control.fl.sx += control.fl.move;
	}

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
		}
	}

	else
	{
		HIT_TEST.hit_edge = false;
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
		HIT_TEST.hit_edge = false;
	}
}







