function HTMLredraw() {
    this.basket = document.querySelector('#basket');
    this.gameWrap = document.querySelector('#game-wrap');
    this.scoreWrap = document.querySelector('#score');
    this.messageWrap = document.querySelector('#message');
    this.scoreNums = 4;
}

HTMLredraw.prototype.updateEggPosition = function(data) {
    this.changeAttributesValue(['data-egg-' + data.egg], [data.position]);
};

HTMLredraw.prototype.is_basket_nearly_egg = function(data) {
    const egg = document.querySelector('#egg' + data);
    console.log(egg.getBoundingClientRect())
    console.log(window.getComputedStyle(egg))
    const egg_top = Number(window.getComputedStyle(egg).top.slice(0, -2)) //egg.getBoundingClientRect().x
    const egg_left = Number(window.getComputedStyle(egg).left.slice(0, -2)) //egg.getBoundingClientRect().y
    const x_validation = Math.abs(this.basket.getBoundingClientRect().x - egg_left) < 60
    const y_validation = (this.basket.getBoundingClientRect().y + 40) > egg_top
    if (data === 0) {
        console.log(egg.style)
        console.log("X - разница: " + Math.abs(this.basket.getBoundingClientRect().x - egg_left))
        console.log("Y-b: ", this.basket.getBoundingClientRect().y, "Y-e: ", egg_top)
        console.log("X-b: ", this.basket.getBoundingClientRect().x, "X-e: ", egg_left)
        console.log(x_validation, y_validation)
    }
    return x_validation && y_validation
};

HTMLredraw.prototype.updateBasketPosition = function(data) {
    this.changeAttributesValue(['left'], [data.left]);
    this.basket.style.transform = `translate(${data.x - 40}px, ${data.y - 40}px)`;
};

HTMLredraw.prototype.changeAttributesValue = function(attributes, values) {
    if (attributes instanceof Array && values instanceof Array && attributes.length === values.length) {
        for (var i = 0; i < attributes.length; i++) {
            this.gameWrap.setAttribute(attributes[i], values[i]);
        }
    }
};

HTMLredraw.prototype.updateScore = function(data) {
    var elements = this.scoreWrap.getElementsByTagName('li');
    var score = data.value.toString();
    var empty = (this.scoreNums - score.length);

    for (var i = 0; i < elements.length; i++) {
        var num = (i < empty) ? 0 : parseInt(score.charAt(i - empty));
        elements[i].className = 'n-' + num;
    }
};

HTMLredraw.prototype.updateLossCount = function(data) {
    this.changeAttributesValue(['data-loss'], [data.loss]);
};

HTMLredraw.prototype.gameOver = function() {
    var msg = this.getMessage('Game Over');

    this.messageWrap.show();
    this.messageWrap.appendChild(msg);
};

HTMLredraw.prototype.gameWin = function() {
    var msg = this.getMessage('You\'ve Won!');

    this.messageWrap.show();
    this.messageWrap.appendChild(msg);
};

HTMLredraw.prototype.getMessage = function(message) {
    var data = { h3: message, p: 'Press <b>R</b> to restart' };

    var wrap = document.createElement('div');
    for (var tag in data) {
        var elem = document.createElement(tag);
        elem.innerHTML = data[tag];
        wrap.appendChild(elem);
    }

    return wrap;
};
