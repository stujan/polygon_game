linelist = []
pointlist = []
coorlist = []
coordinate = []
coordinate1 = []
coorlist1 = []
gametime = 0
looptime = 0;
done = 0;
var canvas = document.getElementById('demo-canvas2');
var canvas1 = document.getElementById('demo-canvas3');
var ctx = canvas.getContext('2d');
var ctx1 = canvas1.getContext('2d');
var back = document.getElementById('back');



//object

//coordinate
var coor = function(x,y,oper,value){
    this.x = x;
    this.y = y;
    this.oper = oper;
    this.value = value
}
//line object
var line = function(ctx,oper,idx,id,x1,y1,x2,y2){
    this.oper = oper;
    this.id = id;
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.idx = idx;
    this.ctx = ctx;
    this.color = "rgb(200,200,200)";
    //this.show = true;

    this.drawL = function(x,y){
        if(this.oper != ""){
            var lineRect = this.defineLineAsRect(this.x1,this.y1,this.x2,this.y2,3);
            this.drawLineAsRect(lineRect,this.color);
            //this.drawline(this.x1,this.y1,this.x2,this.y2,3,'white');
            if(x && y && this.ctx.isPointInPath(x,y)){
                this.destoryline();
                //this.destoryline();  
            }
        }

    }

    this.destoryline = function(){
        //pointlist = [];
        //linelist = [];
        this.color = "Red";

        if(coorlist.length == 1){
            this.changepoint(this.idx,1)
        }else{
            this.changepoint(this.idx);
        }
        animation();
        setTimeout("refresh()",100);

        //if (destoryL.length > 1)
        //this.show = false;
    }

    this.changepoint = function(idx,status){
        var list = [];
        for(var i in coordinate){
            var c = new coor(coordinate[i].x,coordinate[i].y,coordinate[i].oper,coordinate[i].value)
            list.push(c);
        }
        if(status){
            list[idx].oper = ""
        }else{
            var p1 = idx;
            var p2 = idx - 1;

            if(p2 < 0)
                p2 = coordinate.length -1 ;

            if(this.oper == '+')
                list[p2].value = list[p1].value + list[p2].value
            else
                list[p2].value = list[p1].value * list[p2].value


            list.splice(p1,1);
        }
        coordinate = list

        coorlist.push(list);

        //pointlist[p1].show = false;
        //pointlist[p2].show = false;

    }

    this.drawline= function(x1,y1,x2,y2,lineWidth,color){
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(x1,y1);
        this.ctx.lineTo(x2,y2);
        this.ctx.stroke();

        this.ctx.restore();
        this.ctx.closePath();
    }

    this.defineLineAsRect= function(x1,y1,x2,y2,lineWidth){
        var dx = x2 - x1;
        var dy = y2 - y1;
        var lineLength = Math.sqrt(dx*dx+dy*dy);
        var lineRadianAngle = Math.atan2(dy,dx);

        return({
            translateX:x1,
            translateY:y1,
            rotation:lineRadianAngle,
            rectX:0,
            rectY:-lineWidth/2,
            rectWidth:lineLength,
            rectHeight:lineWidth
        });


    }   
    this.drawLineAsRect=function(lineAsRect,color){
        var r = lineAsRect;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(r.translateX,r.translateY);
        this.ctx.rotate(r.rotation);
        this.ctx.rect(r.rectX,r.rectY,r.rectWidth,r.rectHeight);
        this.ctx.rotate(-r.rotation);
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
        this.ctx.font = "bolder 30px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(this.oper,(this.x1+this.x2)/2,(this.y1+this.y2)/2);
        
    } 
}




//point object
var point = function(ctx,value,x,y){
    this.value = value;
    this.x = x;
    this.y = y;
    this.show = true;
    this.ctx = ctx;
    this.color = "#97badc";
    this.drawP = function(x,y){
        if(this.show && value != ""){
            this.ctx.beginPath();
            //ctx.moveTo(this.x,this,y-9);
            this.ctx.fillStyle = this.color;
            var radis = this.value.toString().length
            this.ctx.arc(this.x,this.y,(radis+4)*2,5*Math.PI,0,true);
            this.ctx.fill();
            this.ctx.font = "bolder 10px Arial";
            this.ctx.fillStyle = "white";
            this.ctx.fillText(this.value, this.x - radis*2, this.y + 4);
            if(x && y && this.ctx.isPointInPath(x,y)){
                console.log('click the point')
            }
            this.ctx.closePath();
        }

    }
}


function play(){
    document.getElementById("partone").style.display = "none";
    document.getElementById("parttwo").style.display = "inline";
    
    getcoor();

    drawGame();
    drawtime();
    canvas.onmousedown = function(e){
        e = e || event;
        reDraw(e);
    }
    BestSolution();
}


//show the best path
function showBest(){
    setInterval("BestSoltion_draw()",1000);

}

