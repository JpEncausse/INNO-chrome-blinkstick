var BlinkstickChromeSocket = function() {
	
	var socketServer;
	var server = this;

  /**
   * The callback that runs every time there's a request.
   * @param obj input data
   */
	function onAcceptCallback(data) {
		if (!data || !data.action) return;
		console.log('check 3', socketServer.connected);
		$("#socketInfo").prepend(new Date().toLocaleTimeString('fr-FR') + ' - <b>Received action:</b> ' + data.action + '<br>');
		processLeds(data);
  }

  /**
   * Fire up the server
   * @param string host address as a string 
   * @param string path as a string 
	 * @param string socket's name
   */
	this.startServer = function(host, path, name, secure) {
		let trying = true;
	  if (socketServer) {
			$("#socketInfo").prepend(new Date().toLocaleTimeString('fr-FR') + ' - <b>Reconnecting Socket server...</b><br>');
			socketServer.disconnect();
		}
		else {
			$("#socketInfo").prepend(new Date().toLocaleTimeString('fr-FR') + ' - <b>Connecting Socket server...</b><br>');
		}

		setTimeout( function() {
			if (trying) {
				$("#socketInfo").prepend(new Date().toLocaleTimeString('fr-FR') + ' - <b>Aborting connection (timeout)</b><br>');
				socketServer.disconnect();
				socketServer = null;
			}
		}, 10000)

		socketServer = io(host, { path: path, secure: secure});
		socketServer.on('connect', function() {
			trying = false;
			$("#socketInfo").prepend(new Date().toLocaleTimeString('fr-FR') + ' - <b>Socket server connected</b><br>');
		});
		socketServer.on('disconnect', function() {
			trying = false;
			$("#socketInfo").prepend(new Date().toLocaleTimeString('fr-FR') + ' - <b>Socket server disconnected</b><br>');
		});

	  socketServer.on(name, onAcceptCallback);
	};

  /**
   * Stop the server if it's running
   */
	this.stopServer = function() {
	  if (socketServer) {
			$("#socketInfo").prepend(new Date().toLocaleTimeString('fr-FR') + ' - <b>Socket server stopped</b><br>');
	    socketServer.disconnect();
	    socketServer = null;
	  }
	};

  /**
   * Check to see what the server is doing.
   */
	this.getServerState = function() {
	  if (socketServer) {
	    return {
				isConnected: socketServer.connected,
				hostname: socketServer.io.opts.hostname,
				path: socketServer.io.opts.path,
				port: socketServer.io.opts.port
			};
	  } else {
	    return {
				isConnected: false
			};
	  }
	};

	return this;

};