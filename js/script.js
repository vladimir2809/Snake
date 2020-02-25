var game = new Phaser.Game(480,320,Phaser.CANVAS,null,{
	preload: preload,
	create: create,
	update: update
});
var header;//голова спрайт
var direction=1;// напрвление головыы
var wall;// стена
var arrWall;// массив стен
var newWall;// новая стена
var food;// еда
var arrFood;// массив еду
var newFood;// новая еда
var mapWidth=800;//ширина карты
var mapHeight=800;/// высота карты
var leftFood=10;// количество еды, которое нужно сьесть
var quantityWall=80;//// количество стен
var quantityFood=25;// количество еды на карте
var count=0;// счетчик для плавного управления змейкой
var countSpeed=20;
var arrTail;// массив с ячейками хвоста
var newTail;// новый обьект звоста
var flagNewTail=false;// флаг того что нужно создать кончик у змейки
var changeDirection=false;// изменениен напрвлалеия змейки флаг
var live=3;// жизни
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
    game.physics.startSystem(Phaser.Physics.ARCADE); 
    initWall();// создаем стены
    initFood();// создаем еду
    // создаем спрайт головы
    header=game.add.sprite((mapWidth/2)-20,(mapHeight/2)-20,'header');
    
    game.physics.enable(header,Phaser.Physics.ARCADE);// подключаем физику голове
    //game.camera.focusOnXY(30*20,30*20);;
    // обьевлеяем переменный для клавиатуры
    cursors = game.input.keyboard.createCursorKeys();
    game.time.slowMotion = 1/8;// скорость игры
    initTail((mapWidth/2)-20,(mapHeight/2)-20);// создать хвост змейке
    
    game.camera.focusOn(header);// напрвить камеру на голову змейке
    // создание текстов
    liveText=game.add.text(game.camera.x+5,game.camera.y+5,"Lives: 3",{font: "14px Arial",fill:"#44ff44"});
    endGameText=game.add.text(game.camera.x+140,game.camera.y+120,"GAME OVER",{font: "34px Arial",fill:"#0095DD"});
    foodText=game.add.text(game.camera.x+200,game.camera.y+5,"Left to eat: "+leftFood,{font: "14px Arial",fill:"#0095DD"});
    levelText=game.add.text(game.camera.x+5,game.camera.y+5,"Level: "+level,{font: "14px Arial",fill:"#0095DD"});
   // endGameText.alive=false;
}
function update(){
    var speed=20;// скорость пермешения голвы змейки
    if (count>countSpeed)// если пришло время сделать ход змейке
    {
        // столкновение со стеной
        game.physics.arcade.collide(header,arrWall,function (){
            restartContinue();
        });
        // столкновение с хвостом
        game.physics.arcade.collide(header,arrTail,function (){
            restartContinue();
        });
        // выход за рамки игры
        if (headerInWorld()==true) restartContinue(); 
        if (gameOver==false)// если не конец игры
        {
            if (flagNewTail==false){
                servisTail();// перемешение хвоста 
            }
            else{
                servisTail(true);// создаем новый хвостик к змейке 
                flagNewTail=false;
            }
        
            // движение по направлению
            if (direction==1)
            {
               header.y+=-speed; 
            }
            if (direction==2)
            {
              header.x+=speed;  
            }
            if (direction==3)
            {
               header.y+=speed; 
            }
            if (direction==4)
            {
               header.x+=-speed;  
            }
        }
      
        
        // столкновение с едой
        game.physics.arcade.collide(header,arrFood,function(header,food)  {    
           arrFood.remove(food);// уничтожить еду
           leftFood--;// остолось сьесть меньше еды
           countSpeed=20;
           // если сьели столько сколько надо 
           if (leftFood<=0){
               newLevel();// перейти на новый уровень
           
           }else
           {
               flagNewTail=true;   // флаг соззадания нового хвостика змейки
           }
        });
        changeDirection=false;//флагу измениния движения ложь 
        if (countSpeed>4.1)countSpeed-=0.2;
        count=0;
    }
    else
    {
     if (gameOver==false) count++;// если не конец игры то считать счетчик
    }
    if (changeDirection==false)// если флаг измение движения ложь
    {
        // измение напрвлавлеия движения змейки
        if (cursors.up.isDown&&direction!=3)
        {
            direction=1;
            changeDirection=true;
        }
        if (cursors.right.isDown&&direction!=4)
        {
            direction=2;
            changeDirection=true;
        }
        if (cursors.down.isDown&&direction!=1)
        {
            direction=3;
            changeDirection=true;
        }
        if (cursors.left.isDown&&direction!=2)
        {
            direction=4;
            changeDirection=true;
        }
    }
        
    
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
    }
 //  console.log(game.camera.scale.x);
  // console.log(game.camera.scale.y);
     
}
// рестарт на уровне когда вроезались
function restartContinue(unarLives=true){
    if (unarLives==true){
        live--;
    }
    countSpeed=20;
    if (live<=0)
    {
        endGameText.x=game.camera.x+140;
        endGameText.y=game.camera.y+120;
       // endGameText.alive=true;
        header.kill();
        gameOver=true;
    }
    else
    {
        
        header.x=mapWidth/2-20;
        header.y=mapHeight/2-20;
        direction=1;
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
// функци отвечает за движение хвоста
function servisTail(newTail=false){
    if (newTail==true) addTail(1,1);
    for (var i=arrTail.children.length-1;i>=0;i--){
        if(i==0){
            arrTail.children[i].x=header.x;
            arrTail.children[i].y=header.y;
        }else{
            arrTail.children[i].x=arrTail.children[i-1].x;
            arrTail.children[i].y=arrTail.children[i-1].y;
        }
       console.log(i);
    }
}
// добавить обьект в массив звоста змейки
function addTail(x,y){
    var tailX=x;
    var tailY=y;
    newTail=game.add.sprite(tailX,tailY,'tail');
    game.physics.enable(newTail,Phaser.Physics.ARCADE);
    newTail.body.immovable=true;
    arrTail.add(newTail);
}
// проверить не вышла ли змейка за границу карты
function headerInWorld(){
   return header.x<0||header.x>=mapWidth||header.y<0||header.y>=mapHeight;
}
// удалить весь звост змейки
function deleteTail(){
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
