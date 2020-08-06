//amsterdam x21y26
// x | 0 is shorthand to convert x to an integer

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

function setCanvasSize() {
    const cvExtraH = (cv.style.marginLeft.slice(0, -2) | 0) + (cv.style.borderWidth.slice(0, -2) | 0) * 2 + (cv.style.marginRight.slice(0, -2) | 0),
        infoCardExtra = (infoCard.div.style.marginLeft.slice(0, -2) | 0) + (infoCard.div.style.paddingLeft.slice(0, -2) | 0) + (infoCard.div.style.borderWidth.slice(0, -2) | 0) * 2 + (infoCard.div.style.paddingRight.slice(0, -2) | 0) + (infoCard.div.style.marginRight.slice(0, -2) | 0);

    if (6 * document.documentElement.clientWidth > 5 * document.documentElement.clientHeight) {
        cv.style.height = document.documentElement.clientHeight - ((cv.style.marginTop.slice(0, -2) | 0) + (cv.style.borderWidth.slice(0, -2) | 0) * 2 + (cv.style.marginBottom.slice(0, -2) | 0)) + "px";
        cv.style.width = ((cv.style.height.slice(0, -2) | 0) / 6 * 5 | 0) + "px";
    } else {
        cv.style.width = document.documentElement.clientWidth - cvExtraH + "px";
        cv.style.height = "auto";
    }

    const cvWidth = (cv.style.width.slice(0, -2) | 0) + cvExtraH;

    if (document.documentElement.clientWidth - cvWidth >= 160 + infoCardExtra) {
        infoCard.div.style.width = document.documentElement.clientWidth - cvWidth - infoCardExtra + "px"
    } else {
        infoCard.div.style.width = document.documentElement.clientWidth - infoCardExtra + "px";
    }
}

async function bodyReady() {
    provinces = await fetch('provinces.json').then((r) => {
        return r.json();
    });

    document.body.style.width = "100vw";
    document.body.style.height = "100vh";

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

    infoCard.div.style.border = "2px solid black";
    infoCard.div.style.margin = "8px";
    infoCard.div.style.padding = "8px";

    document.body.appendChild(infoCard.div);

    setCanvasSize();
    window.onresize = setCanvasSize;
}

async function createCanvas() {
    cv = document.createElement('canvas');
    cv.innerHTML = 'Your browser does not support the HTML5 canvas tag.';
    cv.width = '50';
    cv.height = '60';
    cx = cv.getContext('2d');
    cv.style.border = "2px solid black";
    cv.style.margin = "8px"

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