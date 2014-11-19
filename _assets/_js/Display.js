var display;

var Display = function(h)
{
	this.gameHeight = h;
}

Display.prototype.init = function()
{
	this.screen_w = window.screen.width;
	this.screen_h = window.screen.height;

	this.w = window.innerWidth;
	this.h = window.innerHeight;

	this.focus_y = 0;
}

Display.prototype.updateScreenVals = function()
{
	this.w = window.innerWidth;
	this.h = window.innerHeight;
}

Display.prototype.centerPlayer = function()
{
	// 	center_y = -(player_y) + ((screen_h * 0.5) - (player_h * 0.5));
	this.focus_y = -(control.fl.target_safe_y) + ((this.h * 0.5) - (40 * 0.5));
}

function display_init()
{
	display = new Display(2000);
	display.init();

	display_screenUpdate(true);
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

	css = {
					"-webkit-transform" : "translateY(" + Math.round(display.focus_y) + "px)",
					"transform" 				: "translateY(" + Math.round(display.focus_y) + "px)"
				};

	$(".screen").css(css);
}