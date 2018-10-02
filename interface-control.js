
$("#menu").on("click", "a", function() {
    let href = $(this).attr('href').substring(1);
    
    $('.subControl').hide();
    $('#display-' + href).show();
})

$("#infoControl").on("click", "a", function() {
    let href = $(this).attr('href').substring(1, 7);

    if (href === "blinks") return initDeviceConnection();
    if (href !== "socket") return;

    let state = socketio.getServerState();
    let info = (state.isConnected) ? '<b>Connected</b> to ' :  '<b>Not connected</b> to ' 
        info += state.hostname + state.path + ' on port ' + state.port;

    $("#socketInfo").prepend(new Date().toLocaleTimeString('fr-FR') + ' - ' + info + '<br>');
})


$("#colors-number").on("change", function() {
    let value = $(this).val();
    let nbColors = $("#colors").find('.form-color').length;
    let diff = value - nbColors;

    if (diff > 0) {
        for (let i=0; i<diff; i++) {
            let id = i + nbColors;
            let html  = '<div class="col-sm-4" ><div class="form-group form-color">';
                html += '<label for="colors-input-' + id + '" style="width: 103px; ">Color #' + (id+1) + '<b class="color-round"> ▶</b></label>';
                html += '<input type="text" id="color-input-' + id + '" class="form-control color-picker" value="#ffffff">'
                html += '</div></div>';
            $("#colors").append(html);
            $('#color-input-' + id ).colorpicker();
        }
    }

    if (diff < 0) {
        diff = Math.abs(diff);

        for (let i=1; i<=diff; i++) {
            let id = nbColors - i;
            $('#color-input-' + id ).parent().remove();
        }
    }
})

$("#display-config").on("click", "button", function() {
    let id = $(this).attr('id');

    switch(id) {
        case "load":
            var a = document.createElement('input');
            a.setAttribute('type', 'file');
            a.setAttribute('id', 'loadfile');
            a.addEventListener('change', function updateImageDisplay() {
                if ($(this)[0].files && $(this)[0].files[0]) {
                    let data = {};
                    let file = $(this)[0].files[0];
                    let fr = new FileReader(); 

                    fr.onload = function () { 
                        data = fr.result;
                        data = (typeof data === "object") ? data : JSON.parse(data);
                        if (typeof data !== "object" || data.length || !data.blinkstick || !data.socket) return console.log("Error parsing data");
                        else loadConfigData(data, true);
                    };
                    fr.readAsText( file );
                }
            });
              a.click();
            $(a).change();
            break;

        case "restart":
            CONFIG = {
                "blinkstick" :{
                    "vendor":  Number($("#blink-vendor").val()) || 8352,
                    "product": Number($("#blink-product").val()) || 16869,
                    "leds":    Number($("#blink-leds").val()) || 8,
                    "reportid": 6
                }, 
                "socket": {
                    "host":   $("#socket-host").val() || "http://localhost",
                    "path":   $("#socket-path").val() || "/",
                    "name":   $("#socket-name").val() || "blinkstick",
                    "secure": $("#socket-secure").is(":checked")
                }
            }

            if (Number(CONFIG.blinkstick.leds) > 32) CONFIG.blinkstick.reportid = 9;
            else if (Number(CONFIG.blinkstick.leds) > 16) CONFIG.blinkstick.reportid = 8;
            else if (Number(CONFIG.blinkstick.leds) > 8) CONFIG.blinkstick.reportid = 7;

            initDeviceConnection();
            initConnection();
            break;

        case "download":
            CONFIG = {
                "blinkstick" :{
                    "vendor":  String($("#blink-vendor").val()) || "8352",
                    "product": String($("#blink-product").val()) || "16869",
                    "leds":    String($("#blink-leds").val()) || "8",
                    "reportid": "6"
                }, 
                "socket": {
                    "host":   $("#socket-host").val() || "http://localhost",
                    "path":   $("#socket-path").val() || "/",
                    "name":   $("#socket-name").val() || "blinkstick",
                    "secure": String($("#socket-secure").is(":checked"))
                }
            }

            if (Number(CONFIG.blinkstick.leds) > 32) CONFIG.blinkstick.reportid = 9;
            else if (Number(CONFIG.blinkstick.leds) > 16) CONFIG.blinkstick.reportid = 8;
            else if (Number(CONFIG.blinkstick.leds) > 8) CONFIG.blinkstick.reportid = 7;
    
            var a = document.createElement('a');
            a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(JSON.stringify(CONFIG)));
            a.setAttribute('download', 'blinkstick-config.json');
            a.click()
            break;
    }
});

$("#stopAnimation").on("click", function() {
    stopAnimation = true;
    switchLight(0, [{r: 0, g:0, b:0, a:0}]);
    $("#infopanel").hide();
})

$("#infocopy").on("click", function() {
  let code = $("#infocode").text();
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(code).select();
  document.execCommand("copy");
  $temp.remove();
})

$("#testAnimation").on("click", function() {

    let data = {
        "action":   $("#animation-action").val(),
        "size":     Number($("#animation-size").val()), 
        "loops":    Number($("#animation-loops").val()), 
        "delay":    Number($("#colors-delay").val()),
        "colors":   []
    }

    $(".color-picker").each( function(i,e) {
        let color = getColor($(e).val());
        if (color) data.colors.push(color);
    })

    processLeds(data);
    $("#infocode").text(JSON.stringify(data, null, '\t'));
    $("#infopanel").show();
})


$("#animation-action").on("change", function() {
    let val = $(this).val();
    $("#animation-size, #colors-delay").attr("disabled", false);
    if (val === "swi") {
        $("#animation-size").attr("disabled", true);
        if (Number($("#colors-number").val()) === 1) $("#colors-delay").attr("disabled", true);
    }
})

$("#colors-number").on("change", function() {
    let val = Number($(this).val());
    $("#colors-delay, #colors-delay").attr("disabled", false);
    if (val === 1) {
        if ($("#animation-action").val() === "swi") $("#colors-delay").attr("disabled", true);
        $("#animation-size").attr("disabled", true);
    }
})