Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

Element.prototype.show = function() {
    this.style.display = 'block';
};