//amsterdam x21y26

const mouse = {
    x: 0,
    y: 0,
    button: false,
    lastColor: ''
};
let cv, imageDataData, provinces, previousCapital, infoCard;

function mouseEvents(e) {
    const bounds = cv.getBoundingClientRect(),
        x = (mouse.x = e.pageX - bounds.left - scrollX),
        y = (mouse.y = e.pageY - bounds.top - scrollY);
    mouse.over = x >= 0 && x < bounds.width && y >= 0 && y < bounds.height;

    if (e.type === 'mousedown') {
        mouse.button = true;
    } else if (e.type === 'mouseup') {
        mouse.button = false;
    }

    const color = getColorUnderCursor(x, y);
    if (mouse.button && color !== "" && color !== mouse.lastColor) {
        mouse.lastColor = color;
        console.log(color);

        setProvinceInfo(provinces[color]);

    }
}

function setProvinceInfo(province) {
    if (previousCapital) {
        cx.fillStyle = previousCapital.color;
        cx.fillRect(previousCapital.xy.x, previousCapital.xy.y, 1, 1);
    }
    infoCard.name.data = province.province;
    if (province.capital !== "") {
        previousCapital = {
            xy: province.capitalXY,
            color: province.color
        };
        const {
            width,
            height
        } = cv.getBoundingClientRect();
        cx.fillStyle = "red";
        cx.fillRect(province.capitalXY.x, province.capitalXY.y, 1, 1);
        infoCard.capital.data = province.capital
    } else {
        infoCard.capital.data = "None";
    }
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
    if (r === undefined || g === undefined || b === undefined) {
        return '';
    }
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getColorUnderCursor(x, y) {
    const {
        width,
        height
    } = cv.getBoundingClientRect();

    if (!(x > width || y > height)) {
        const cy = ((y / height) * cv.height) | 0;
        const cx = ((x / width) * cv.width) | 0;
        const index = ((cy * cv.width + cx) | 0) * 4;

        return rgbToHex(
            imageDataData[index],
            imageDataData[index + 1],
            imageDataData[index + 2]
        );
    }

    return "";
}

async function bodyReady() {
    provinces = await fetch('provinces.json').then((r) => {
        return r.json();
    });
    await createCanvas();
    imageDataData = cx.getImageData(0, 0, cv.width, cv.height).data;

    document.addEventListener('mousedown', mouseEvents);
    document.addEventListener('mouseup', mouseEvents);
    document.addEventListener('mousemove', mouseEvents);

    infoCard = {
        div: document.createElement("div"),
        title: document.createElement("h2"),
        nameTitle: new Text("Name: "),
        name: new Text,
        nameBreak: document.createElement("br"),
        capitalTitle: new Text("Capital: "),
        capital: new Text,
        capitalBreak: document.createElement("br"),
        infoTitle: new Text("Info: "),
        info: new Text
    }
    infoCard.div.id = "infoCard";
    infoCard.title.innerHTML = "Province info";
    for (el in infoCard) {
        //code replication vs 1 if statement less hmmm
        if (el !== "div") {
            infoCard.div.appendChild(infoCard[el]);
        }
    }
    document.body.appendChild(infoCard.div);
}

async function createCanvas() {
    cv = document.createElement('canvas');
    cv.innerHTML = 'Your browser does not support the HTML5 canvas tag.';
    cv.width = '50';
    cv.height = '60';
    cx = cv.getContext('2d');

    const img = await loadImage('./netherlandspixel.png');

    cx.drawImage(img, 0, 0, 50, 60);
    document.body.appendChild(cv);
}

function loadImage(url) {
    return new Promise((r) => {
        let i = new Image();
        i.onload = () => r(i);
        i.src = url;
    });
}