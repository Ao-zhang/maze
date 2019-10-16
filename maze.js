var ctxs, wid, hei, cols, rows, mazes,virtualmaze, stacks=[],  start = [{x:-1, y:-1}, {x:-1, y:-1}], end = [{x:-1, y:-1}, {x:-1, y:-1}], grid = 8, padding = 16, s, density=0.5,INF=100000;
var direction=new Array({x:1,y:0},{x:-1,y:0},{x:0,y:-1},{x:0,y:1},{x:1,y:1},{x:-1,y:1},{x:1,y:-1},{x:-1,y:1});
// 对整个图绘制
function drawMaze(index) {           
    for( var i = 0; i < cols; i++ ) {
        for( var j = 0; j < rows; j++ ) {
            switch( mazes[index][i][j] ) {
                case 0: ctxs[index].fillStyle = "chocolate"; break;         //0表示可以走的路
                case 1: ctxs[index].fillStyle = "darkseagreen"; break;      //1表示墙
                case 2: ctxs[index].fillStyle = "greenyellow"; break;       //2表示还存在栈中的道路
                case 3: ctxs[index].fillStyle = "bisque"; break;            //3表示已经找到的通路
                case 4: ctxs[index].fillStyle = "firebrick"; break;         //4表示找过但不通的死路
                case 8: ctxs[index].fillStyle = "olive"; break;             //8表示选定的终点或者起点
                case 9: ctxs[index].fillStyle = "gold"; break;
            }
            ctxs[index].fillRect( grid * i, grid * j, grid, grid  );
        }
    }
}
// 对某个点绘制
function drawBlock(sx, sy,index=0) {     
    switch( mazes[index][sx][sy] ) {
        case 0: ctxs[index].fillStyle = "chocolate"; break;         //0表示可以走的路
        case 1: ctxs[index].fillStyle = "darkseagreen"; break;      //1表示墙
        case 2: ctxs[index].fillStyle = "greenyellow"; break;       //2表示还存在栈中的道路
        case 3: ctxs[index].fillStyle = "bisque"; break;            //3表示已经找到的通路
        case 4: ctxs[index].fillStyle = "firebrick"; break;         //4表示找过但不通的死路
        case 8: ctxs[index].fillStyle = "olive"; break;             //8表示选定的终点或者起点
        case 9: ctxs[index].fillStyle = "gold"; break;
    }
    ctxs[index].fillRect( grid * i, grid * j, grid, grid  );
}
// 迷宫1找当前可走的方向
function getFNeighbours( index,sx, sy, a,mode=0 ) {          
    var n = [];
    if(mode==0){
    if( sx - 1 > 0 && mazes[index][sx - 1][sy] % 8 == a ) {
        n.push( { x:sx - 1, y:sy } );
    }
    if( sx + 1 < cols - 1 && mazes[index][sx + 1][sy] % 8 == a ) {
        n.push( { x:sx + 1, y:sy } );
    }
    if( sy - 1 > 0 && mazes[index][sx][sy - 1] % 8 == a ) {
        n.push( { x:sx, y:sy - 1 } );
    }
    if( sy + 1 < rows - 1 && mazes[index][sx][sy + 1] % 8 == a ) {
        n.push( { x:sx, y:sy + 1 } );
    }
}
else {
    for(var i=0;i<8;i++){
        var adj={x:-1 ,y: -1};
         adj.x=sx+direction[i].x; adj.y=sy+direction[i].y;
        if(adj.x>=0&&adj.x<cols){
            if(adj.y>=0&&adj.y<rows){
                if(mazes[index][adj.x][adj.y]% 8 == a){
                    n.push(adj);
            }
        }
    }
    }
}
    return n;
}
//迷宫1找当前可走的方向（新方法）
function getFNeighboursNew(index, sx, sy, a) {

    var n = [];
    var dx = end[index].x - sx;
    var dy = end[index].y - sy;

    if(dx >= 0) {
        if(dy >= 0) {
            if(dy >= dx) {          //应该先向y+方向走的情况
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
            }
            else {                  //应该先向x+方向走的情况
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
            }
        }
        else {
            if(-1 * dy >= dx) {     //先向y-走
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
            }
            else {                  //x+走
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
            }
        }
    }
    else {
        if(dy < 0) {
            if(dy <= dx) {
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
            }
            else {
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
            }
        }
        else {
            if(dy >= dx * -1) {
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
            }
            else {
                if(mazes[index][sx - 1][sy] % 8 == a) {
                    n.push({x:sx - 1, y:sy})
                }
                if(mazes[index][sx][sy + 1] % 8 == a) {
                    n.push({x:sx, y:sy + 1})
                }
                if(mazes[index][sx][sy - 1] % 8 == a) {
                    n.push({x:sx, y:sy - 1})
                }
                if(mazes[index][sx + 1][sy] % 8 == a) {
                    n.push({x:sx + 1, y:sy})
                }
            }
        }
    }

    return n; 
}
//  迷宫1查找路径
function solveMaze1(index) {
    if( start[index].x == end[index].x && start[index].y == end[index].y ) {
        for( var i = 0; i < cols; i++ ) {
            for( var j = 0; j < rows; j++ ) {
                switch( mazes[index][i][j] ) {
                    case 2: mazes[index][i][j] = 3; break;
                }
            }
        }
        drawMaze(index);
        return;
    }
    var neighbours = getFNeighbours( 0, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }
 
    drawMaze(index);
    requestAnimationFrame( function() {
        solveMaze1(index);
    } );
}
function solveMaze1New(index) {

    if( start[index].x == end[index].x && start[index].y == end[index].y ) {
        for( var i = 0; i < cols; i++ ) {
            for( var j = 0; j < rows; j++ ) {
                switch( mazes[index][i][j] ) {
                    case 2: mazes[index][i][j] = 3; break;
                }
            }
        }
        drawMaze(index);
        return;
    }
    var neighbours = getFNeighboursNew( 1, start[index].x, start[index].y, 0 );
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }
 
    drawMaze(index);
    requestAnimationFrame( function() {
        solveMaze1New(index);
    } );
}
// 计算路径
function distance(index=1){
    var t,tmpstack=[];
    tmpstack.push(end[index]);
    while(tmpstack.length){
        t=tmpstack.shift()
    for(var i=0;i<8;i++){
        var adj={x:-1 ,y: -1};
         adj.x=t.x+direction[i].x; adj.y=t.y+direction[i].y;
        if(adj.x>=0&&adj.x<cols){
            if(adj.y>=0&&adj.y<rows){
                if(mazes[index][adj.x][adj.y]!=1){
                    if(virtualmaze[index][adj.x][adj.y]==INF) tmpstack.push(adj);    //第一次调用
                    var td=virtualmaze[index][t.x][t.y]+(i<4?10:14);     //i<4时是周围直线4个，i>=4的时候是走斜线
                    if(td<virtualmaze[index][adj.x][adj.y]){        //如果td
                        virtualmaze[index][adj.x][adj.y]=td;
                    }
            }
        }
        }
    }
}
}
// 找下一个点
function getnext(index=1){
    var min=INF;
    var x,y,next={x:start[index].x,y:start[index].y};
    for(var i=0;i<8;i++){
         x=start[index].x+direction[i].x;
         y=start[index].y+direction[i].y;
        if(x>=0&&x<cols){
            if(y>=0&&y<rows){
                if(virtualmaze[index][x][y]<min){
                    min=virtualmaze[index][x][y];
                    next.x=x;next.y=y;
                }
            }
        }
    }
    return next;
}
function move(index){
 //   console.log(start[index].x);
 //   console.log(end[index].x);
    if( start[index].x == end[index].x && start[index].y == end[index].y ) {
        for( var i = 0; i < cols; i++ ) {
            for( var j = 0; j < rows; j++ ) {
                switch( mazes[index][i][j] ) {
                    case 2: mazes[index][i][j] = 3; break;
            }
        }
    }
        drawMaze(index);
        return;
    } 
var t=getnext(index);
start[index].x=t.x;start[index].y=t.y;
mazes[index][start[index].x][start[index].y] = 2;
drawMaze(index);
requestAnimationFrame( function() {
    move(index);
} );
} 
// 迷宫2找当前可走的方向
function solveMaze2(index=0) {
  //   console.log(start[index].x);
    if( start[index].x == end[index].x && start[index].y == end[index].y ) {
        for( var i = 0; i < cols; i++ ) {
            for( var j = 0; j < rows; j++ ) {
                switch( mazes[index][i][j] ) {
                    case 2: mazes[index][i][j] = 3; break;
                }
            }
        }
        drawMaze(index);
        return;
    }
    var neighbours = getFNeighbours( 0, start[index].x, start[index].y, 0,1);
    if( neighbours.length ) {
        stacks[index].push( start[index] );
        start[index] = neighbours[0];
        mazes[index][start[index].x][start[index].y] = 2;
    } else {
        mazes[index][start[index].x][start[index].y] = 4;
        start[index] = stacks[index].pop();
    }
 
    drawMaze(index);
    requestAnimationFrame( function() {
        solveMaze2(index);
    } );
}

