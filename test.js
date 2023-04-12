function valmerge(valuestr) {

    if(valuestr){
        if(valuestr=='connected'){ console.log('conn'); stat=true;}
        else{
            //if (value.length==1) {console.log("solo");} else
            if (valuestr.length==22) {got22(valuestr);tmpvalue="";}
            else {   tmpvalue=tmpvalue+valuestr;  if (tmpvalue.length==22) {console.log("---conn-");console.log(tmpvalue);got22(tmpvalue);tmpvalue="";}    else {    tmpvalue=valuestr;   } }
        }//end connected
    }//end value


}

function gotdataapi(vaal){
    for ( var j=4; j>=0;j--){
        var result=0;
        for ( var i = (j+1)*4-1; i >= j*4; i--) {
//       var income=vaal.charCodeAt(i+1);
            var income=vaal[i+1];
            if (income >92 ) { income=income -36;}
            else {income=income-35;}
            result=result*64+income;
        }
        m[j]=result;
    }
    console.log(vaal);
    console.log(m);
}

function got22api(vals) {
    console.log("-- 22api ----");
//console.log(vals.charCodeAt(0));
//     myrnd=oldmyrnd+10000*Math.round(sernum);
    if((vals[0]==35)&&(vals[20]==35)){
        sernum=vals[21];
//      console.log(sernum);

        gotdataapi(vals);
        xout=Math.round((Math.floor( m[1-1] ) - Math.floor( m[4-1] ) - Math.floor( m[3-1] ) + Math.floor( m[2-1] ) ));
        yout=Math.round((Math.floor( m[1-1] ) + Math.floor( m[4-1] ) - Math.floor( m[2-1] ) - Math.floor( m[3-1] ) ));

//p-myrnd+10000*Math.round(sernum)
//r-from
//s-type (0-9) Ngames  11- eyes open with feedback
        if ( (m[0]>2)&& (m[1]>2)&&(m[2]>2)&&(m[3]>2) ) {
            console.log("taken");
            if ( (Math.abs(m[0]-m0[0])<10000)&& (Math.abs(m[1]-m0[1])<10000)&&(Math.abs(m[2]-m0[2])<10000)&&(Math.abs(m[3]-m0[3])<10000) ) {
                x1=Math.round(sensitivity*0.001*(Math.floor( m[1-1] ) - Math.floor( m[4-1] ) - Math.floor( m[3-1] ) + Math.floor( m[2-1] ) ));
                y1=Math.round(sensitivity*0.001*(Math.floor( m[1-1] ) + Math.floor( m[4-1] ) - Math.floor( m[2-1] ) - Math.floor( m[3-1] ) ));
                mg=Math.round(m[0]+m[1]+m[2]+m[3]);
                tmr=Math.floor(m[5-1]);
                arx.push(x1); arx=arx.slice(-5);
                ary.push(y1); ary=ary.slice(-5);
                armg.push(mg); armg=armg.slice(-5);

                if((median(mg)>(zeromass+100000))&&(zerocheck>0)) {
                    console.log("newservlog");
                    console.log(mg);
                    console.log(zeromass);
                    var someObj = {x:xout,y:yout,m1:m[0],m2:m[1],m3:m[2],m4:m[3],t:m[4],s:11,p:myrnd+10000*Math.round(sernum),r:'index2' };
                    servlog(someObj); }



            } else {console.log("skipped");}
            m0=m;}



        else {console.log("removed_M");}
    }
    else {console.log("removed_0");}
//console.log(tmr);

}


function got22(vals) {
//     console.log("-- 22 ----");
//console.log(vals.charCodeAt(0));
//     myrnd=oldmyrnd+10000*Math.round(sernum);
    if((vals.charCodeAt(0)==35)&&(vals.charCodeAt(20)==35)){
        sernum=vals.charCodeAt(21);
//      console.log(sernum);

        gotdata(vals);

        xout=Math.round((Math.floor( m[1-1] ) - Math.floor( m[4-1] ) - Math.floor( m[3-1] ) + Math.floor( m[2-1] ) ));
        yout=Math.round((Math.floor( m[1-1] ) + Math.floor( m[4-1] ) - Math.floor( m[2-1] ) - Math.floor( m[3-1] ) ));

//p-myrnd+10000*Math.round(sernum)
//r-from
//s-type (0-9) Ngames  11- eyes open with feedback

        if ( (m[0]>2)&& (m[1]>2)&&(m[2]>2)&&(m[3]>2) ) {
            if ( (Math.abs(m[0]-m0[0])<10000)&& (Math.abs(m[1]-m0[1])<10000)&&(Math.abs(m[2]-m0[2])<10000)&&(Math.abs(m[3]-m0[3])<10000) ) {
                x1=Math.round(sensitivity*0.001*(Math.floor( m[1-1] ) - Math.floor( m[4-1] ) - Math.floor( m[3-1] ) + Math.floor( m[2-1] ) ));
                y1=Math.round(sensitivity*0.001*(Math.floor( m[1-1] ) + Math.floor( m[4-1] ) - Math.floor( m[2-1] ) - Math.floor( m[3-1] ) ));
                mg=Math.round(m[0]+m[1]+m[2]+m[3]);
                tmr=Math.floor(m[5-1]);
                arx.push(x1); arx=arx.slice(-5);
                ary.push(y1); ary=ary.slice(-5);
                armg.push(mg); armg=armg.slice(-5);

                if((median(mg)>(zeromass+100000))&&(zerocheck>0)) {
                    console.log("newservlog");
                    console.log(mg);
                    console.log(zeromass);
                    var someObj = {x:xout,y:yout,m1:m[0],m2:m[1],m3:m[2],m4:m[3],t:m[4],s:11,p:myrnd+10000*Math.round(sernum),r:'index2' };
                    servlog(someObj); }



            }
            m0=m;}
        else {console.log("removed_M");}
    }
    else {console.log("removed_0");}
//console.log(tmr);

}





function std (array) {
    const n = array.length
    const mean = array.reduce((a, b) => a + b) / n
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

function median(vals){
    if(vals.length ===0) throw new Error("No inputs");

    else if(vals.length ===1) {console.log('11'+vals);return vals;}
    else if(vals.length ===undefined) {console.log('uuu'+vals);return vals;}
    else {

        vals.sort(function(a,b){
            return a-b;
        });

        var half = Math.floor(vals.length / 2);

        if (vals.length % 2)
            return vals[half];

        return (vals[half - 1] + vals[half]) / 2.0; }
}


function gotdata(vaal){
    for ( var j=4; j>=0;j--){
        var result=0;
        for ( var i = (j+1)*4-1; i >= j*4; i--) {
            var income=vaal.charCodeAt(i+1);
            if (income >92 ) { income=income -36;}
            else {income=income-35;}
            result=result*64+income;
        }
        m[j]=result;
    }

}

function servlog(someObj){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 's.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('param=' + JSON.stringify(someObj));
    xhr.onreadystatechange = function()
    {if (this.readyState == 4)
    {if (this.status == 200) {console.log(xhr.responseText);}
    else {console.log('ajax error');    }
    }
    };
}

