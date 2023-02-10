var game = new Phaser.Game(480,320,Phaser.CANVAS,null,{
	preload: preload,
	create: create,
	update: update
});
// обьект точек повора
checkPoint=new Object();
checkPoint=({
    x:0,
    y:0,
    direction:0,
});
// обьект координат для жестов
mouseDownGest={
    x:0,
    y:0,
}
mouseUpGest={
    x:0,
    y:0,
}
let tailDirection=[];// массив напралвлений движения точек хвоста
let arrCheckPoint=[];// массив точек поворота хвоста
var size=20;// размер игровых обьектов.
var header;//голова спрайт
var direction=1;// напрвление головыы
var newDirection=1;// новое напрвлдениен движение головы
var changeDirection=false;// изменениен напрвлалеия змейки флаг
var speed=2;// скорость пермешения голвы змейки
var countSpeed=1;// счетчик скоростиигры
var wall;// стена
var arrWall;// массив стен
var newWall;// новая стена
var food;// еда
var arrFood;// массив еду
var newFood;// новая еда
var mapWidth=800;//ширина карты
var mapHeight=800;/// высота карты
var countShake=0;// счетчик для игровых событий
var countComplete=0;
var arrTail;// массив с ячейками хвоста
var newTail;// новый обьект звоста
var flagShakeCamera=false;
var flagLevelComplete=false;
var flagGesture=false;// флаг того что сейчас появляется жест
var resGest=0;// результат жеста
var flagAddEndTail=false;// флаг для добавлеия кончкиа змейки
var countAddTail=0;// счетчик добавления нового хвоста змейки
var flagNewTail=false;// флаг того что нужно создать кончик у змейки
var gameOver=false;// куонец игры
var quantityWall=700;//// количество стен
var quantityFood=125;// количество еды на карте
var leftFood=2;// количество еды, которое нужно сьесть
var live = 3;// жизни
var level=1;// уровень
var maxLevel = 10;
let pause = false;
var timeOldNewGame = 0;
var timeoutNewGame = 10000;
arrLevelWall=[100,120,120,120,120,320,480,200,200,1000];
arrLevelFood=[25,30,30,50,60,10,25,10,5,5];
arrLevelLeftFood=[10,12,1,1,15,25,30,5,8,10,5,8];
levelWidth=[640,800,800,1000,1000,640,640,1200,1600,1200];
levelHeight=[640,800,800,1000,1000,640,640,1200,1600,1200];
var countWall=0;
var countTail=0;
var ADV = {
    timerOn:false,
    time: 0,
    timeOld:0,
    maxTime: 180000,
};
var startText = {
    being:true,
    count: 0,
    maxCount:10,
    valueTriger:0,
    offsetX:[1,1,1,45],
    valueText:['3','2','1','Вперед!'],
};
var ininYsdk = false;
YaGames
    .init()
    .then(ysdk => {
        console.log('Yandex SDK initialized');
        window.ysdk = ysdk;
        initYsdk = true;
    });
