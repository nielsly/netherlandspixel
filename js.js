const mouse = {
    x: 0,
    y: 0,
    button: false,
    lastColor: ""
};
let cv,
    imageDataData, provinces;

function mouseEvents(e) {
    const bounds = cv.getBoundingClientRect(),
        x = (mouse.x = e.pageX - bounds.left - scrollX),
        y = (mouse.y = e.pageY - bounds.top - scrollY);
    mouse.over =
        x >= 0 && x < bounds.width && y >= 0 && y < bounds.height;

    if (e.type === 'mousedown') {
        mouse.button = true;
    } else if (e.type === 'mouseup') {
        mouse.button = false;
    }

    const color = getColorUnderCursor(x, y);
    if (mouse.button && color !== mouse.lastColor) {
        mouse.lastColor = color;
        console.log(provinces[color]);
    }
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    if (r === undefined || g === undefined || b === undefined) {
        return "";
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getColorUnderCursor(x, y) {
    const width = cv.getBoundingClientRect().width;
    const height = cv.getBoundingClientRect().height;
    if (!(x > width || y > height)) {
        const cy = y / height * cv.height | 0;
        const cx = x / width * cv.width | 0;
        const index = ((cy * cv.width + cx) | 0) * 4;

        return rgbToHex(imageDataData[index],
            imageDataData[index + 1],
            imageDataData[index + 2]);
    }
}

async function bodyReady() {
    provinces = await fetch("provinces.json").then(r => {
        return r.json()
    });
    await createCanvas();
    imageDataData = cx.getImageData(0, 0, cv.width, cv.height).data;

    document.addEventListener('mousedown', mouseEvents);
    document.addEventListener('mouseup', mouseEvents);
    document.addEventListener('mousemove', mouseEvents);
}

async function createCanvas() {
    cv = document.createElement('canvas');
    cv.innerHTML = 'Your browser does not support the HTML5 canvas tag.';
    cv.width = "50";
    cv.height = "60";
    cx = cv.getContext('2d');

    const img = await loadImage("./netherlandspixel.png");

    cx.drawImage(img, 0, 0, 50, 60);
    document.body.appendChild(cv);

}

function loadImage(url) {
    return new Promise(r => {
        let i = new Image();
        i.onload = (() => r(i));
        i.src = url;
    });
}