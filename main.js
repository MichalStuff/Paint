const c = document.querySelector('.myCanvas');
const ctx = c.getContext("2d");
const slider = document.querySelector('.pen__size');
const sliderInfo = document.querySelector('.pen__sizeInfo');
const colorsPiker = document.querySelectorAll('.color');
const colorInput = document.querySelector('.color_input');

const correction = 104;
let canvasImage = undefined;
const image = new Image();
let isMobile = false;

console.log(sliderInfo)

const deviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};
console.log(deviceType())


let color = 'rgb(0, 0, 0)'
let sliderValue = 5;
slider.value = sliderValue;

colorsPiker.forEach(colorItem => colorItem.addEventListener('click', () => {
    const style = getComputedStyle(colorItem, 'background-color');
    const backgroundColor = style.backgroundColor;
    console.log(backgroundColor);
    color = backgroundColor;
    colorInput.value = rgbToHex(color);
}))

slider.addEventListener("input", (e) => {
    sliderValue = parseInt(slider.value);
    sliderInfo.innerHTML = `Size of pen : ${slider.value}`;

})

c.width = window.innerWidth;
c.height = window.innerHeight - correction;

let painting = false;

const startPosition = (e) => {
    painting = true;
    draw(e)
}

const finishedPosition = () => {
    painting = false;
    ctx.beginPath();
    canvasImage = c.toDataURL();
    image.src = canvasImage;
}

const draw = (e) => {
    if (!painting) return;

    ctx.lineWidth = sliderValue;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineTo(e.clientX, e.clientY - correction);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY - correction);

}

const drawMobile = (e) => {
    if (!painting) return;
    e.preventDefault()
    ctx.lineWidth = sliderValue;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY - correction);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.touches[0].clientX, e.touches[0].clientY - correction);

}

colorInput.addEventListener("change", () => {
    color = colorInput.value;
});

const Keyboard = (e) => {

}

const rgbToHex = (string) => {
    let r = string.slice(string.indexOf('(') + 1, string.indexOf(','));
    r = r * 1;
    string = string.slice(string.indexOf(',') + 1);
    let g = string.slice(0, string.indexOf(','));
    g = g * 1;
    string = string.slice(string.indexOf(',') + 1);
    let b = string.slice(0, string.indexOf(')'));
    b = b * 1;
    const hex = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    return hex;

}

window.addEventListener('keypress', Keyboard)

c.addEventListener('mousedown', startPosition);
c.addEventListener('mouseup', finishedPosition);
c.addEventListener('mousemove', draw);

c.addEventListener('touchstart', startPosition);
c.addEventListener('touchmove', drawMobile);
c.addEventListener('touchend', finishedPosition);

window.addEventListener('resize', (event) => {
    c.width = window.innerWidth;
    c.height = window.innerHeight - correction;
    ctx.drawImage(image, 0, 0);
});