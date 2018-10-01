function changeColor(i, patterns, loops, nbLoops, delay) {
    if (stopAnimation) return;
    if (i >= patterns.length) {
        if (loops !== 0 && nbLoops >= loops) {
            stopAnimation = true;
            return;
        }
        nbLoops ++; i = 0;
    }
    let arr = new Uint8Array(patterns[i]);
    chrome.hid.sendFeatureReport(connectionId, CONFIG.blinkstick.reportid, arr.buffer, function() {
        setTimeout(function() { changeColor(i+1, patterns, loops, nbLoops, delay); }, delay);
    });
}

function switchLight(delay, colors, loops) {
    if (colors.length === 0) return;
    if (colors.length === 1) {
        let pattern = [0];
        for (let i=0; i<CONFIG.blinkstick.leds; i++) {
            pattern.push(colors[0].g);
            pattern.push(colors[0].r);
            pattern.push(colors[0].b);
        }
        let arr = new Uint8Array(pattern);
        chrome.hid.sendFeatureReport( connectionId, CONFIG.blinkstick.reportid, arr.buffer, function() {});
    }
    else {
        let patterns = [];
        for (let color of colors) {
            let pattern = [0];
            for (let i=0; i<CONFIG.blinkstick.leds; i++) {
                pattern.push(color.g);
                pattern.push(color.r);
                pattern.push(color.b);
            }
            patterns.push(pattern);
        }

        if (delay < 100) delay = 100;
        loops = Number(loops) || 0;

        stopAnimation = false;
        nbLoops = 1;
        changeColor(0, patterns, loops, nbLoops, delay);
    }
};

function traverseLight(ltr, size, loops, delay, colors) {
    let template = [];
    let states = [];

    for (let c of colors) {
        for (let i = 0; i < size; i++) template.push(c);
    }

    for (let i=0; i<CONFIG.blinkstick.leds; i++) {
        states.push(-i);
    }

    let patterns = [];
    for (let i=0; i<( template.length + CONFIG.blinkstick.leds -1); i++) {
        let pattern = [0];
        for (let i=0; i<CONFIG.blinkstick.leds; i++) {
            let state = states[i];
            let color = {g:0, r:0, b:0};
            if (state > -1 && state < template.length) {
                color = template[state];
            } 
            pattern.push(color.g);
            pattern.push(color.r);
            pattern.push(color.b);
            states[i]++;
        }
        patterns.push(pattern)
    }

    nbLoops = 1;
    stopAnimation = false;
    if (!ltr) patterns = patterns.reverse();

    changeColor(0, patterns, loops, nbLoops, delay);
    return;
};

function borderLight(ltr, size, loops, delay, colors) {

    let template = [];
    let states = new Array(CONFIG.blinkstick.leds)

    for (let c of colors) {
        for (let i = 0; i < size; i++) template.push(c);
    }

    let center = CONFIG.blinkstick.leds/2;

    if (ltr) {
        for (let i=0; i < center; i++) {
            states[i] = -i;
            states[CONFIG.blinkstick.leds-1-i] = -i
        }
    }
    else {
        for (let i=0; i < center; i++) {
            states[i] = -(center-i-1);
            states[CONFIG.blinkstick.leds-1-i] = -(center-i-1)
        }
    }
    
    let patterns = [];
    for (let i=0; i<( template.length + CONFIG.blinkstick.leds/2); i++) {
        let pattern = [0];
        for (let i=0; i<CONFIG.blinkstick.leds; i++) {
            let state = states[i];
            let color = {g:0, r:0, b:0};
            if (state > -1 && state < template.length) {
                color = template[state];
            } 
            pattern.push(color.g);
            pattern.push(color.r);
            pattern.push(color.b);
            states[i]++;
        }
        patterns.push(pattern)
    }

    nbLoops = 1;
    stopAnimation = false;

    changeColor(0, patterns, loops, nbLoops, delay);
    return;


};