function solveMaze2new(index=1){
    virtualmaze=createArray( cols, rows,INF);
    virtualmaze[index][end[index].x][end[index].y]=0;
    distance(index);
        move(index);
 }  
// 处理鼠标点击选择起点与终点的函数
function getCursorPos( event ) {
    var rect = this.getBoundingClientRect();
    var x = Math.floor( ( event.clientX - rect.left ) / grid / s), 
        y = Math.floor( ( event.clientY - rect.top  ) / grid / s);
    
    if(end[0].x != -1) {        //end没有初始化
        onClear();
    }

    if( mazes[0][x][y] ) return;        //如果此点是墙
    if( start[0].x == -1 ) {
        start[0] = { x: x, y: y };
        start[1] = { x: x, y: y };
        mazes[0][start[0].x][start[0].y] = 9;
        mazes[1][start[1].x][start[1].y] = 9;
        
        for(var i = 0; i < 2; i++) {
            drawMaze(i); 
        }
        return;
    } 
    else {
        end[0] = { x: x, y: y };
        end[1] = { x: x, y: y };
        mazes[0][end[0].x][end[0].y] = 8;
        mazes[1][end[1].x][end[1].y] = 8;
        solveMaze1(0);
        solveMaze1New(1);
    }
}
function getCursorPos2( event ) {
    var rect = this.getBoundingClientRect();
    var x = Math.floor( ( event.clientX - rect.left ) / grid / s), 
        y = Math.floor( ( event.clientY - rect.top  ) / grid / s);
    
    if(end[0].x != -1) {        //end没有初始化
        onClear();
    }

    if( mazes[0][x][y] ) return;        //如果此点不能走
    if( start[0].x == -1 ) {
        start[0] = { x: x, y: y };
        start[1] = { x: x, y: y };
        mazes[0][start[0].x][start[0].y] = 9;
        mazes[1][start[1].x][start[1].y] = 9;
        
        for(var i = 0; i < 2; i++) {
            drawMaze(i); 
        }
        return;
    } else {
        end[0] = { x: x, y: y };
        end[1] = { x: x, y: y };
        mazes[0][end[0].x][end[0].y] = 8;
        mazes[1][end[1].x][end[1].y] = 8;
        solveMaze2(0);
        solveMaze2new(1);
    }
}
// 查找还可以绘制墙面的地方
function getNeighbours(index=0, sx, sy, a ) {
    var n = [];
    if( sx - 1 > 0 && mazes[index][sx - 1][sy] == a && sx - 2 > 0 && mazes[index][sx - 2][sy] == a ) {
        n.push( { x:sx - 1, y:sy } ); n.push( { x:sx - 2, y:sy } );
    }
    if( sx + 1 < cols - 1 && mazes[index][sx + 1][sy] == a && sx + 2 < cols - 1 && mazes[index][sx + 2][sy] == a ) {
        n.push( { x:sx + 1, y:sy } ); n.push( { x:sx + 2, y:sy } );
    }
    if( sy - 1 > 0 && mazes[index][sx][sy - 1] == a && sy - 2 > 0 && mazes[index][sx][sy - 2] == a ) {
        n.push( { x:sx, y:sy - 1 } ); n.push( { x:sx, y:sy - 2 } );
    }
    if( sy + 1 < rows - 1 && mazes[index][sx][sy + 1] == a && sy + 2 < rows - 1 && mazes[index][sx][sy + 2] == a ) {
        n.push( { x:sx, y:sy + 1 } ); n.push( { x:sx, y:sy + 2 } );
    }
    return n;
}
// 初始化maze数组
function createArray( c, r ,a=1) {
    var m = new Array( 2 );
    for( var i = 0; i < 2; i++ ) {
        m[i] = new Array( c );
        for( var j = 0; j < c; j++ ) {
            m[i][j] = new Array(r);
            for(var k = 0; k < r; k++) {
                m[i][j][k] = a;
            }
        }
    }
    return m;
}
// 创建maze1，一步一步地绘制
function createMaze1() {
    var neighbours = getNeighbours( 0, start[0].x, start[0].y, 1 ), l;
    if( neighbours.length < 1 ) {
        if( stacks[0].length < 1 ) {

            for(var i = 0; i < 2; i++) {
                drawMaze(i); 
            }

            stacks = new Array(2);
            stacks[0] = []
            stacks[1] = [];
            
            start[0].x = start[0].y = -1;
            document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos, false );
            document.getElementById("btnCreateMaze").removeAttribute("disabled");

            return;
        }
        start[0] = stacks[0].pop();
    } else {
        var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
        l = neighbours[i]; 
        mazes[0][l.x][l.y] = 0;
        mazes[1][l.x][l.y] = 0;

        l = neighbours[i + 1]; 
        mazes[0][l.x][l.y] = 0;
        mazes[1][l.x][l.y] = 0;

        start[0] = l

        stacks[0].push( start[0] )
    }
    for(var i = 0; i < 2; i++) {
        drawMaze(i); 
    }
    
    requestAnimationFrame( createMaze1 );     //此函数会使图片按照函数循环不断更新 
}
// 一下绘制完地图1
function createMaze1NonAni() {
    while(true) {
        var neighbours = getNeighbours(0, start[0].x, start[0].y, 1 ), l;
        if( neighbours.length < 1 ) {
            if( stacks[0].length < 1 ) {
                for(var i = 0; i < 2; i++) {
                    drawMaze(i); 
                    drawMaze(i);    
                }
    
                for(var i = 0; i < 2; i++) {
                    drawMaze(i); 
                    drawMaze(i);    
                } 
                stacks = new Array(2);
                stacks[0] = []
                stacks[1] = [];
                
                start[0].x = start[0].y = -1;
                document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos, false );
                document.getElementById("btnCreateMaze").removeAttribute("disabled");       //btnCreateMaze为html文件中创建的变量
                return;
            }
            start[0] = stacks[0].pop();
        } else {
            var i = 2 * Math.floor( Math.random() * ( neighbours.length / 2 ) )
            l = neighbours[i]; 
            mazes[0][l.x][l.y] = 0;    
            mazes[1][l.x][l.y] = 0;

            l = neighbours[i + 1]; 
            mazes[0][l.x][l.y] = 0;
            mazes[1][l.x][l.y] = 0;
    
            start[0] = l
            stacks[0].push( start[0] )
        }    
    }
}
// 创建maze2，一步一步地绘制
function createMaze2() {

    var r = Math.random();

    mazes[0][start[0].x][start[0].y] = r < density ? 0 : 1;
    mazes[1][start[0].x][start[0].y] = r < density ? 0 : 1;
    
    drawMaze(0);
    drawMaze(1);

    if(start[0].x == (cols - 1) && start[0].y == (rows - 1)){
        start[0].x = start[0].y=-1 ;
        document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos2, false );
        document.getElementById("btnCreateMaze").removeAttribute("disabled");       //使creat maze按钮重新有效
        return;
    }

    start[0].x = start[0].x + 1;
    if(start[0].x == cols){
        start[0].x = 0;
        start[0].y = start[0].y + 1;
    }

    requestAnimationFrame(createMaze2);
}
// 一下绘制完maze2
function createMaze2NonAni() {

    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            flag = Math.random();
            mazes[0][i][j] = flag < density ? 0 : 1;    
            mazes[1][i][j] = flag < density ? 0 : 1;    
        }
    }

    drawMaze(0);
    drawMaze(1);
    start[0].x = start[0].y=-1 ;
    start[1].x = start[1].y=-1 ;
    document.getElementById( "canvas1" ).addEventListener( "mousedown", getCursorPos2, false );
    document.getElementById("btnCreateMaze").removeAttribute("disabled");
}