function adversting()
{
    var interval=setInterval(function () {
        if (initYsdk==true)
        {
            ysdk.adv.showFullscreenAdv({
                callbacks: {
                    onClose: function () {
                        pause = false;
                        console.log('adversting close');

                    },
                    onOpen: function () {
                        pause = true;
                        console.log('adversting open');
                    },
                    onError: function () {
                        pause = false;
                        console.log('adversting Error');

                    },
                    onOffline: function () {
                        pause = false;
                    }
                },
            });
            clearInterval(interval);
        }
    },100);
}
function preload(){

    setLevelOption(level);
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
    if (localStorage.getItem('dataLevel')==null || localStorage.getItem('dataLevel')==undefined)
    {
        initWall();// создаем стены
        initFood();// создаем еду
       // saveDataLevel();
    }
    else
    {
        readDatalevel();
    }
    // создаем спрайт головы
    header=game.add.sprite((mapWidth/2)-size,Math.trunc(mapHeight/2)-size,'header');
    
    game.physics.enable(header,Phaser.Physics.ARCADE);// подключаем физику голове
    //game.camera.focusOnXY(30*20,30*20);;
    // обьевлеяем переменный для клавиатуры
    cursors = game.input.keyboard.createCursorKeys();
    game.time.slowMotion = 1;// скорость игры
    initTail((mapWidth/2)-size,(mapHeight/2)-size);// создать хвост змейке
    
    game.camera.focusOn(header);// напрвить камеру на голову змейке
   // header.x=0;
   // header.y+=-speed;
    // создание текстов
  //  saveDataLevel();
    createText();
//    liveText=game.add.text(game.camera.x+5,game.camera.y+5,"Lives: 3",{font: "14px Arial",fill:"#44ff44"});
//    endGameText=game.add.text(game.camera.x+140,game.camera.y+120,"GAME OVER",{font: "34px Arial",fill:"#0095DD"});
//    levelCompleteText=game.add.text(game.camera.x+110,game.camera.y+120,"Level Complete ",{font: "34px Arial",fill:"#0095DD"});
//    foodText=game.add.text(game.camera.x+200,game.camera.y+5,"Left to eat: "+leftFood,{font: "14px Arial",fill:"#0095DD"});
//    levelText=game.add.text(game.camera.x+5,game.camera.y+5,"Level: "+level,{font: "14px Arial",fill:"#0095DD"});
    
   // endGameText.alive=false;
    adversting();
}
function update(){
    game.time.slowMotion = 3/countSpeed;// скорость игры 
    
   
    if (ADV.timerOn==false)
    {
        ADV.timerOn = true;
        ADV.time = ADV.timeOld = new Date().getTime();
    }
    if (gameOver==false && pause==false)// если не конец игры
    {
        if (flagShakeCamera==false && flagLevelComplete==false && startText.being==false)
        {
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
            // условие смены напрления змейки
            if ((header.x)%size==0&&(header.y)%size==0
                &&newDirection!=direction /*&& changeDirection==true*/)// 
            {
                direction=newDirection;
                addCheckPoint(header.x,header.y,direction);
            }   
            if (flagNewTail==false){flagShakeCamera
                servisTail();// перемешение хвоста 
            }
            else
            {
                servisTail(true);// создаем новый хвостик к змейке 
                flagNewTail=false;
            }
        
            // столкновение со стеной
          
          
            // выход за рамки игры
            if (headerInWorld()==false) flagShakeCamera=true; //restartContinue();
       
            changeDirection=false;
            
            if (countSpeed<3)countSpeed+=0.002;
        } 
        game.physics.arcade.collide(header,arrWall,function (){
            // restartContinue();
           
                 flagShakeCamera=true;

              // console.log(countWall+"collis wall");
                 for (var i=0;i<arrWall.children.length;i++)
                 {
                   // console.log(i+""+'x='+arrWall.children[i].x+"y="+
                  //           arrWall.children[i].y); 
                 }
                 countWall++;
            
         });
         // столкновение с хвостом
        game.physics.arcade.collide(header,arrTail,function (){
            for (var i=1; i<arrTail.children.length;i++)
            {
                if ((header.x+size>arrTail.children[i].x &&
                     header.x<arrTail.children[i].x+size &&
                     header.y+size>arrTail.children[i].y &&
                     header.y<arrTail.children[i].y+size))
                {

                //    restartContinue();
                   if (flagShakeCamera==false)
                   {
                        flagShakeCamera=true;
                        console.log(countTail+"collis tail");
                        countTail++;
                        break;
                    }
                }
            }
        });
    }

   
            
    // столкновение с едой
    game.physics.arcade.collide(header,arrFood,function(header,food)  {
           
            arrFood.remove(food);// уничтожить еду
            leftFood--;// остолось сьесть меньше еды
            countSpeed=1;
            // если сьели столько сколько надо 
            console.log(leftFood);
            if (leftFood<=0)
            {
               if (level>=maxLevel)
               {
                   gameOver=true;
                   endGameText.x=game.camera.x+125;
                   endGameText.y=game.camera.y+120;
                   endGameText.setText("Вы победили!!!");



               }
               else
               {
                   flagLevelComplete=true;
               }       
        //        flagShakeCamera=false;
               // newLevel();// перейти на новый уровень

            }
            else
            {
                flagNewTail=true;   // флаг соззадания нового хвостика змейки
            }

          });
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
    if (flagLevelComplete==true)
    {
        countComplete++;
        
        if (countComplete>35) 
        {
            countComplete=0;
            flagLevelComplete=false;
            flagShakeCamera = false;
            newLevel();// перйти на новый уровень
           
        }
    }
    if (flagShakeCamera==true)
    {
        countShake++;
        if (countShake>15) 
        {
            countShake=0;

      

            flagShakeCamera=false;
            
            restartContinue();

            if (ADV.timerOn==false)
            {
                ADV.timerOn = true;
                ADV.time = ADV.timeOld = new Date().getTime();
            }
            if (ADV.timerOn==true)
            {
                ADV.time = new Date().getTime();
                console.log(ADV.time - ADV.timeOld);
            }
            if (ADV.time > ADV.timeOld + ADV.maxTime)
            {
                ADV.timeOld = new Date().getTime();
                if (live > 0) 
                {
                    adversting();
                }
            }

            if (live > 0) saveDataLevel(); else removeDataLevel();
            if (gameOver==false) startText.being = true;
        }
        
    }
    var zoomAmount=1;
    
    game.camera.scale.x= zoomAmount;
    game.camera.scale.y= zoomAmount;
    if (flagShakeCamera==true)
    {
        shakeCamera();
        
    }
    else
    {
        game.camera.focusOn(header);
    }// фокусировка на змейке
    // вывод текстов
    liveText.x=game.camera.x+5;
    liveText.y=game.camera.y+305;
    liveText.setText('Жизни: '+live);
    foodText.x=game.camera.x+340;
    foodText.y=game.camera.y+5;
    foodText.setText('Осталось съесть: '+leftFood);
    levelText.x=game.camera.x+5;
    levelText.y=game.camera.y+5;
    levelText.setText('Уровень: '+level);
    if (gameOver==true)
    {
        let timeNow=new Date().getTime();
        if (timeOldNewGame==0 /*|| timeoutNewGame==10000*/)
        {
            timeOldNewGame = new Date().getTime();
        }
        newGameText.x = game.camera.x + game.camera.width / 2-75;
        newGameText.y = game.camera.y + game.camera.height / 2 +20;
        newGameText.setText("Новая игра через: " + Math.trunc(timeoutNewGame/1000));
        
        timeoutNewGame -= timeNow - timeOldNewGame;
        if (timeoutNewGame<1000)
        {
            timeoutNewGame = 10000;
            location.reload();
        }
        timeOldNewGame = new Date().getTime();
    }
    // game.camera.width/2,game.camera.y+game.camera.height/2-100
    if (startText.being==true)
    {
        let k = startText.valueTriger;
       
        startGameText.x = game.camera.x + game.camera.width / 2 - startText.offsetX[k];
        startGameText.y = game.camera.y + game.camera.height / 2-100;
        startGameText.setText(startText.valueText[k]);
        startText.count++;
        if (startText.count>startText.maxCount)
        {
            startText.count = 0;
            startText.valueTriger++;
            if (startText.valueTriger>=startText.valueText.length)
            {
                startText.being = false;
                startText.valueTriger = 0;
                startGameText.setText('');
            }
        }
    }
    else
    {
        startGameText.x = game.camera.x -100;
        startGameText.y = game.camera.y -100;
    }
    if (gameOver==false) //спрятать текст GAME OVER
    {
        endGameText.x=game.camera.x-140;
        endGameText.y=game.camera.y-120;
        // console.log("hed der="+direction);
        // console.log("x= "+(header.x));
        // console.log("y= "+(header.y));
     //    console.log(countSpeed);
    }
    if (flagLevelComplete==true) 
    {
       levelCompleteText.x=game.camera.x+100;
       levelCompleteText.y=game.camera.y+120;
    }
    else
    {
        levelCompleteText.x=game.camera.x-140;
        levelCompleteText.y=game.camera.y-120;
    }
   
     
}
function shakeCamera()
{
        if(header.x<480/2&&header.y<320/2)
        {
            game.camera.focusOnXY(480/2-10+randomInteger(0,20),
                                  320/2-10+randomInteger(0,20));
            console.log ('111');
        }
        else if(header.x<480/2&&header.y>mapHeight-320/2)
        {
            game.camera.focusOnXY(480/2-10+randomInteger(0,20),
                                  mapHeight-320/2-10+randomInteger(0,20));
            console.log ('222');
        }
        else if(header.x>mapWidth-480/2&&header.y<320/2)
        {
            game.camera.focusOnXY(mapWidth-480/2-10+randomInteger(0,20),
                                  320/2-10+randomInteger(0,20));
            console.log ('333');
        }
        else if(header.x>mapWidth-480/2&&header.y>mapHeight-320/2)
        {
            game.camera.focusOnXY(mapWidth-480/2-10+randomInteger(0,20),
                                  mapHeight-320/2-10+randomInteger(0,20));
            console.log ('444');
        }   
        else 
        {
            game.camera.focusOnXY(header.x+size/2-10+randomInteger(0,20),
                             header.y+size/2-10+randomInteger(0,20));
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
        endGameText.x=game.camera.x+120;
        endGameText.y=game.camera.y+120;
        gameOver=true;
    }
    else
    { 
        header.x=mapWidth/2-size;
        header.y=mapHeight/2-size;
        direction=1;
        newDirection=1;
        deleteTail();
        initTail(mapWidth/2-size,mapHeight/2-size);
        destroyCreateText();
    }
}
function setLevelOption(lvl)
{
    mapWidth=levelWidth[lvl-1];
    mapHeight=levelHeight[lvl-1];
    quantityWall= arrLevelWall[lvl-1];
    //quantityWall
    quantityFood=arrLevelFood[lvl-1];
    leftFood=arrLevelLeftFood[lvl-1];
}
// новый уровень
function newLevel(){
    //header.destroy();
    level++;
    setLevelOption(level);
    game.world.setBounds(0,0,mapWidth,mapHeight);
    header.x=mapWidth/2-size;
    header.y=mapHeight/2-size;
    deleteWall();
    deleteFood();
    
    live++;
    
    //mapWidth=levelWidth[level-1];
    //mapHeight=levelHeight[level-1];
    
    
    //leftFood=2;
    
    initWall();
    initFood(); 
    //header=game.add.sprite((mapWidth/2)-size,(mapHeight/2)-size,'header');
    game.physics.enable(header,Phaser.Physics.ARCADE);// подключаем физику голове
    restartContinue(false);
    destroyCreateText();
    if (level<maxLevel)
    {   
        saveDataLevel();
    }
    
}
function removeDataLevel()
{
    localStorage.removeItem('dataLevel');
}
function saveDataLevel()
{
    let dataWall = [];
    let dataFood = [];
    for (let i = 0; i < arrWall.length;i++)
    {
        dataWall.push({x: arrWall.children[i].x, y: arrWall.children[i].y});
    }
    for (let i = 0; i < arrFood.length;i++)
    {
        dataFood.push({x: arrFood.children[i].x, y: arrFood.children[i].y});
    }
    localStorage.setItem('dataLevel',JSON.stringify({arrWall:dataWall,arrFood:dataFood,live:live,level:level,leftFood:leftFood}));
   // console.log(dataWall);
   // console.log(dataFood);
    //readDatalevel();
}
function readDatalevel()
{
    let data=localStorage.getItem('dataLevel');
    data = JSON.parse(data);
    console.log(data);
    if (Array.isArray(data.arrWall)==true)
    {
        arrWall=game.add.group();
        for (let i = 0; i < data.arrWall.length;i++)
        {
            newWall=game.add.sprite(data.arrWall[i].x,data.arrWall[i].y,'wall');
            game.physics.enable(newWall, Phaser.Physics.ARCADE);
            newWall.body.immovable=true;
            arrWall.add(newWall);
        }
    }
    if (Array.isArray(data.arrFood)==true)
    {
        arrFood=game.add.group();
        for (let i = 0; i < data.arrFood.length;i++)
        {
            newFood=game.add.sprite(data.arrFood[i].x,data.arrFood[i].y,'food');
            game.physics.enable(newFood,Phaser.Physics.ARCADE);
            newFood.body.immovable=true;
            arrFood.add(newFood);
        }
    }
    if (typeof(data.live)=='number')
    {
        live = data.live;
    }
    if (typeof(data.level)=='number')
    {
        level = data.level;
    }
    if (typeof(data.leftFood)=='number')
    {
        leftFood = data.leftFood;
    }
}
function destroyCreateText()
{
    liveText.destroy();
    startGameText.destroy();
    endGameText.destroy();
    levelCompleteText.destroy();
    foodText.destroy();
    levelText.destroy();
    newGameText.destroy();
    createText();
}
function createText()
{
    liveText=game.add.text(game.camera.x+5,game.camera.y+5,"Lives: 3",{font: "14px Arial",fill:"#44ff44"});
    endGameText=game.add.text(game.camera.x+120,game.camera.y+120,"Вы проиграли!",{font: "34px Arial",fill:"#ff5555"});
    levelCompleteText=game.add.text(game.camera.x+90,game.camera.y+120,"Уровень пройден ",{font: "34px Arial",fill:"#0095DD"});
    foodText=game.add.text(game.camera.x+200,game.camera.y+5,"Left to eat: "+leftFood,{font: "14px Arial",fill:"#0095DD"});
    levelText=game.add.text(game.camera.x+5,game.camera.y+5,"Level: "+level,{font: "14px Arial",fill:"#0095DD"});    
    startGameText=game.add.text(game.camera.x+game.camera.width/2,game.camera.y+game.camera.height/2-100,""+level,{font: "34px Arial",fill:"#0095DD"});    
    newGameText=game.add.text(game.camera.x-game.camera.width/2,game.camera.y-game.camera.height/2-100,
                "Новая игра через: "+10,{font: "18px Arial",fill:"#0095DD"}); 
}
// инициализация стен
function initWall()
{
 	arrWall=game.add.group();			
	for (i=0;i<quantityWall;i++){
            // если стены не там где змейка
            do {
                var wallX=randomInteger(0,mapWidth/size)*size;
                var wallY=randomInteger(0,mapHeight/size)*size;	
            }while(wallX>mapWidth/2-size*3 && wallX<mapWidth/2+size*3 &&
                    wallY>mapHeight/2-size*5 && wallY<mapHeight/2+size*5)
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
            var tailY=y+(i+1)*size;
            newTail=game.add.sprite(tailX,tailY,'tail');
            game.physics.enable(newTail,Phaser.Physics.ARCADE);
            newTail.body.immovable=true;
           // newWall.anchor.set(0.5);
            arrTail.add(newTail);			
        }
}
function checkWallXY(x,y)
{
    for (var i=0;i<arrWall.children.length;i++)
    {
          if (x>=arrWall.children[i].x && x<=arrWall.children[i].x+size &&
              y>=arrWall.children[i].y && y<=arrWall.children[i].y+size )
      {
          return true;
      }
    }
    return false;
}
// инициализация еды
function initFood(){
    	arrFood=game.add.group();			
	for (i=0;i<quantityFood;i++){   
            var flag=false;
            var foodX;
            var foodY;
            do{
                foodX=randomInteger(0,mapWidth/size)*size;
                foodY=randomInteger(0,mapHeight/size)*size;	
                flag=false;
                for (var j=0;j<arrWall.children.length;j++)
                {
                    if (foodX==arrWall.children[j].x&&
                        foodY==arrWall.children[j].y)
                    {
                        flag=true;
                        break;
                    }
                }
                for (var j=0;j<arrFood.children.length;j++)
                {
                    if (foodX==arrFood.children[j].x&&
                        foodY==arrFood.children[j].y)
                    {
                        flag=true;
                        break;
                    }
                }
                if (foodX>mapWidth/2-size*3 && foodX<mapWidth/2+size*3 &&
                    foodY>mapHeight/2-size*5 && foodY<mapHeight/2+size*5)
                {
                    flag=true;
                }
            
                var count=0;
                if (checkWallXY(foodX,foodY-size)) count++;
                if (checkWallXY(foodX+size,foodY)) count++;
                if (checkWallXY(foodX,foodY+size)) count++;
                if (checkWallXY(foodX-size,foodY)) count++;
            
              //  console.log(foodX);
               /// console.log(foodY);
            }while(flag==true||count>=3);
            newFood=game.add.sprite(foodX,foodY,'food');
            game.physics.enable(newFood,Phaser.Physics.ARCADE);
            newFood.body.immovable=true;
           // newWall.anchor.set(0.5);
            arrFood.add(newFood);			
        }
        console.log(arrFood.children.length);
}
// добавить точку повратахвоста змейки
function addCheckPoint(xx,yy,dir)
{
    arrCheckPoint.unshift(checkPoint/*randomInteger(0,12)*/)
    arrCheckPoint[0]={
        x:xx,
        y:yy,
        direction:dir,
    };
    // console.log(arrCheckPoint);
}
// движение хвостиков змейки по вектору
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
// функци отвечает за движение хвоста и появлеие новых хвостиков в конце
function servisTail(newTail=false){
    if(flagAddEndTail==true)// если появляется новых хвостик
    {
        countAddTail++;// счетчику добавления новой точки хвоста ++
    }
    for (var i=0;i<arrTail.children.length;i++)// цикл по точкам хвоста
    {
        if(flagAddEndTail==true)// если появяется новый хвост
        {
            if (i!=arrTail.children.length-1)// если это не последния точка хвоста,которая появлеятся
            {    
               tailMoveDirection(i);// движение точек хвоста по вектору 
            }
            if (i==arrTail.children.length-1)// если это та точка которая появляется
            {
              //если прошло столько времени, которое необходимо что бы
              // змейка пропалза вперед растояние одной точки
                if (countAddTail>=size/2) 
                {
                    flagAddEndTail=false;// флагу поевлияния хвоста ложь. теперь новый хыост начинает двигаться
                    countAddTail=0;
                }
            }
        }else// если флаг появления нового хвоса ложь
        {
            tailMoveDirection(i);
        }
        
    }
    // цикл для обработки поворотов хвостов змейки
    for (var i=0;i<arrTail.children.length;i++)// цикл по хвостам
    {
        for (j=0;j<arrCheckPoint.length;j++)// уикл по точкам поворота
        {
            // если координаты тчки хвоста равны координатам точки поворота
            if (arrTail.children[i].x==arrCheckPoint[j].x&&
                arrTail.children[i].y==arrCheckPoint[j].y )
            {
              // точке хвоста присвоить новые значиние точки поворота
              tailDirection[i]=arrCheckPoint[j].direction;
              if (i==arrTail.children.length-1)//если это последния точка хвоста
              {
                  arrCheckPoint.pop();// удалить то тчку поворота
              }
            }
        }
    }
    // условие добавлеия нового хвоста змейке
    if (newTail==true&&flagAddEndTail==false)
    {
        flagAddEndTail=true;
        var len=arrTail.children.length-1;
        addTail(arrTail.children[len].x,arrTail.children[len].y,
                tailDirection[len]);
       // console.log(tailDirection);
    }
  
}
// добавить обьект в массив хвоста змейки
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
   return (header.x<0||header.x+size>mapWidth||header.y<0||header.y+size>mapHeight)==false;
}
function gestureMouse()
{
    //var canvas = document.getElementById('canvas');
    //let canvas1 = document.querySelectorAll('canvas');
  //  var canvas1=document.body.appendChild(canvas);
//    document.documentElement.onclick=function(event){
//        level++;
//    }
    if (flagGesture==false)
    {
      //  if (game.input.activePointer.leftButton.isDown)
       // canvas1.mousedown= function(event)  {
       if (game.input.pointer1.isDown)//  если палец касается экрана телефона
        {
                //соххраняем координаты 
                mouseDownGest.x=game.input.x;
                mouseDownGest.y=game.input.y;
                flagGesture=true;
            
        }
    }
    if(flagGesture==true )
    {   
        
        //canvas1.mouseup=function(event)  
     //   if (game.input.activePointer.leftButton.isUp)
        if (game.input.pointer1.isUp)// если палец перестал касаться экрана телефона
        {
                // сохранем координаты
                mouseUpGest.x=game.input.x;
                mouseUpGest.y=game.input.y;
                flagGesture=false;
                // расчитываем номер повората по двум координтам
                var dx=Math.abs(mouseDownGest.x-mouseUpGest.x);
                var dy=Math.abs(mouseDownGest.y-mouseUpGest.y);
                if (mouseDownGest.y>mouseUpGest.y && dy>dx) resGest=1;
                if (mouseDownGest.x<mouseUpGest.x && dx>dy) resGest=2;
                if (mouseDownGest.y<mouseUpGest.y && dy>dx) resGest=3;
                if (mouseDownGest.x>mouseUpGest.x && dx>dy) resGest=4;
                //console.log("down "+event.clientX+' '+event.clientY);
//                console.log(resGest);
//                console.log(mouseDownGest);
//                console.log(mouseUpGest);
                
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
//   console.log('del heck ppint');
//   console.log(arrCheckPoint);
//   console.log(checkPoint);
   var len=arrTail.children.length-1;
   for (var i=len;i>=0;i-=1){
       arrTail.remove(arrTail.children[i]);
    }
 }
 // удалить стены
function deleteWall(){
   var len=arrWall.children.length-1;
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
