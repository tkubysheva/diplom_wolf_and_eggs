function StabInputManager(port) {
    this.events = {};
    this.port = port;
    this.data = [];
    this.listen();
}

StabInputManager.prototype.on = function (event, callback) {
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(callback);
};

StabInputManager.prototype.emit = function (event, data) {
    var callbacks = this.events[event];
    if (callbacks) {
        callbacks.forEach(function (callback) {
            callback(data);
        });
    }
};



var sensitivity=10;

StabInputManager.prototype.listen = async function () {
    var self = this;
    this.calculateValue2 = function (j){
            var result=0;
            for ( var i = (j+1)*4-1; i >= j*4; i--) {
                var income=this.data[i+1];
                if (income > 92) {income = income - 36;}
                else {income = income - 35;}
                result = result * 64 + income;
            }
       return result;
    }

    while (this.port.readable) {
        const reader = this.port.readable.getReader();
        var x0 = null;
        var y0 = null;
        try {
            while (true) {
                const {value, done} = await reader.read();
                if (done) {
                    console.log("canceled");
                    break;
                }
                for (var i = 0; i < value.length; i++){
                    if (this.data.length === 0 && value[i] === 35){
                        this.data.push(value[i])
                    }
                    else if (this.data.length >= 0 && this.data.length < 22) {
                        this.data.push(value[i])
                    }
                    else if (this.data.length === 22) {
                        if((this.data[0] === 35) && (this.data[20] === 35)) {
                            let values_list = []
                            for (var j = 4; j >= 0; j--) {
                                values_list.push(this.calculateValue2(j));
                            }
                            values_list = values_list.reverse()
                            var x1= -1 * (Math.round(sensitivity*0.0001*(Math.floor( values_list[1-1] ) - Math.floor( values_list[4-1] ) - Math.floor( values_list[3-1] ) + Math.floor( values_list[2-1] ) )));
                            var y1= -1 * (Math.round(sensitivity*0.0001*(Math.floor( values_list[1-1] ) + Math.floor( values_list[4-1] ) - Math.floor( values_list[2-1] ) - Math.floor( values_list[3-1] ) )));
                            console.log(x1, y1);
                            if (!x0 && !y0){
                                x0 = x1;
                                y0 = y1;
                            }
                            self.emit('move', {x: x1 - x0, y: y1 - y0, type: 'stab'});
                        }

                        this.data = [];
                    }
                }
            }
        } catch (error) {
            console.log("error");
        } finally {
            reader.releaseLock();
        }
    }
};