function createCanvas(count=2) {
    ctxs = new Array(count);
    mazes = new Array(count);

    for(var i = 0; i < count; i++) {
        var canvas = document.createElement( "canvas" );
        wid = document.getElementById("maze" + (i + 1)).offsetWidth - padding; 
        hei = 400;
        
        canvas.width = wid; canvas.height = 400;
        canvas.id = "canvas" + (i + 1);
        ctxs[i] = canvas.getContext( "2d" );
        ctxs[i].fillStyle = "#008B8B"; 
        var div = document.getElementById("maze" + (i + 1))
        div.appendChild( canvas );    
    }
    
    for(var i = 0; i < count; i++) {
        ctxs[i].fillRect( 0, 0, wid, hei );
    }
}

function init() {
    createCanvas(2);            //修改参数可以调整地图个数，参数为1或2
}

function onCreate() {
    stacks = new Array(2);
    stacks[0] = []
    stacks[1] = [];
    
    document.getElementById("btnCreateMaze").setAttribute("disabled", "disabled");

    wid = document.getElementById("maze1").offsetWidth - padding; 
    hei = 400;

    cols = eval(document.getElementById("cols").value); 
    rows = eval(document.getElementById("rows").value);

    var mazeType = document.getElementById("sltType").value;

    if(mazeType == "Maze1") {       //游戏模式是模式1
        cols = cols + 1 - cols % 2;
        rows = rows + 1 - rows % 2;    
    }

    mazes = createArray( cols, rows );
    for(var i = 0; i < 2; i++) {

        var canvas = document.getElementById("canvas" + (i + 1));
        canvas.width = wid;
        canvas.height = hei;
        s = canvas.width / (grid * cols);
        canvas.height = s * grid * rows;
        ctxs[i].scale(s, s);
    }

    if(mazeType == "Maze1") {

        start[0].x = Math.floor( Math.random() * ( cols / 2 ) );
        start[0].y = Math.floor( Math.random() * ( rows / 2 ) );
        if( !( start[0].x & 1 ) ) start[0].x++; if( !( start[0].y & 1 ) ) start[0].y++;
        
        for(var i = 0; i < 2; i++) {

            mazes[i][start[0].x][start[0].y] = 0;
        }

        if(document.getElementById("chkAnimated").checked) {

            createMaze1();
            return;
        }
        else {

            createMaze1NonAni();
            return;
        }
    }
    else {

        density = document.getElementById("density").value / 100;
        start[0].x = 0;
        start[0].y = 0;

        if(document.getElementById("chkAnimated").checked) {

            createMaze2();
            return;
        }
        else {

            createMaze2NonAni();
            return;
        }
    }
}

function onSltType() {
    if(document.getElementById("sltType").value == "Maze2") {
        document.getElementById("density").removeAttribute("disabled");
    }
    else {
        document.getElementById("density").setAttribute("disabled", "disabled");
    }
}

function onClear(mode=1) {
    
    for(var i = 0; i < 2; i++){
        for(var j = 0; j < cols; j++){
            for( var k = 0; k < rows; k++) {
                if(mazes[i][j][k] ==2 ||mazes[i][j][k] == 3 || mazes[i][j][k] == 4 || mazes[i][j][k] == 8 || mazes[i][j][k] == 9) {
                    mazes[i][j][k] = 0;
                }    
            }
        }
    }

    for(var i = 0; i < 2; i++) {
        drawMaze(i); 
    }
    for(var i = 0; i < 2; i++) {
        drawMaze(i); 
    }

    stacks = new Array(2);
    stacks[0] = []
    stacks[1] = [];

    start[0].x = start[0].y = -1;
    start[1].x = start[1].y = -1;

    end[0].x = end[0].y = -1;
    end[1].x = end[1].y = -1;

}
