var game = new Phaser.Game(480,320,Phaser.CANVAS,null,{
	preload: preload,
	create: create,
	update: update
});
checkPoint=new Object();
checkPoint=({
    x:0,
    y:0,
    direction:0,
});
mouseDownGest={
    x:0,
    y:0,
}
mouseUpGest={
    x:0,
    y:0,
}
let tailDirection=[];
let arrCheckPoint=[];
var header;//голова спрайт
var direction=1;// напрвление головыы
var newDirection=1;
var changeDirection=false;// изменениен напрвлалеия змейки флаг
var speed=2;// скорость пермешения голвы змейки
var countSpeed=1;
var wall;// стена
var arrWall;// массив стен
var newWall;// новая стена
var food;// еда
var arrFood;// массив еду
var newFood;// новая еда
var mapWidth=800;//ширина карты
var mapHeight=800;/// высота карты
var leftFood=10;// количество еды, которое нужно сьесть
var quantityWall=20;//// количество стен
var quantityFood=25;// количество еды на карте
var count=0;// счетчик для плавного управления змейкой

var arrTail;// массив с ячейками хвоста
var newTail;// новый обьект звоста
var flagGesture=false;
var resGest=0;
var flagAddEndTail=false;// флаг для добавлеия кончкиа змейки
var countAddTail=0;
var flagNewTail=false;// флаг того что нужно создать кончик у змейки
var live=1;// жизни
var gameOver=false;// куонец игры
var level=1;// уровень
function preload(){
    game.world.setBounds(0,0,mapWidth,mapHeight);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally= true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor="#eee";
    game.load.image("header",'img/header.png');
    game.load.image("wall",'img/wall.png');
    game.load.image("tail",'img/tail.png');
    game.load.image("food",'img/food.png');
}
function create(){
   // arrWall.delete();
//    for (var i=0;i<3;i++)
//    {
//        tailDirection.push(1);
//    }
   // var canvas = document.getElementById('canvas');
   // canvas.addEventListener('mousemove', mouseMove, false);
   // canvas.addEventListener('mousedown', mouseDown, false);
    game.physics.startSystem(Phaser.Physics.ARCADE); 
    initWall();// создаем стены
    initFood();// создаем еду
    // создаем спрайт головы
    header=game.add.sprite((mapWidth/2)-20,Math.trunc(mapHeight/2)-20,'header');
    
    game.physics.enable(header,Phaser.Physics.ARCADE);// подключаем физику голове
    //game.camera.focusOnXY(30*20,30*20);;
    // обьевлеяем переменный для клавиатуры
    cursors = game.input.keyboard.createCursorKeys();
    game.time.slowMotion = 1;// скорость игры
    initTail((mapWidth/2)-20,(mapHeight/2)-20);// создать хвост змейке
    
    game.camera.focusOn(header);// напрвить камеру на голову змейке
   // header.x=0;
   // header.y+=-speed;
    // создание текстов
    liveText=game.add.text(game.camera.x+5,game.camera.y+5,"Lives: 3",{font: "14px Arial",fill:"#44ff44"});
    endGameText=game.add.text(game.camera.x+140,game.camera.y+120,"GAME OVER",{font: "34px Arial",fill:"#0095DD"});
    foodText=game.add.text(game.camera.x+200,game.camera.y+5,"Left to eat: "+leftFood,{font: "14px Arial",fill:"#0095DD"});
    levelText=game.add.text(game.camera.x+5,game.camera.y+5,"Level: "+level,{font: "14px Arial",fill:"#0095DD"});
   // endGameText.alive=false;
}
function update(){
    game.time.slowMotion = 3/countSpeed;// скорость игры
    // столкновение со стеной
    game.physics.arcade.collide(header,arrWall,function (){
        restartContinue();
    });
    // столкновение с хвостом
    game.physics.arcade.collide(header,arrTail,function (){
        
        if ((header.x+20>arrTail.children[0].x&&
             header.x<arrTail.children[0].x+20&&
             header.y+20>arrTail.children[0].y&&
             header.y<arrTail.children[0].y+20)==false)
        {
            restartContinue();
        }
    });
     
  
    if ((header.x)%20==0&&(header.y)%20==0
            &&newDirection!=direction /*&& changeDirection==true*/)// 
    {
        direction=newDirection;
          //        newDirection
        addCheckPoint(header.x,header.y,direction);
        console.log("'kmjkfkkfremferkl");
       // changeDirection=false;
        //changeDirection// изменениен напрвлалеия змейки флаг
    }
    {
        
        
        if (gameOver==false)// если не конец игры
        {
            if (flagNewTail==false){
               servisTail();// перемешение хвоста 
            }
            else{
                servisTail(true);// создаем новый хвостик к змейке 
                flagNewTail=false;
            }
            // выход за рамки игры
            if (headerInWorld()==false) restartContinue();
            changeDirection=false;
            // движение по направлению
            if (direction==1)
            {
              //header.x=0;
              header.y+=-speed; 
              
            //  header.body.velocity.x=0;
            //   header.body.velocity.y=-speed;
            }
            if (direction==2)
            {
              header.x+=speed;  
              //header.y=0;
            ////  header.body.velocity.set(speed,0);
            }
            if (direction==3)
            {
                header.y+=speed; 
                //header.x=0;
            //    header.body.velocity.set(0,speed);
            }
            if (direction==4)
            {
              header.x+=-speed;  
              //header.y=0;
            //   header.body.velocity.set(-speed,0);
            }
        }
      
        
        // столкновение с едой
        game.physics.arcade.collide(header,arrFood,function(header,food)  {    
           arrFood.remove(food);// уничтожить еду
           leftFood--;// остолось сьесть меньше еды
           countSpeed=1;
           // если сьели столько сколько надо 
           if (leftFood<=0){
               newLevel();// перейти на новый уровень
           
           }else
           {
               flagNewTail=true;   // флаг соззадания нового хвостика змейки
           }
        });
       // changeDirection=false;//флагу измениния движения ложь 
        if (countSpeed<3)countSpeed+=0.002;
        count=0;
    }
//    else
//    {
//     if (gameOver==false) count++;// если не конец игры то считать счетчик
//    }
   gestMouse=gestureMouse();
    if (changeDirection==false)// если флаг измение движения ложь
    {
        // измение напрвлавлеия движения змейки
        if ((cursors.up.isDown||gestMouse==1)&&direction!=3)
        {
            newDirection=1;
            changeDirection=true;
        }
        if ((cursors.right.isDown||gestMouse==2)&&direction!=4)
        {
            newDirection=2;
            changeDirection=true;
        }
        if ((cursors.down.isDown||gestMouse==3)&&direction!=1)
        {
            newDirection=3;
            changeDirection=true;
        }
        if ((cursors.left.isDown||gestMouse==4)&&direction!=2)
        {
            newDirection=4;
            changeDirection=true;
        }
    }
        
    console.log("Left Button: " + game.input.activePointer.leftButton.isUp, 300, 132);
    var zoomAmount=1;
    game.camera.focusOn(header);// фокусировка на змейке
    game.camera.scale.x= zoomAmount;
    game.camera.scale.y= zoomAmount;
    // вывод текстов
    liveText.x=game.camera.x+5;
    liveText.y=game.camera.y+305;
    liveText.setText('Lives: '+live);
    foodText.x=game.camera.x+380;
    foodText.y=game.camera.y+5;
    foodText.setText('Left to eat: '+leftFood);
    levelText.x=game.camera.x+5;
    levelText.y=game.camera.y+5;
    levelText.setText('Level: '+level);
    if (gameOver==false) //спрятать текст GAME OVER
    {
        endGameText.x=game.camera.x-140;
        endGameText.y=game.camera.y-120;
        console.log("hed der="+direction);
       // console.log("x= "+(header.x));
       //// console.log("y= "+(header.y));
   //    console.log(countSpeed);
    }
   
     
}
// рестарт на уровне когда вроезались
function restartContinue(unarLives=true){
    if (unarLives==true){
        live--;
    }
    countSpeed=1;
    if (live<=0)
    {
        endGameText.x=game.camera.x+140;
        endGameText.y=game.camera.y+120;
       // endGameText.alive=true;
        //header.kill();
        gameOver=true;
    }
    else
    {
        
        header.x=mapWidth/2-20;
        header.y=mapHeight/2-20;
        direction=1;
        newDirection=1;
        deleteTail();
        initTail(mapWidth/2-20,mapHeight/2-20);
        
    }
}
// новый уровень
function newLevel(){
    deleteWall();
    deleteFood();
    //deleteTail();
    level++;
    live++;
    leftFood=10;
    initWall();
    initFood();
    header.destroy();
    header=game.add.sprite((mapWidth/2)-20,(mapHeight/2)-20,'header');
    game.physics.enable(header,Phaser.Physics.ARCADE);// подключаем физику голове
    restartContinue(false);
    liveText.destroy();
    endGameText.destroy();
    foodText.destroy();
    levelText.destroy();
    liveText=game.add.text(game.camera.x+5,game.camera.y+5,"Lives: 3",{font: "14px Arial",fill:"#44ff44"});
    endGameText=game.add.text(game.camera.x+140,game.camera.y+120,"GAME OVER",{font: "34px Arial",fill:"#0095DD"});
    foodText=game.add.text(game.camera.x+200,game.camera.y+5,"Left to eat: "+leftFood,{font: "14px Arial",fill:"#0095DD"});
    levelText=game.add.text(game.camera.x+5,game.camera.y+5,"Level: "+level,{font: "14px Arial",fill:"#0095DD"});
    
}
// инициализация стен
function initWall(){
    	arrWall=game.add.group();			
	for (i=0;i<quantityWall;i++){
            // еслм стены не там где змейка
            do {
            
                var wallX=randomInteger(0,mapWidth/20)*20;
                var wallY=randomInteger(0,mapHeight/20)*20;	
            
            }while(wallX>mapWidth/2-20*3 && wallX<mapWidth/2+20*3 &&
                    wallY>mapHeight/2-20*5 && wallY<mapHeight/2+20*5)
            newWall=game.add.sprite(wallX,wallY,'wall');
            game.physics.enable(newWall,Phaser.Physics.ARCADE);
            newWall.body.immovable=true;
           // newWall.anchor.set(0.5);
            arrWall.add(newWall);			
        }
}
// инициализировать хвост змейке
function initTail(x,y){
    	arrTail=game.add.group();			
	for (i=0;i<3;i++){
            tailDirection.push(1);
            var tailX=x;
            var tailY=y+(i+1)*20;
            newTail=game.add.sprite(tailX,tailY,'tail');
            game.physics.enable(newTail,Phaser.Physics.ARCADE);
            newTail.body.immovable=true;
           // newWall.anchor.set(0.5);
            arrTail.add(newTail);			
        }
}
// инициализация еды
function initFood(){
    	arrFood=game.add.group();			
	for (i=0;i<quantityFood;i++){   
            var flag=false;
            var foodX;
            var foodY;
            do{
                foodX=randomInteger(0,mapWidth/20)*20;
                foodY=randomInteger(0,mapHeight/20)*20;	
                flag=false;
                for (var j=0;j<arrWall.children.length;j++)
                {
                    if (foodX==arrWall.children[j].x&&
                        foodY==arrWall.children[j].y)
                    {
                        flag=true;
                    }
                }
              //  console.log(foodX);
               /// console.log(foodY);
            }while(flag==true);
            newFood=game.add.sprite(foodX,foodY,'food');
            game.physics.enable(newFood,Phaser.Physics.ARCADE);
            newFood.body.immovable=true;
           // newWall.anchor.set(0.5);
            arrFood.add(newFood);			
        }
}
function addCheckPoint(xx,yy,dir)
{
    arrCheckPoint.unshift(checkPoint/*randomInteger(0,12)*/)
    arrCheckPoint[0]={
        x:xx,
        y:yy,
        direction:dir,
    };
     console.log(arrCheckPoint);
}
function tailMoveDirection(i)
{
        if (tailDirection[i]==1) 
        {
             arrTail.children[i].y+=-speed;
        }
        if (tailDirection[i]==2) 
        {
             arrTail.children[i].x+=speed;
             
        }
        if (tailDirection[i]==3) 
        {
             arrTail.children[i].y+=speed;
        }
        if (tailDirection[i]==4) 
        {
             arrTail.children[i].x+=-speed;
        }
   
}
// функци отвечает за движение хвоста
function servisTail(newTail=false){
    if(flagAddEndTail==true)
    {
        countAddTail++;
    }
    for (var i=0;i<arrTail.children.length;i++)
    {
        if(flagAddEndTail==true)
        {
            //countAddTail++;
            if (i!=arrTail.children.length-1)
            {    
               tailMoveDirection(i);
            }
            if (i==arrTail.children.length-1)
            {
//                if ((arrTail.children[i].x+20>arrTail.children[i-1].x&&
//                    arrTail.children[i].x<arrTail.children[i-1].x+20&&
//                    arrTail.children[i].y+20>arrTail.children[i-1].y&&
//                    arrTail.children[i].y<arrTail.children[i-1].y+20)==false)
                if (countAddTail>=10)
                {
                    flagAddEndTail=false;
                    countAddTail=0;
                }
            }
        }else
        {
            tailMoveDirection(i);
        }
        
    }
    
    for (var i=0;i<arrTail.children.length;i++)
    {
        for (j=0;j<arrCheckPoint.length;j++)
        {
            if (arrTail.children[i].x==arrCheckPoint[j].x&&
                arrTail.children[i].y==arrCheckPoint[j].y )
            {
              tailDirection[i]=arrCheckPoint[j].direction;
              if (i==arrTail.children.length-1)
              {
                  arrCheckPoint.pop();
              }
            }
        }
    }
    if (newTail==true&&flagAddEndTail==false)
    {
        flagAddEndTail=true;
        var len=arrTail.children.length-1;
        addTail(arrTail.children[len].x,arrTail.children[len].y,
                tailDirection[len]);
       // console.log(tailDirection);
    }
  
}
//function servisTail(newTail=false){
//    if (newTail==true) addTail(1,1);
//    for (var i=arrTail.children.length-1;i>=0;i--){
//        if(i==0){
//            arrTail.children[i].x=header.x;
//            arrTail.children[i].y=header.y;
//        }else{
//            arrTail.children[i].x=arrTail.children[i-1].x;
//            arrTail.children[i].y=arrTail.children[i-1].y;
//        }
//     //  console.log(i);
//    }
//}
// добавить обьект в массив звоста змейки
function addTail(x,y,dir){
    var tailX=x;
    var tailY=y;
    tailDirection.push(dir);
    newTail=game.add.sprite(tailX,tailY,'tail');
    game.physics.enable(newTail,Phaser.Physics.ARCADE);
    newTail.body.immovable=true;
    arrTail.add(newTail);
}
// проверить не вышла ли змейка за границу карты
function headerInWorld(){
   return (header.x<0||header.x+20>mapWidth||header.y<0||header.y+20>mapHeight)==false;
}
function gestureMouse()
{
    //var canvas = document.getElementById('canvas');
    //let canvas1 = document.querySelectorAll('canvas');
  //  var canvas1=document.body.appendChild(canvas);
    document.documentElement.onclick=function(event){
        level++;
    }
    if (flagGesture==false)
    {
      //  if (game.input.activePointer.leftButton.isDown)
       // canvas1.mousedown= function(event)  {
       if (game.input.pointer1.isDown)
        {
                mouseDownGest.x=game.input.x;
                mouseDownGest.y=game.input.y;
                //mouseDownGest.y=event.clientY;
                //console.log(event.clientX+' '+event.clientY);
                flagGesture=true;
            
        }
    }
    if(flagGesture==true )
    {   
        
        //canvas1.mouseup=function(event)  
     //   if (game.input.activePointer.leftButton.isUp)
        if (game.input.pointer1.isUp)
        {

                mouseUpGest.x=game.input.x;
                mouseUpGest.y=game.input.y;
                flagGesture=false;
                var dx=Math.abs(mouseDownGest.x-mouseUpGest.x);
                var dy=Math.abs(mouseDownGest.y-mouseUpGest.y);
                if (mouseDownGest.y>mouseUpGest.y && dy>dx) resGest=1;
                if (mouseDownGest.x<mouseUpGest.x && dx>dy) resGest=2;
                if (mouseDownGest.y<mouseUpGest.y && dy>dx) resGest=3;
                if (mouseDownGest.x>mouseUpGest.x && dx>dy) resGest=4;
                //console.log("down "+event.clientX+' '+event.clientY);
                console.log(resGest);
                console.log(mouseDownGest);
                console.log(mouseUpGest);
                
        }
        return resGest;
    }
}
   

// удалить весь звост змейки
function deleteTail(){
    len=tailDirection.length;
   for (var i=0;i<len;i++)
   {
       tailDirection.pop();
   }   
   len=arrCheckPoint.length;
   for (var i=0;i<len;i++)
   {
       arrCheckPoint.pop();
   }
   console.log('del heck ppint');
   console.log(arrCheckPoint);
   console.log(checkPoint);
   var len=arrTail.children.length;
   for (var i=len;i>=0;i-=1){
       arrTail.remove(arrTail.children[i]);
    }
 }
 // удалить стены
function deleteWall(){
   var len=arrWall.children.length;
   for (var i=len;i>=0;i-=1){
       arrWall.remove(arrWall.children[i]);
    }
}
// удалить еду
function deleteFood(){
   var len=arrFood.children.length;
   for (var i=len;i>=0;i-=1){
       arrFood.remove(arrFood.children[i]);
    }
}
   
//функция получения случайного числа от мин да макс
function randomInteger(min, max) {
  // получить случайное число от (min-0.5) до (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