function BestSoltion_draw(){
    if(looptime == coorlist1.length){
        looptime = 0;
    }
    var temp = coorlist1[looptime];
    var i = 0;
    while(i < temp.length){
        if(temp[i].value == ""){
            temp.splice(i,1)
        }else{
            i+=1;
        }
    }
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    for (i = 0; i < temp.length-1; i++) {
        //var vertex = polygon.vertices[i];
        var k = i+1;
        var l = new line(ctx1,temp[i+1].oper,i+1,k,temp[i].x,temp[i].y,temp[i+1].x,temp[i+1].y)
        l.drawL();
    }
    var l = new line(ctx1,temp[0].oper,0,1,temp[0].x,temp[0].y,temp[i].x,temp[i].y)
    l.drawL();
    for(i = 0;i<temp.length;i++){
        var pt = new point(ctx1,temp[i].value,temp[i].x,temp[i].y)
        //g.fillStyle = "rgb(255,161,0)";
        pt.drawP()
    }
    looptime += 1;
}

function BestSolution(){
    for (var i = 0; i < coordinate.length; i++) {
        var c = new coor(coordinate[i].x,coordinate[i].y,coordinate[i].oper,coordinate[i].value);
        coordinate1.push(c);
    }
    coorlist1.push(coordinate1);
    for (var p = 0;p < path.length;p++){
        var list = [];
        var i;
        for(i in coordinate1){
            var c = new coor(coordinate1[i].x,coordinate1[i].y,coordinate1[i].oper,coordinate1[i].value)
            list.push(c);
        }
        if( p == 0){
            list[path[p]-1].oper = "";
        }else{
            var p1 = path[p] - 1;
            var p2 = path[p] - 2;
            if(p2 < 0)
                p2 = coordinate1.length -1;
            while(list[p2].value == "" && p1 != p2){
                p2 -= 1;
                if(p2 < 0){
                    p2 = coordinate1.length -1;
                }
            }
            //var x = (list[p1].x + list[p2].x)/2;
            //var y = (list[p1].y + list[p2].y)/2;
            //list[p1].x = x;
            //list[p1].y = y;
            if(list[p1].oper == '+')
                list[p2].value = list[p1].value + list[p2].value;
            else
                list[p2].value = list[p1].value * list[p2].value;
            list[p1].value = "";
            list[p1].oper = "";
        }
        coordinate1 = list;
        coorlist1.push(list);
    }
}

//get all coordinate
function getcoor(){
    if(coordinate.length == 0){
        var i;
        for (i = 0; i < polygon.vertices.length; i++) {

            var c = new coor(polygon.vertices[i].x,polygon.vertices[i].y,op[i+1],v[i+1]);
            coordinate.push(c);
        }
        coorlist.push(coordinate);
    }
}



function animation(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(var i in linelist){
        linelist[i].drawL();
    }
    for(var i in linelist){
        pointlist[i].drawP();
    }
}


function reDraw(e){
    e = e||event;
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    if(ctx){
        for(var i = 0;i<linelist.length;i++){
            var c = linelist[i];
            c.drawL(x,y);
            //console.log('hello');
        }
        for(var i = 0;i<pointlist.length;i++){
            var p = pointlist[i];
            p.drawP();
        }
    }
}


function refresh(){
    drawGame();
}

//back to last operaction
function history_back(){
    if(coorlist.length > 1){
        coorlist.splice(coorlist.length-1,1);
        coordinate = coorlist[coorlist.length-1];
        drawGame();
    }

}
function drawScore(score){
    ctx.font = "bolder 20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("score:"+score,400,20);
    done = 1;
  
}

function drawtime(){
   setInterval(function () {
        if(done == 0)
            gametime++
        var value = ""
        var m=parseInt(gametime/60);
        var s=parseInt(gametime%60);
        value=toDub(m)+":"+toDub(s);
        ctx.clearRect(0, 0, 100, 30);
        ctx.font = "bolder 20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(value,20,20);
        
    },1000/60);

    function toDub(n){
        return n<10?"0"+n:""+n;
    }

}


function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    linelist = []
    pointlist = []


    var i;
    for (i = 0; i < coordinate.length-1; i++) {
        //var vertex = polygon.vertices[i];
        var k = i+1;
        var l = new line(ctx,coordinate[i+1].oper,i+1,i,coordinate[i].x,coordinate[i].y,coordinate[i+1].x,coordinate[i+1].y)
        l.drawL();
        linelist.push(l);
    }
    var l = new line(ctx,coordinate[0].oper,0,i,coordinate[0].x,coordinate[0].y,coordinate[i].x,coordinate[i].y)
    l.drawL();
    linelist.push(l);
    for(i = 0;i<coordinate.length;i++){
        var pt = new point(ctx,coordinate[i].value,coordinate[i].x,coordinate[i].y)
        //g.fillStyle = "rgb(255,161,0)";
        pt.drawP()
        pointlist.push(pt);
    }
    // var pt = new point(coordinate[i].value,coordinate[i].x,coordinate[i].y)
    // pt.drawP()
    // pointlist.push(pt)
    if(coordinate.length ==1)
        drawScore(coordinate[0].value);
}
