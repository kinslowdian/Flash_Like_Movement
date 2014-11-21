var display;

var Display = function(w, h)
{
	this.gameWidth = w;
	this.gameHeight = h;
}

Display.prototype.init = function()
{
	this.screen_w = window.screen.width;
	this.screen_h = window.screen.height;

	this.w = window.innerWidth;
	this.h = window.innerHeight;

	this.focus_y = 0;
	this.focusCurrent_y = 0;
	this.focusAllow = false;
}

Display.prototype.updateScreenVals = function()
{
	this.w = window.innerWidth;
	this.h = window.innerHeight;
}

Display.prototype.centerPlayer = function()
{
	// 	center_y = -(player_y) + ((screen_h * 0.5) - (player_h * 0.5));
	this.focus_y = Math.round(-(control.fl.target_safe_y) + ((this.h * 0.5) - (40 * 0.5)));
}

Display.prototype.hack = function()
{
	this.stageY_move = 0.1;
	this.stageY = 0;
}

function display_init()
{
	display = new Display(320, 2000);
	display.init();

	display.hack();

	display_screenUpdate(true);

	display_scrollInit(true);
}

function display_rotate(event)
{
	if(event != null || event != undefined)
	{
		if(control != null)
		{
			control.touch_setOffset();
		}
	}

	trace(event);
}

function display_scrollInit(run)
{
	if(run)
	{
		display.focusAllow = true;

		$(".screen")[0].addEventListener("webkitTransitionEnd", display_centerLevelEvent, false);
		$(".screen")[0].addEventListener("transitionend", display_centerLevelEvent, false);
	}

	else
	{
		display.focusAllow = false;

		$(".screen")[0].removeEventListener("webkitTransitionEnd", display_centerLevelEvent, false);
		$(".screen")[0].removeEventListener("transitionend", display_centerLevelEvent, false);
	}
}

function display_screenUpdate(run)
{
	if(run)
	{
		$(window).on("resize", display_screenUpdateEvent);
	}

	else
	{
		$(window).off("resize");
	}
}

function display_screenUpdateEvent(event)
{
	display.updateScreenVals();
	display.centerPlayer();
}

function display_centerLevel()
{
	var css;

	display.centerPlayer();

	if(display.focusCurrent_y != display.focus_y && display.focusAllow)
	{
		// if(display.focus_y > display.stageY)
		// {
		// 	display.stageY += display.stageY_move;
		// }

		display.focus_y > display.stageY ? display.stageY += display.stageY_move : display.stageY -= display.stageY_move;



		trace(display.focus_y)

		// css = {
		// 				"-webkit-transform" : "translateY(" + display.focus_y + "px)",
		// 				"transform" 				: "translateY(" + display.focus_y + "px)"
		// 			};

		css = {
						"-webkit-transform" : "translateY(" + display.stageY + "px)",
						"transform" 				: "translateY(" + display.stageY + "px)"
					};

		if(display.stageY == display.focus_y)
		{
			display_centerLevelEvent(null);
		}

		else
		{
			$(".screen").css(css);
		}
	}
}

function display_centerLevelEvent(event)
{
	display.focusCurrent_y = display.focus_y;
}