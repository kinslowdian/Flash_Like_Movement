var CONTROL_SIGNAL;

var TouchControl = function(id)
{
	this.touchArea = id;
	this.firstTouch = true;
	this.enableTouch = true;

	this.data = {};
}

TouchControl.prototype.init = function()
{
	this.data.moveDirection = "";
	this.data.indicator			= "";

	this.data.x_measure 		= $("#" + this.touchArea).width();
	this.data.y_measure 		= $("#" + this.touchArea).height();
}

// CALL SHOULD DEVICE ROTATE TOO
TouchControl.prototype.setOffset = function()
{
	this.data.offset = $("#" + this.touchArea).offset();
}

TouchControl.prototype.reset = function()
{
	this.data.moveDirection = "STILL";
	this.data.x_percent 		= 0;
	this.data.y_percent 		= 0;
}



function touch_init()
{
	CONTROL_SIGNAL = new TouchControl("touchPad-full");
	CONTROL_SIGNAL.init();
}

function touchFind(event)
{
	event.preventDefault();

	if(event.type === "touchstart" || event.type === "touchmove")
	{
		if(!CONTROL_SIGNAL.data.offset) //  === "NONE"
		{
			CONTROL_SIGNAL.setOffset();
		}

		CONTROL_SIGNAL.data.x = event.targetTouches[0].pageX - CONTROL_SIGNAL.data.offset.left;
		CONTROL_SIGNAL.data.y = event.targetTouches[0].pageY - CONTROL_SIGNAL.data.offset.top;

		if(CONTROL_SIGNAL.data.x >= 0 && CONTROL_SIGNAL.data.x <= CONTROL_SIGNAL.data.x_measure)
		{
			CONTROL_SIGNAL.data.x_percent = Math.round((CONTROL_SIGNAL.data.x / CONTROL_SIGNAL.data.x_measure) * 100);
		}

		if(CONTROL_SIGNAL.data.y >= 0 && CONTROL_SIGNAL.data.y <= CONTROL_SIGNAL.data.y_measure)
		{
			CONTROL_SIGNAL.data.y_percent = Math.round((CONTROL_SIGNAL.data.y / CONTROL_SIGNAL.data.y_measure) * 100);
		}

		touchControlSignal();
	}

	if(event.type === "touchend")
	{
		CONTROL_SIGNAL.reset();

		touchFeedback();
	}
}

function touchControlSignal()
{
	if(CONTROL_SIGNAL.data.x_percent >= 33 && CONTROL_SIGNAL.data.x_percent < 66)
	{
		if(CONTROL_SIGNAL.data.y_percent >= 0 && CONTROL_SIGNAL.data.y_percent < 33)
		{
			CONTROL_SIGNAL.data.moveDirection = "UP";
		}
	}

	if(CONTROL_SIGNAL.data.x_percent >= 33 && CONTROL_SIGNAL.data.x_percent < 66)
	{
		if(CONTROL_SIGNAL.data.y_percent >= 66 && CONTROL_SIGNAL.data.y_percent <= 100)
		{
			CONTROL_SIGNAL.data.moveDirection = "DOWN";
		}
	}

	if(CONTROL_SIGNAL.data.x_percent >= 0 && CONTROL_SIGNAL.data.x_percent < 33)
	{
		if(CONTROL_SIGNAL.data.y_percent >= 33 && CONTROL_SIGNAL.data.y_percent < 66)
		{
			CONTROL_SIGNAL.data.moveDirection = "LEFT";
		}
	}

	if(CONTROL_SIGNAL.data.x_percent >= 66 && CONTROL_SIGNAL.data.x_percent <= 100)
	{
		if(CONTROL_SIGNAL.data.y_percent >= 33 && CONTROL_SIGNAL.data.y_percent < 66)
		{
			CONTROL_SIGNAL.data.moveDirection = "RIGHT";
		}
	}

	touchFeedback();
}

function touchFeedback()
{
		var ind;

		switch(CONTROL_SIGNAL.data.moveDirection)
		{
			case "UP":
			{
				ind = "touchPad-U-ind";

				break;
			}

			case "DOWN":
			{
				ind = "touchPad-D-ind";

				break;
			}

			case "LEFT":
			{
				ind = "touchPad-L-ind";

				break;
			}

			case "RIGHT":
			{
				ind = "touchPad-R-ind";

				break;
			}
		}

		if(CONTROL_SIGNAL.data.moveDirection === "STILL")
		{
			$("#" + CONTROL_SIGNAL.data.indicator).removeClass("touchPad_C_signal_show").addClass("touchPad_C_signal_hide");

			CONTROL_SIGNAL.data.indicator = "";
		}


		else
		{
			if(ind !== CONTROL_SIGNAL.data.indicator)
			{
				$("#" + CONTROL_SIGNAL.data.indicator).removeClass("touchPad_C_signal_show").addClass("touchPad_C_signal_hide");

				$("#" + ind).removeClass("touchPad_C_signal_hide").addClass("touchPad_C_signal_show");

				CONTROL_SIGNAL.data.indicator = ind;
			}
		}

		if(control.dir != CONTROL_SIGNAL.data.moveDirection)
		{
			control.dir = CONTROL_SIGNAL.data.moveDirection;
		}

	// trace(CONTROL_SIGNAL.data.moveDirection);
}