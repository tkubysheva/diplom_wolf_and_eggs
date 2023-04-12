var GameManager = function() {
    this.init();
    // this.setup();
    this.connect();
    // this.start();
}

// Initial game settings
GameManager.prototype.init = function () {
    this.score = 0;
    this.loss = 0;
    this.over = false;
    this.won = false;

    this.count = 4;
    this.level = 1;
    this.speed = 800;
    // this.maxSpeed = 200;
    this.interval = this.speed*2.5;
    this.point = 2;

    this.chickens = {};
    this.eggs = {};

    this.gameTimer;

    this.port = null;

    this.basketStartPosition = { x: 0, y: 1 };
};

// Set up the game
GameManager.prototype.setup = function () {
    this.keyboard = new StabInputManager(this.port);
    this.keyboard.on("move", this.move.bind(this));

    this.grid = new Grid(this.count);
    this.basket = new Basket(this.basketStartPosition);

    for (var i = 0; i < this.count; i++) {
        this.chickens[i] = new Chicken(i, this.grid.list[i], this.point);
    }

    this.HTMLredraw = new HTMLredraw();
};

GameManager.prototype.connect = function () {
    const connectButton = document.getElementById("connect-btn");
    const usbVendorId = 0x2341;
    connectButton.addEventListener('click', async () => {
        try {
            this.port =  await navigator.serial.requestPort({ filters: [{ usbVendorId }]});
            await this.port.open({ baudRate: 115200 });
            connectButton.hidden = true;
            this.setup();
            this.start();
        } catch (e) {
            console.log("Error in connection:", e);
        }
    });

}

GameManager.prototype.move = function (data) {
    var position = { x: this.basket.x, y: this.basket.y };

    switch (data.type) {
        case 'arrow':
            // 0: up, 1: right, 2: down, 3: left, 4: R - restart
            if(data.key%2 == 0) {
                position.y = (data.key > 0) ? 0 : 1;
            } else {
                position.x = (data.key > 2) ? 0 : 1;
            }
            break;
        case 'stab':
            position.x = data.x;
            position.y = data.y;
            break;
        case 'common':
            if (data.key == 'restart') {
                this.reStart();
                return false;
            }
            break;
    }

    this.basket.updatePosition(position, this.api.bind(this));
}

GameManager.prototype.start = function () {
    while (!this.port){
        setTimeout(() => {  console.log("Wait connection...."); }, 1000);
    }
    this.runGear();
};

GameManager.prototype.reStart = function () {
    window.location.reload();
};

GameManager.prototype.runGear = function () {
    var self = this;
    this.gameTimer = setInterval(function() {
        var chicken = self.findAvailableChicken();
        if (chicken >= 0 && !this.over) {
            self.runEgg(chicken);
        }
    }, this.interval);
};

GameManager.prototype.suspendGear = function () {
    clearInterval(this.gameTimer);
    this.runGear();
};

GameManager.prototype.haltGear = function () {
    clearInterval(this.gameTimer);
    this.over = true;
};

GameManager.prototype.upLevel = function () {
    this.level++;

    switch (true) {
        case (this.level < 8):
            this.speed += -50;
            break;
        case (this.level > 19):
            this.speed += 0;
            break;
        default:
            this.speed += -25;
            break;
    }
    this.interval = this.speed*2.5;

    this.suspendGear();
};

GameManager.prototype.updateScore = function (data) {
    if (this.grid.list[data.egg].x == this.basket.x && this.grid.list[data.egg].y == this.basket.y) {
        this.score += this.point;
        this.HTMLredraw.updateScore({ value: this.score });

        if (this.score >= 1000) {
            this.gameWin();
            return false;
        }

        if (!(this.score % 50)) {
            this.upLevel();
        }
    } else {
        this.loss++;
        this.HTMLredraw.updateLossCount({ loss: this.loss });
        if (this.loss > 2 && !this.over) {
            this.gameOver();
        }
    }
};

GameManager.prototype.findAvailableChicken = function() {
    var avail = this.grid.avail.diff(this.grid.hold);

    if (!avail) {
        return null;
    }

    var chicken = avail.randomElement();
    this.api('onHoldChicken', { egg: chicken });

    return chicken;
};

GameManager.prototype.runEgg = function(chicken) {
    this.chickens[chicken].egg.run(this.speed, this.api.bind(this));
};

GameManager.prototype.gameOver = function() {
    this.haltGear();
    this.HTMLredraw.gameOver();
};

GameManager.prototype.gameWin = function() {
    this.haltGear();
    this.HTMLredraw.gameWin();
};

GameManager.prototype.api = function(method, data) {
    switch (method) {
        case 'updateScore':
            this.updateScore(data);
            break;
        case 'onHoldChicken':
            this.grid.onHold(data.egg);
            break;
        case 'unHoldChicken':
            this.grid.unHold(data.egg);
            break;
        case 'updateEggPosition':
            this.HTMLredraw.updateEggPosition(data);
            break;
        case 'updateBasketPosition':
            this.HTMLredraw.updateBasketPosition(data);
            break;
    }
};
