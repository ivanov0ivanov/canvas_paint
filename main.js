;(() => {
    "use strict";

    const
        canvas = document.getElementById("paint"),
        ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - 200;

    const // for DOM
        btnSave = document.getElementById('save'),
        btnReplay = document.getElementById('replay'),
        btnClear = document.getElementById('clear'),
        showColor = document.getElementById('showColor'),
        customRange = document.getElementById('customRange3'),
        rangeProgress = document.getElementById('customRangeProgress');
////
    const config = {
        isMouseDown: false,
        coords: [],
        setColors: "#000000",
        setRange: 25,
        penWidth: 10
    };
////
    const isCanvasBlank = canvas => { // check for emptiness canvas
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        return canvas.toDataURL() === blank.toDataURL();
    };
////
    showColor.style.backgroundColor = config.setColors; // default call
    document.getElementById('setColors').oninput = function () {
        config.setColors = this.value;
        showColor.style.backgroundColor = config.setColors; // change color for custom input
    };

    customRange.setAttribute("value", config.setRange); // default call
    rangeProgress.textContent = config.setRange + "%"; // default call
    customRange.oninput = function () {
        config.setRange = this.value;
        config.penWidth = config.setRange; // resize pen
        rangeProgress.textContent = config.setRange + "%";
    };

////
    canvas.addEventListener("mousedown", () => {
        return config.isMouseDown = true;
    });

    canvas.addEventListener("mouseup", () => {
        config.isMouseDown = false;
        ctx.beginPath();
        config.coords.push('mouseup');

        btnSave.removeAttribute('disabled'); // enable Save
    });

    canvas.addEventListener("mousemove", e => {
        ctx.lineWidth = config.penWidth * 2; // due to circle radius * 2

        if (config.isMouseDown) {
            config.coords.push([
                e.offsetX,
                e.offsetY,
                config.setColors,
                config.penWidth
            ]);

            ctx.strokeStyle = config.setColors;
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();

            ctx.beginPath();
            ctx.fillStyle = config.setColors;
            ctx.arc(e.offsetX, e.offsetY, config.penWidth, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }
    });
////
    const save = () => {
        // if (isCanvasBlank(canvas)) {
        //     config.coords = [];
        // }
        localStorage.setItem('coords', JSON.stringify(config.coords));
        console.log(config.coords);
    };

    const clear = () => {
        config.coords = [];
        console.log(config.coords);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        btnSave.removeAttribute('disabled'); // enable Save
    };

    const replay = () => {
        clear();
        btnSave.setAttribute('disabled', ''); // disable Save
        config.coords = JSON.parse(localStorage.getItem('coords'));

        const timer = setInterval(() => {
            if (!config.coords.length) {
                clearInterval(timer);
                ctx.beginPath();
                return;
            }

            const crd = config.coords.shift();
            const e = {  // emulation event for replay
                offsetX: crd["0"],
                offsetY: crd["1"],
                newColor: crd["2"],
                newPenWidth: crd["3"]
            };

            ctx.lineWidth = e.newPenWidth * 2;
            ctx.strokeStyle = e.newColor;
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();

            ctx.beginPath();
            ctx.fillStyle = e.newColor;
            ctx.arc(e.offsetX, e.offsetY, e.newPenWidth, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }, 10)
    };
////
    // Controls
    btnSave.setAttribute('disabled', '');  // default disable Save
    btnSave.addEventListener('click', () => {
        console.log('Saved!');
        return save();
    });

    btnReplay.addEventListener('click', () => {
        console.log('Replaying...');
        return replay();
    });

    btnClear.addEventListener('click', () => {
        console.log('Clear!');
        return clear();
    });

    document.addEventListener('keydown', e => {
        if (e.keyCode === 83) {
            if (btnSave.hasAttribute('disabled')) {
                console.log("No Save!");
            } else {
                console.log('Saved!');
                return save();
            }
        }
        if (e.keyCode === 82) {
            console.log('Replaying...');
            return replay();
        }
        if (e.keyCode === 67) {
            console.log('Clear!');
            return clear();
        }
    })
})();
