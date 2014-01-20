;
var MSG_TYPES = {
	ERROR : 'circle-close',
	INFO : 'info',
	ALERT : 'alert',
	SECURITY : 'security',
	CONFIRMATION : 'help'
};
var OPTION_TYPE = {
	DEFAULT : 0,
	OK_CANCEL : 1,
	YES_NO : 2,
	YES_NO_CANCEL : 3
};

(function($) {
	var template = '<div id="dialog" style="display:none;" title="{DIALOG_TITLE}"><p><span class="ui-icon ui-icon-{MSG_TYPE}" style="float:left; margin:0 7px 20px 0;"></span>{MESSAGE}</p></div>';
	function format(source, params) {
		if ( arguments.length == 1 )
			return function() {
				var args = $.makeArray(arguments);
				args.unshift(source);
				return $.validator.format.apply( this, args );
			};
		if ( arguments.length > 2 && params.constructor != Array  ) {
			params = $.makeArray(arguments).slice(1);
		}
		if ( params.constructor == String ) {
			params = [ params ];
		}
		$.each(params, function(i, n) {
			source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
		});
		return source;
	};

	$.msgDialog = function(options) {
		if($("#dialog").is(":visible")) {
			$("#dialog").dialog("close");
		}
		var defaults = {
			title : 'Confirmation Message',
			message : 'Are you sure?',
			closeText : 'close',
			okText : 'Ok',
			cancelText : 'Cancel',
			yesText : 'Yes',
			noText : 'No',
			msgType : MSG_TYPES.INFO,
			optionType : OPTION_TYPE.DEFAULT,
			onOK : null,
			onCancel : null,
			onYes : null,
			onNo : null,
			onClose : null,
			params : {},
			closeOnEscape : true
		};

		var options = $.extend(defaults, options);
		options.message = format(options.message, options.params);
		var buttons = {};

		if(options.optionType == OPTION_TYPE.OK_CANCEL || options.optionType == OPTION_TYPE.YES_NO_CANCEL) {
			buttons[options.cancelText] = function (event) {
				if(options.onCancel && $.isFunction(eval(options.onCancel))) {
					eval(options.onCancel).call(null, event, options);
				}
				msgDialog.dialog("close");
			}
		}

		if(options.optionType == OPTION_TYPE.DEFAULT || options.optionType == OPTION_TYPE.OK_CANCEL) {
			buttons[options.okText] = function (event) {
				if(options.onOK && $.isFunction(eval(options.onOK))) {
					eval(options.onOK).call(null, event, options);
				}
				msgDialog.dialog("close");
			}
		}
		
		if(options.optionType == OPTION_TYPE.YES_NO || options.optionType == OPTION_TYPE.YES_NO_CANCEL) {
			buttons[options.yesText] = function (event) {
				if(options.onYes && $.isFunction(eval(options.onYes))) {
					eval(options.onYes).call(null, event, options);
				}
				msgDialog.dialog("close");
			}

			buttons[options.noText] = function (event) {
				if(options.onNo && $.isFunction(eval(options.onNo))) {
					eval(options.onNo).call(null, event, options);
				}
				msgDialog.dialog("close");
			}
		}
		template = template.replace("{DIALOG_TITLE}", options.title);
		template = template.replace("{MSG_TYPE}", options.msgType);
		template = template.replace("{MESSAGE}", options.message);
		var msgDialog = $(template).dialog({
			modal : true, 
			resizable : false,
			width : 400,
			closeOnEscape : options.closeOnEscape,
			open : function () {
				$("#MSG_DIALOG_OK").focus();
			},
			close : function (event) {
				if(options.onClose && $.isFunction(eval(options.onClose))) {
					eval(options.onClose).call(null, event, options);
				}
				msgDialog.dialog("destroy").remove();
			},
			buttons : buttons
		});
	};
})(jQuery);