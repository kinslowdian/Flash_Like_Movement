var trace = function(msg){ console.log(msg); };

var control;

var loopList;

var HIT_TEST;

$(document).ready(function(){ init(); });


function init()
{
	control = {};

	control.fl = {};

	// CSS X Y
	control.fl.x_hit = 0;
	control.fl.y_hit = 0;


	// CSS X Y
	control.fl.x = 0;
	control.fl.y = 0;

	// MOVE EASING
	control.fl.move = 5;

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

	var finalMoveX;
	var finalMoveY;

	if(control.signal)
	{
		if(control.dir === "UP")
		{
			control.fl.y_hit -= control.fl.move;
		}

		else if(control.dir === "DOWN")
		{
			control.fl.y_hit += control.fl.move;
		}

		if(control.dir === "LEFT")
		{
			control.fl.x_hit -= control.fl.move;
		}

		else if(control.dir === "RIGHT")
		{
			control.fl.x_hit += control.fl.move;
		}

		finalMoveX = control.fl.x_hit;
		finalMoveY = control.fl.y_hit;
	}

	else
	{
		finalMoveX = control.fl.x;
		finalMoveY = control.fl.y;

		control.fl.x_hit = control.fl.x;
		control.fl.y_hit = control.fl.y;
	}

	css = {
					"-webkit-transform"	: "translate(" + finalMoveX + "px, " + finalMoveY + "px)",
					"transform"					: "translate(" + finalMoveX + "px, " + finalMoveY + "px)"
				};

	$(".hitTest").css(css);
}

function onEnterFrame_hitTest()
{
	HIT_TEST.hits = $(".collideCheck-player").collision(".collideCheck-field");

	if(HIT_TEST.hits[0] != undefined || HIT_TEST.hits[0] != null)
	{
		// trace("hit");

		if($(HIT_TEST.hits[0]).attr("data-npc") === "edge")
		{
			HIT_TEST.hit_edge = true;

			control.signal = false;

			// control.dir = "STILL";
		}
	}

	else
	{
		// trace("safe " + control.fl.x_hit + " " + control.fl.x + " " + control.fl.y_hit + " " + control.fl.y);
		if(control.fl.x_hit == control.fl.x && control.fl.y_hit == control.fl.y)
		{
			// trace("RESET");

			HIT_TEST.hit_edge = false;
			control.signal = true;
		}
	}

	$(".status p").html(HIT_TEST.hit_edge.toString());
}

function onEnterFrame_move()
{
	var css;

	if(!HIT_TEST.hit_edge)
	{
		control.fl.x = control.fl.x_hit;
		control.fl.y = control.fl.y_hit;

		css = {
						"-webkit-transform"	: "translate(" + control.fl.x + "px, " + control.fl.y + "px)",
						"transform"					: "translate(" + control.fl.x + "px, " + control.fl.y + "px)"
					};

		$(".player").css(css);
	}
}

// function onEnterFrame_move()
// {
// 	var css;

// 	if(!HIT_TEST.hit_edge)
// 	{
// 		if(control.fl.tx != control.fl.sx)
// 		{
// 			control.fl.tx = control.fl.sx;
// 		}

// 		if(control.fl.ty != control.fl.sy)
// 		{
// 			control.fl.ty = control.fl.sy;
// 		}

// 		// control.fl.tx = control.fl.sx;
// 		// control.fl.ty = control.fl.sy;


// 		control.fl.dx = control.fl.tx - control.fl.x;
// 		control.fl.dy = control.fl.ty - control.fl.y;

// 		// MET TARGET X (0px)
// 		if(Math.abs(control.fl.dx) < 1)
// 		{
// 			control.fl.x = Math.floor(control.fl.tx);
// 			control.fl.vx = 0;
// 		}

// 		else
// 		{
// 			control.fl.vx = control.fl.dx * control.fl.easing;
// 			control.fl.x += control.fl.vx;
// 		}

// 		// MET TARGET Y (0px)
// 		if(Math.abs(control.fl.dy) < 1)
// 		{
// 			control.fl.y = Math.floor(control.fl.ty);
// 			control.fl.vy = 0;
// 		}

// 		else
// 		{
// 			control.fl.vy = control.fl.dy * control.fl.easing;
// 			control.fl.y += control.fl.vy;
// 		}



// 		css = 	{
// 							"-webkit-transform"	: "translate(" + control.fl.x + "px, " + control.fl.y + "px)",
// 							"transform"			: "translate(" + control.fl.x + "px, " + control.fl.y + "px)"
// 						};

// 		$(".player").css(css);
// 	}

// 	else
// 	{
// 		// HIT_TEST.hit_edge = false;
// 	}
// }







