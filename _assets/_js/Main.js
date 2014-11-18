var trace = function(msg){ console.log(msg); };

var control;

var loopRun;
var loopList;

var HIT_TEST;

var portalTarget;

var portalArr = new Array();

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

	this.fl.move = 4;
	this.fl.moveX = 0;
	this.fl.moveY = 0;

	this.signal = false;

	this.dir = "";
}

var FakePortal = function(settings)
{
	this.settings = {};
	this.settings = settings;
}

FakePortal.prototype.build = function()
{
	this.id	= this.settings.id;
	this.x 	= this.settings.x;
	this.y 	= this.settings.y;
	this.w 	= this.settings.w;
	this.h 	= this.settings.h;
	this.n	= this.settings.n;
	this.e 	= this.settings.e;
	this.d 	= this.settings.d;

	this.x_mid = this.settings.x + 20;
	this.y_mid = this.settings.y + 20;
}


$(document).ready(function(){ init(); });


function init()
{
	var p;

	control = new Control();
	control.init();

	hitTest_init();

	loopList = new Array();

	loopList.push(onEnterFrame_direction);
	loopList.push(onEnterFrame_stepper);
	loopList.push(hack_hitTest);
	loopList.push(onEnterFrame_move);

	loopRun = false;

	p = new FakePortal({x:240, y:440, w:80, h:80, n:0, e:1, d:"LEFT", id:"portal_0"});
	p.build();

	portalArr.push(p);

	p = new FakePortal({x:0, y:280, w:80, h:80, n:1, e:0, d:"DOWN", id:"portal_1"});
	p.build();

	portalArr.push(p);

	onEnterFrame_init(true);

	move_init(true);
}

function onEnterFrame_init(run)
{
	if(run)
	{
		loopRun = true;
		window.requestAnimationFrame(onEnterFrame);
	}

	else
	{
		loopRun = false;
		window.cancelAnimationFrame(onEnterFrame);
	}
}


function hitTest_init()
{
	HIT_TEST = {};

	HIT_TEST.hit_edge = false;
	HIT_TEST.hit_portal = false;
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

	if(loopRun)
	{
		window.requestAnimationFrame(onEnterFrame);
	}
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

		if(control.dir === "DOWN") //else if
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

		if(control.dir === "RIGHT") //else if
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

		else if($(HIT_TEST.hits[0]).attr("data-npc") === "portal")
		{
			HIT_TEST.hit_portal = true;

			control.signal = false;

			HIT_TEST.hit_portal_id = HIT_TEST.hits[0].id;
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

	if(HIT_TEST.hit_portal)
	{
		onEnterFrame_init(false);

		temp_findPortalEnter();
	}

	else
	{

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

	if(!HIT_TEST.hit_portal)
	{
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
}



function temp_findPortalEnter()
{
	for(var i in portalArr)
	{
		if(HIT_TEST.hit_portal_id === portalArr[i].id)
		{
			portalTarget = portalArr[i];

			break;
		}
	}

	temp_autoMove_init("PORTAL_ENTER");
}

function temp_findPortalExit()
{
	trace("??");

	for(var i in portalArr)
	{
		if(portalTarget.e == portalArr[i].n)
		{
			portalTarget = portalArr[i];

			break;
		}
	}

	temp_autoMove_init("PORTAL_PLACE");
}

function temp_autoMove_init(moveRequest)
{
	var moveTypes = {

		"PORTAL_ENTER"	: function()
		{
			var css = {};

			css.x = portalTarget.x_mid;
			css.y = portalTarget.y_mid;
			css.write = {};

			$(".player").addClass("tween-player");

			$(".tween-player")[0].addEventListener("webkitTransitionEnd", temp_autoMove_event_enter, false);
			$(".tween-player")[0].addEventListener("transitionend", temp_autoMove_event_enter, false);

			css.write = 	{
												"-webkit-transform"	: "translate(" + css.x + "px, " + css.y + "px)",
												"transform"					: "translate(" + css.x + "px, " + css.y + "px)",
												"opacity"						: "0"
										};

			$(".player").css(css.write);

			delete css;
		},

		"PORTAL_PLACE"	: function()
		{
			var css = {};

			css.delay = null;
			css.x = portalTarget.x_mid;
			css.y = portalTarget.y_mid;
			css.write = {};

			css.write = 	{
												"-webkit-transform"	: "translate(" + css.x + "px, " + css.y + "px)",
												"transform"					: "translate(" + css.x + "px, " + css.y + "px)",
												"opacity"						: "0"
										};

			$(".player").css(css.write);

			// HACKY EXIT AFTER SCREEN PLACEMENT
			css.delay = setTimeout(temp_autoMove_init, 1000, "PORTAL_EXIT");

			delete css;
		},

		"PORTAL_EXIT"		: function()
		{
			var css = {};

			css.x 		= portalTarget.x_mid;
			css.y	 		= portalTarget.y_mid;
			css.pushX = 0;
			css.pushY = 0;
			css.write = {};

			switch(portalTarget.d)
			{
				case "UP"			:{ css.pushY = -(portalTarget.h); break; }
				case "DOWN"		:{ css.pushY = portalTarget.h; 		break; }
				case "LEFT"		:{ css.pushX = -(portalTarget.w); break; }
				case "RIGHT"	:{ css.pushX = portalTarget.w; 		break; }
			}

			css.x += css.pushX;
			css.y += css.pushY;

			$(".player").addClass("tween-player");

			$(".tween-player")[0].addEventListener("webkitTransitionEnd", temp_autoMove_event_exit, false);
			$(".tween-player")[0].addEventListener("transitionend", temp_autoMove_event_exit, false);

			css.write = 	{
												"-webkit-transform"	: "translate(" + css.x + "px, " + css.y + "px)",
												"transform"					: "translate(" + css.x + "px, " + css.y + "px)",
												"opacity"						: "1"
										};

			$(".player").css(css.write);

			delete css;
		}

	};

	if(typeof moveTypes[moveRequest] === "function")
	{
		return moveTypes[moveRequest]();
	}
}

function temp_autoMove_event_enter(event)
{
	$(".player")[0].removeEventListener("webkitTransitionEnd", temp_autoMove_event_enter, false);
	$(".player")[0].removeEventListener("transitionend", temp_autoMove_event_enter, false);

	$(".player").removeClass("tween-player");

	temp_findPortalExit();
}

function temp_autoMove_event_exit(event)
{
	$(".player")[0].removeEventListener("webkitTransitionEnd", temp_autoMove_event_exit, false);
	$(".player")[0].removeEventListener("transitionend", temp_autoMove_event_exit, false);

	$(".player").removeClass("tween-player");

	// temp_findPortalExit();
}




