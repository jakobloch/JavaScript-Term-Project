var canvas = document.querySelector("#pong");
var context = canvas.getContext("2d");

// create user paddle
var user = {
    x: 0,
    y: canvas.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "#00ff41",
    score: 0
}

//create cpu paddle
var cpu = {
    x: canvas.width - 10,
    y: canvas.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "#00ff41",
    score: 0
}

// create pongBall
var pongBall = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 12,
    speed: 6,
    velocityX: 6,
    velocityY: 6,
    color: "#00ff41"
}


// draw rectangle function

function drawRect(x, y, w, h, color){
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}
drawRect(0, 0, canvas.width, canvas.height, "black");

// create net
var  net = {
    x: canvas.width/2 - 1,
    y: 0,
    width: 4,
    height: 12,
    color: "#00ff41"
}

// draw net
function drawNet(){
    for(var i = 0; i <= canvas.height; i+=20){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw circle
function drawCircle(x, y, r, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}
drawCircle(pongBall.x, pongBall.y, pongBall.r, pongBall.color);


// draw text
function drawText(text, x, y, color){
    context.fillStyle = color;
    context.font = "50px sans";
    context.fillText(text, x, y);
}

//render the game
function render(){
    drawRect(0, 0, canvas.width, canvas.height, "black");

    drawNet();

    drawText(user.score, canvas.width/4, canvas.height/5, "#00ff41");
    drawText(cpu.score, 3*canvas.width/4, canvas.height/5, "#00ff41");
    
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color);

    drawCircle(pongBall.x, pongBall.y, pongBall.radius, pongBall.color);
}

// control users paddle
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt){
    var rect = canvas.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height/2;
}



// collision detection
function collision(b, p){
    p.top = p.y; 
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return b.right > p.left && b.bottom >  p.top && b.left < p.right && b.top < p.bottom;
}

// reset pongBall
function resetpongBall(){
    pongBall.x = canvas.width/2;
    pongBall.y = canvas.height/2;

    pongBall.speed = 5;
    pongBall.velocityX = -pongBall.velocityX;
}

// update
function update(){
    pongBall.x += pongBall.velocityX;
    pongBall.y += pongBall.velocityY; 

// simple ai for cpu paddle
    var cpuputerLevel = 0.1;
    cpu.y += (pongBall.y - (cpu.y + cpu.height/2)) * cpuputerLevel;
// 
    if(pongBall.y + pongBall.radius > canvas.height || pongBall.y - pongBall.radius < 0){
        pongBall.velocityY =- pongBall.velocityY;
    }

    var player = (pongBall.x < canvas.width/2)? user: cpu;
    
    if(collision(pongBall, player)){
        // to tell where pongBall collided
        var collidePoint = pongBall.y - (player.y + player.height/2);
        collidePoint = collidePoint/(player.height/2);
        // calculating 45 degree angle
        var angleRad = collidePoint * Math.PI/4;
        // change direction when contact paddle
        var direction = (pongBall.x < canvas.width/2)? 1:-1

        pongBall.velocityX = direction * pongBall.speed * Math.cos(angleRad);
        pongBall.velocityY = direction * pongBall.speed * Math.sin(angleRad);
        // pongBall speed increase with each hit
        pongBall.speed += 1;
    }
    if(pongBall.x - pongBall.radius < 0){
        cpu.score++
        resetpongBall();
    }
    else if(pongBall.x + pongBall.radius > canvas.width){
        user.score++
        resetpongBall();
    }
}

// game init
function game(){
    update();
    render();
}

// loop
var fps = 50;
setInterval(game, 1000/fps);