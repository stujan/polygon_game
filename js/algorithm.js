var N = 0;
var v;
var m;
var op;
var MAXN = 1024;
var path = [];
var backtrack;
var count = 0;
function initValue(){
	m = new Array(N+1);
	for(var i = 0;i<=N;i++){
		m[i] = new Array(N+1);
		for(var j=0 ;j<=N;j++){
			m[i][j] = new Array(2);
		}
	}
	backtrack = new Array(N+1);
	for(var i = 0;i<=N;i++){
		backtrack[i] = new Array(N+1);
	}
	v = new Array(N+1);
	v[0] = 0;
	op = new Array(N+1);
	op[0] = '';

}

function ranPoint(num){
    N = num
    initValue();
    document.getElementById("index").style.display="none";
    for(var i = 1;i <= N; i++){
        var x = Math.random()*500+10;
        var y = Math.random()*400+10;
        var oper;
        if(Math.random()>0.5)
            oper = "*";
        else
            oper = "+";
        var val = Math.floor(Math.random()*1000)-500;
        m[i][1][0] = val;
        m[i][1][1] = val;
        for(var j = 2;j<=N;j++){
			m[i][j][0] = MAXN;
			m[i][j][1] = MAXN*(-1);	
		}
		v[i] = val;
		op[i] = oper;
        var c = new coor(x,y,oper,val);
        coordinate.push(c); 
    }
    coorlist.push(coordinate);
	polygonGame(N);
    play();
}



function getValue(){
	initValue();

	for(var i = 1;i<=N;i++){
		var value = document.getElementById('v'+i).value;

		var oper= document.getElementById('op'+i).value;
		m[i][1][0] = Number(value);
		m[i][1][1] = Number(value);
		for(var j = 2;j<=N;j++){
			m[i][j][0] = MAXN;
			m[i][j][1] = MAXN*(-1);	
		}
		v[i] = Number(value);
		op[i] = oper;
	}

	polygonGame(N);
	play();
}


function polygonGame(n){
	var i,j;
	console.log(n);
	console.log(backtrack);
	for(j = 2;j<=n;j++){
		for(i=1;i<=n;i++){
			dealFunc(n,i,j)
		}
	}
	console.log(op);
	console.log(v);
	var max = m[1][n][1];
	var p = 1;
	for(i = 1;i<=n; i++){
		console.log("delete:"+i+"all:"+m[i][n][1]);
		if(max < m[i][n][1]){
			max = m[i][n][1];
			p = i;
		}
	}
	console.log("delete:"+p+"all:"+max);
	console.log(m);
	backtrack[0][0] = p;
	dealPath(max,p,n);
	path.push(p)
	path.reverse();
	console.log(path);
}


function dealPath(val,i,j){
	if(j==1)
		return;

	for(var k = 1;k<j;k++){
		var a = m[i][k][0];
		var b = m[i][k][1];
		var next = i+k;
		if(next>N)
			next%=N;
		var c = m[next][j-k][0];
		var d = m[next][j-k][1];
		if(op[next] == "+"){
			var num1 = b + d;
			var num2 = a + c;
			if(val == num1){
				path.push(next)
				dealPath(b,i,k)
				dealPath(d,next,j-k)
				break;
			}
			else if(val == num2){
				path.push(next)
				dealPath(a,i,k)
				dealPath(c,next,j-k)
				break;
			}
		}else{
			var num1 = a * c;
			var num2 = a * d;
			var num3 = b * c;
			var num4 = b * d;
			if(val == num1){
				path.push(next)
				dealPath(a,i,k)
				dealPath(c,next,j-k)
				break;
			}
			else if(val == num2){
				path.push(next)
				dealPath(a,i,k)
				dealPath(d,next,j-k)
				break;
			}
			else if(val == num3){
				path.push(next)
				dealPath(b,i,k)
				dealPath(c,next,j-k)
				break;
			}

			else if(val == num4){
				path.push(next)
				dealPath(b,i,k)
				dealPath(d,next,j-k)
				break;
			}
		}
	}
}

function dealFunc(n,i,j){
	for(var k = 1;k<j;k++){
		var a = m[i][k][0];
		var b = m[i][k][1];
		var next = i+k;
		if(next>N)
			next%=N;
		var c = m[next][j-k][0];
		var d = m[next][j-k][1];
		var maxf,minf;
		if(op[next] == '+'){
			maxf = b+d;
			minf = a+c;
		}else{
			var e = new Array(4);
			e[0] = a*c;
			e[1] = a*d;
			e[2] = b*d;
			e[3] = b*c;
			minf = e[0];
			maxf = e[0];
			for(var t = 1;t<4;t++){
				if(minf>e[t])
					minf = e[t];
				if(maxf<e[t]){
					maxf=e[t];
				}
			}
		}
		if(m[i][j][0]>minf)
			m[i][j][0] = minf;
		if(m[i][j][1]<maxf){
			m[i][j][1]=maxf;
            backtrack[i][j] = k;
		}

	}
}


function allChange(num){
	N = num;
	addTable(N);
}

function addTable(num){
	var tbody = document.getElementById("tbody");
	while(tbody.hasChildNodes()){
		tbody.removeChild(tbody.firstChild);
	}

	for(var i =0;i<num;i++){
		var temp = document.createElement("tr");
		var td1 = document.createElement("td");
		var td2 = document.createElement("td");
		var input1 = document.createElement("input");
		var input2 = document.createElement("input");
		input1.id = "v"+(i+1);
		input2.id = "op"+(i+1);
		td1.appendChild(input1);
		td2.appendChild(input2);
		temp.appendChild(td1);
		temp.appendChild(td2);
		tbody.appendChild(temp);
	}
}
