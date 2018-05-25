let GameScope;

class Game{
    constructor(settings){
        this.gameGrid = []; //Object example: {x,y,obj(Defualt=Null)}
        this.canvasId = settings.canvasId;
        this.buildMode = false;
        this.selectedBuilding = null;
        this.worldClock = {d:0,h:0,m:0,s:0};
        this.globalClock = 0;
        this.mayorsMoney = 150000;
        this.GameMusicPlaying = false;
        this.gameMusic = [
            {song:new Audio("Assets/Music/ES_Her Favourite Dress 1 - Jan Chmelar.mp3")},
            {song:new Audio("Assets/Music/ES_Second Toe To The Left 4 - Peter Sandberg.mp3")},
            {song:new Audio("Assets/Music/ES_Just Chillin 3 - Marc Torch.mp3")}
        ]
        this.player = {
            level: 1,
            levelProgress:0,
            materialModules:3,
            materialModulesEarned:3,
            resources:{
                production:{ 
                    power:0,
                    water:0,
                    waste:0,
                },
                consumption:{ 
                    power:0,
                    water:0,
                    waste:0,
                }
            }
        }
        this.buildingCosts = {
            housing:5000,
            business:15000,
            power:5000,
            water:5000,
            waste:5000,
        }
        this.moduleCosts = {
            housing:0,
            business:0,
            power:1,
            water:1,
            waste:1,
        }
    }
    addTile(xAxis,yAxis, id = null){
            this.gameGrid.push({x:xAxis,y:yAxis,id});
    }
    setupGrid(){
        
        this.grid = new Grid(this.canvasId,38);
        this.grid.canvas.width = window.innerWidth;
        this.grid.canvas.height = window.innerHeight-4;

        let tileSizeX =  window.innerWidth/73;
        let tileSizeY = window.innerHeight/85;
 
        this.grid.drawHexGrid(tileSizeY, tileSizeX, 25, 160, false);

    }
    setupWorldClock(){

        //Setup WorldClock
        let MainClock = setInterval(()=>{

            this.globalClock++;
            this.worldClock.s++;
           
            this.eventTrigger('sec');

            if(this.GameMusicPlaying){
                this.musicPlayer(0)
            }
           // this.reDraw();
            if(this.worldClock.s == 60){
                this.worldClock.m++;
                this.worldClock.s = 0;

                this.eventTrigger('min');
            }

            if(this.worldClock.m == 60){
                this.worldClock.h++;
                this.worldClock.m = 0;

              //  if((this.worldClock.h % 2) == 0){
                   this.initBuildingEvent();
               // }

                this.eventTrigger('hourly');


            }

            if(this.worldClock.h == 12){

                this.endGame()
                clearInterval(MainClock)
                // this.worldClock.d++;
                this.worldClock.h= 0;
            }
        
        },17);

    }
    setupTimer(){
        setTimeout(()=>{
            this.endGame();        
        },3600000)
    }
    postAjax(url, data, success) {
        var params = typeof data == 'string' ? data : Object.keys(data).map(
                function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
            ).join('&');
    
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
        };
        // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);

        //USAGE: postAjax('URL', 'p1=1&p2=Hello+World', function(data){ console.log(data); });
        return xhr;
    }
    getAjax(url, success) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('GET', url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState>3 && xhr.status==200) success(xhr.responseText);
        };
        // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send();

        //USAGE: getAjax('URL', function(data){ console.log(data); });
        return xhr;
    }
    endGame(){

        //Run end game functions, save score to database, and present scoreboard.≠

        let GameStats = {
            level: (this.level == 5) ? 10000 : 0,
            Credit: (Math.floor(this.mayorsMoney) / 15000) * 1023,
            Module: Math.floor(this.player.materialModules) * 1026,
            House: 0,
            Business:0,
            Production:0,
            total:0
        }

        Buildings.forEach(item=>{


            if(this.type == 'housing'){
                GameStats.House += 1000*Math.floor(item.level);
            }else if(this.type == 'business'){
                GameStats.Business += 2200*Math.floor(item.level);
            }else{
                GameStats.Production += 2500*Math.floor(item.level);
            }


        })

        GameStats.total = Math.floor(GameStats.level)+Math.floor(GameStats.Credit)+Math.floor(GameStats.Module)+Math.floor(GameStats.Business)+Math.floor(GameStats.Production);
        
        let message = `<img src="./Assets/Images/Grats.gif" style="width: 350px;height: 290px;border-radius: 10px;margin: auto;display: inherit;position: relative;top: -120px;margin-bottom: -105px;"/>
        <h1 style="margin-bottom: -10px;">${GameStats.total} POINTS</h1>
        <p style="font-size: 19px;">Gratz!!! You scored a wopping <strong>${GameStats.total}</strong> Points! Enter your initials below to show off your mad skillz! After entering your initials press Submit Score to see your ranking on the High Scoreboard.</p>
        `;



        let inputWrapper = document.createElement('p');
        inputWrapper.setAttribute('style','text-align:center;')

        let firstName = document.createElement('input');
        firstName.setAttribute('type','text')
        firstName.setAttribute('name','f')

        let lastName = document.createElement('input');
        lastName.setAttribute('type','text')
        lastName.setAttribute('name','l')

        let middleName = document.createElement('input');
        middleName.setAttribute('type','text')
        middleName.setAttribute('name','m')

        inputWrapper.appendChild(firstName)
        inputWrapper.appendChild(middleName)
        inputWrapper.appendChild(lastName)

        let parent = document.getElementsByTagName('body')[0];
        let modalDOM = document.createElement('div');

        modalDOM.setAttribute('id','modal-wrapper');

        let modaleInner = document.createElement('div')

        modaleInner.setAttribute('id','modal-inner')
        modaleInner.innerHTML = message;

        modaleInner.appendChild(inputWrapper);

        let modalButton = document.createElement('button');
        modalButton.setAttribute('id','ModalButton')
        modalButton.innerText = "SUBMIT SCORE";
        modalButton.style.left = "35.2%";
        modaleInner.appendChild(modalButton);

     
        modalDOM.appendChild(modaleInner);
       
        modalButton.onclick = ()=>{

            if(firstName.value != "" && lastName.value != "" && middleName.value != ""){

                this.postAjax('https://seanzamora.com/wp-json/OpenWorld/v1/GameScore', 'gs='+GameStats.total+'&f='+firstName.value+'&m='+middleName.value+'&l='+lastName.value+'&bo='+JSON.stringify(Buildings)+'&gsC='+JSON.stringify(GameScope), function(data){ 
                    

                    if(data){
                        data = JSON.parse(data);   console.log(  data.gs,'-',data.f,'-',data.m,'-',data.l); 

                        GameScope.getAjax('https://seanzamora.com/wp-json/OpenWorld/v1/GameScore', function(res){

                            res = JSON.parse(res)
                            message = `<img src="./Assets/Images/Grats.gif" style="width: 350px;height: 290px;border-radius: 10px;margin: auto;display: inherit;position: relative;top: -120px;margin-bottom: -105px;"/>`;
                            message += '<div id="highScoreWrapper" style="">';
                            message += '<div id="highScoreWrapperInner" style="">';
                            res.forEach(item=>{


                                message += `<div><span class="initials">${item.FirstName+item.MiddleName+item.LastName}</span><span>SCORE:<strong>${item.gameScore}</strong></span></div>`;

                            })

                            message +='</div>';
                            message +='</div>';

                            modaleInner.innerHTML = message;

                        })

                    }else{
                        alert('Woops! somthing went wrong, please try submitting score again.')
                    }

                })

                // modalDOM.style.opacity = 0;
    
                // setInterval(()=>{
                //     modalDOM.remove();
                //   }, 3000)

            }else{
                alert("All initial fields are required.")
            }

       
        }


        parent.prepend(modalDOM);
        
    }   
    eventTrigger(type){
        if(type == 'min'){

            EVENTS.minTrigger.forEach(item=>{
                item.method();
            })

        }else if(type == 'sec'){
            EVENTS.secTrigger.forEach(item=>{
                item.method();
            })
        }else if(type == 'hourly'){
            EVENTS.hourlyTriggers.forEach(item=>{
                item.method();
            })
        }
       
       
    }
    setupControllers(){

        let builderControls = `<ul data-type="business">
                                    <li class="bld-action" data-level="1"><img src="./Assets/Images/icons/business.png"/><span>-${this.buildingCosts.business}CT</span></li>
                                </ul>
                                <ul data-type="housing">
                                    <li class="bld-action" data-level="1"><img src="./Assets/Images/icons/house.png"/><span>-${this.buildingCosts.housing}CT</span></li>
                                </ul>
                                <ul data-type="power">
                                    <li class="bld-action" data-level="1"><img src="./Assets/Images/icons/power.png"/><span>-${this.buildingCosts.power}CT<br></span><span style="left:-45px;"><img src="./Assets/Images/icons/MaterialModuleBlk.png" width="13" style="position:relative;top:-1px;display:inline-block;"> -1</span></li>
                                </ul>
                                <ul data-type="waste">
                                    <li class="bld-action" data-level="1"><img src="./Assets/Images/icons/waste.png"/><span>-${this.buildingCosts.waste}CT<br></span><span style="left:-45px;"><img src="./Assets/Images/icons/MaterialModuleBlk.png" width="13" style="position:relative;top:-1px;display:inline-block;"> -1</span></li>
                                </ul>
                                <ul data-type="water">
                                    <li class="bld-action" data-level="1"><img src="./Assets/Images/icons/water.png"/><span>-${this.buildingCosts.water}CT<br></span><span style="left:-70px;"><img src="./Assets/Images/icons/MaterialModuleBlk.png" width="13" style="position:relative;top:-1px;display:inline-block;"> -1</span></li>
                                </ul>`;


            let parent = document.getElementById('gameBuildings-actions');
            let builderControlsDOM = document.createElement('div');

            builderControlsDOM.setAttribute('id','builderControls');
            builderControlsDOM.innerHTML = builderControls;
            parent.prepend(builderControlsDOM);

            let buildingActions = document.getElementsByClassName('bld-action');
        
            for(let x=0; x < buildingActions.length; x++){

                let actionElement = buildingActions[x];

                actionElement.onclick = e=>{

                    for(let x=0; x < buildingActions.length; x++){
                        let actionElementClear = buildingActions[x];
                        actionElementClear.setAttribute('data-active', 'false');
                    }

                    let selType = actionElement.parentElement.getAttribute('data-type');
                    let selLevel = actionElement.getAttribute('data-level');

                        if(this.buildMode && (this.mayorsMoney < this.buildingCosts[selType]) != true){
                            this.selectedBuilding = {type:selType,level:selLevel};
                            actionElement.setAttribute('data-active', 'true');
                        }
                        if(!this.buildMode){
                            GameScope.initMessage("Build mode is not enabled, please enable to build.")
                            console.log('Please Enable Build Mode.')
                        }
                        if(this.mayorsMoney < this.buildingCosts[selType] ){ 
                            console.log('NOPE: No Money')
                            GameScope.initMessage("Insufficient Credits.")
                        }
                    
                }
                
            }

            //Set BuildMode Button.
            let buildModeButton = document.getElementById('buildModeToggle');

            //Setup BuildMode Button Toggle
            buildModeButton.onclick = ()=>{
                var span = buildModeButton.getElementsByTagName('span')[0]
                if(span.getAttribute('class') == 'off'){
                        span.setAttribute('class','on');
                        span.innerHTML = "ENABLED";
                        this.buildMode = true;
                }else{
                        span.setAttribute('class','off');
                        span.innerHTML = "DISABLED";
                        this.buildMode = false;
                }
            }
            

    }
    buildingActions(building){
        let buildingID = building.id;

        let parent = document.getElementById('buildingActions');
        let buildingActionDOM = document.createElement('div');

        let buildingActionHTML = `<div id="baHeader">
                                        <div>
                                            <span>${building.type}</span></span>
                                            <span>${building.name}</span>
                                            <span>Level: ${building.level}</span>
                                        </div>
                                        <div>
                                            <img src="${building.icon}">
                                            <span>Cost: ${building.cost}CT<span>
                                        </div>
                                    </div>
                                    <div id="baStats">
                                            <div> 
                                                <strong>Consumption</strong>
                                                <span>Power: <span>${building.consumption.power}</span></span>
                                                <span>Water: <span>${building.consumption.water}</span></span>
                                                <span>Waste: <span>${building.consumption.waste}</span></span>
                                            </div>
                                            <div  style="display:${(building.production != undefined)?'inline-flex':'none'};">
                                                <strong>Production</strong>
                                                <span style="text-transform:capitalize">${building.type}: <span>${building.production}</span></span>
                                            </div>
                                    </div>
                                    <div id="baActions">
                                        <a data-action="upgrade" data-id="${building.id}" href="#">Upgrade<span>-${(building.cost)*(building.level+(1))}CT</span></a>
                                        <!--a data-action="remove" data-id="${building.id}" href="#">Bulldoze<span>+${(building.cost)*(0.40)}CT</span></a-->
                                    </div>`;

        buildingActionDOM.setAttribute('id','builderAction-inner');
        buildingActionDOM.setAttribute('class','inner');

        buildingActionDOM.innerHTML = buildingActionHTML;
        parent.innerHTML = "";

        let actions = buildingActionDOM.getElementsByTagName('a')

        //Setup Building Actions
        for (var i = 0; i < actions.length; i++) {

            let actionAttr = actions[i].getAttribute('data-action')

            if( actionAttr == 'upgrade'){

                actions[i].onclick = ()=>{

                    building.upgrade();
                    parent.innerHTML = "";
                    console.log(building.name,' upgrade init.')
               
                }

            }else if(actionAttr == 'remove'){

                actions[i].onclick = ()=>{

                    DELETE.Building(building.id);

                    //TODO: Create Canvas Rerender Method to display updated grid without deleted building.

                    parent.innerHTML = "";
     
                    console.log(building.name,' remove init.')
                    
                }

            }
        }

         parent.prepend(buildingActionDOM);

    }
    setupPlayerStats(){

        let parent = document.getElementById('header');
        let playerStateDOM = document.createElement('div');
            playerStateDOM.setAttribute('id','playerState-inner');
     
        let playerStatsHTML = `<div id="gameTime">
                                    <span style="opacity:0;"><span id="timeDay">${this.worldClock.d}</span>D</span>
                                    <span><span id="timeHour">${this.worldClock.h}</span>H</span>
                                    <span><span id="timeSec">${this.worldClock.m}</span>M</span>
                                    <span style="font-size:15px;font-size:15px;display: block;text-align: right;"><img src="./Assets/Images/icons/MaterialModule.png" width="20" style="position:relative;top:4px;">&nbsp;&nbsp;${this.player.materialModules}</span>
                                    ${(GameScope.player.level >= 5)? '<span style="font-size:15px;font-size:15px;display: block;text-align: right;"><button id="buyMM" onclick="GameScope.buyMaterialModule()">BUY | 15000CT</button></span>':''}
                                    <br>
                                </div>
                                <div id="lvlProgress"><span>${this.player.levelProgress}%</span></div>
                                <div id="BankContainer">
                                    <div>
                                        <strong>BANK</strong>
                                        <span>${this.mayorsMoney}CT</span>
                                        
                                    </div>
                                    <div>Lv <span>${this.player.level}</span></div>
                                </div>`;
        
        playerStateDOM.innerHTML = playerStatsHTML;
        parent.innerHTML = "";
        parent.prepend(playerStateDOM);

    }
    setupProductionStats(){

        let parent = document.getElementById('production-wrapper');
        let productionStatsDOM = document.createElement('div');

        productionStatsDOM.setAttribute('id','production-inner');
   
        let powerConsumption = (isNaN(this.player.resources.consumption.power / this.player.resources.production.power)) ? 0 : this.player.resources.consumption.power / this.player.resources.production.power;
        let waterConsumption = (isNaN(this.player.resources.consumption.water / this.player.resources.production.water)) ? 0 : this.player.resources.consumption.water / this.player.resources.production.water;
        let wasteConsumption = (isNaN(this.player.resources.consumption.waste / this.player.resources.production.waste)) ? 0 : this.player.resources.consumption.waste / this.player.resources.production.waste;

        let productionStatsHTML = `
        <div><span id="power-usage" style="width:${parseFloat(powerConsumption).toFixed(2).replace('.','')}%">&nbsp;&nbsp;&nbsp;&nbsp;POWER</span>  <span>${this.player.resources.consumption.power} / ${this.player.resources.production.power}  kW<span></div>  
        <div><span id="water-usage" style="width:${parseFloat(waterConsumption).toFixed(2).replace('.','')}%">&nbsp;&nbsp;&nbsp;&nbsp;WATER</span>  <span>${this.player.resources.consumption.water} / ${this.player.resources.production.water} GAL.<span></div>  
        <div><span id="waste-usage" style="width:${parseFloat(wasteConsumption).toFixed(2).replace('.','')}%">&nbsp;&nbsp;&nbsp;&nbsp;WASTE</span>  <span>${this.player.resources.consumption.waste} / ${this.player.resources.production.waste} LBS.<span></div>`;
        
        productionStatsDOM.innerHTML = productionStatsHTML;
        parent.innerHTML = "";
        parent.prepend(productionStatsDOM);

    }
    initMessage(message){

        let parent = document.getElementsByTagName('body')[0];
        let messageDOM = document.createElement('div');
        messageDOM.setAttribute('id','message-wrapper');
     
        let messageHTML = `<div id="message-inner">
                                        <p>${message}</p>
                                </div>`;
        
        messageDOM.innerHTML = messageHTML;
       
        parent.prepend(messageDOM);

        setInterval(()=>{
           messageDOM.style.opacity = 0;
        }, 2000)
        setInterval(()=>{
            messageDOM.remove();
         }, 4000)
    }

    initModal(message){

        let parent = document.getElementsByTagName('body')[0];
        let modalDOM = document.createElement('div');

        modalDOM.setAttribute('id','modal-wrapper');

        let modaleInner = document.createElement('div')

        modaleInner.setAttribute('id','modal-inner')
        modaleInner.innerHTML = message;

        let modalButton = document.createElement('button');
        modalButton.setAttribute('id','ModalButton')
        modalButton.innerText = "Close";
        modaleInner.appendChild(modalButton);

     
        modalDOM.appendChild(modaleInner);
       
        modalButton.onclick = ()=>{

           GameScope.musicPlayer(0);

            modalDOM.style.opacity = 0;

            setInterval(()=>{
                modalDOM.remove();
              }, 3000)
        }


        parent.prepend(modalDOM);

    }


    reDraw(){

        let tileSizeX =  window.innerWidth/73;
        let tileSizeY = window.innerHeight/85;

        this.grid.context.clearRect(0,0, this.grid.canvas.width,this.grid.canvas.height)

        this.grid.drawHexGrid(tileSizeY, tileSizeX, 25, 160, false, true);

        let gameGrid =  this.gameGrid;

        gameGrid.forEach((tile,index)=>{

            if(tile.id != null){

                let building = GET.Building(tile.id)

                let tileIcon = new Image();   // Create new img element
                tileIcon.src = building.icon; // Set source path
        
                tileIcon.onload = ()=>{
                    this.grid.context.drawImage(tileIcon, tile.x+1, tile.y - 6, 75,65);
                }
    
            }

        });
       
    }
    initBuildingEvent(){

        Buildings.forEach((item, index)=>{

            if(item.type == 'housing' || item.type == 'business'){

                this.mayorsMoney += item.cost;

            }

        })
    }

    buyMaterialModule(){

        if(this.mayorsMoney >= 15000){
            this.mayorsMoney -= 15000;
            this.player.materialModules += 1;
        }
    }
    musicPlayer(song){
        var audioType;

       
        
        if(song == 3){
            GameScope.musicPlayer(0);
        }else if(hasEnded){
            GameScope.musicPlayer(song+1);
        }else if(song == 0){

            var Song = GameScope.gameMusic[song].song;
            var hasEnded = Song.ended;
            var currentTime = Song.currentTime;
            var duration = Song.duration;

            Song.play();
            Song.volume = .15;
            Song.play();

            GameScope.GameMusicPlaying = true;

        } else if(currentTime == 0){

            var Song = GameScope.gameMusic[song].song;
            var hasEnded = Song.ended;
            var currentTime = Song.currentTime;
            var duration = Song.duration;

            Song.play();
            Song.volume = .15;
            Song.play();

            GameScope.GameMusicPlaying = true;
           
        }

    }
}

GameScope = new Game({canvasId:'OpenWorld'});

GameScope.setupGrid();
GameScope.reDraw();
GameScope.setupWorldClock();
GameScope.setupControllers();
GameScope.setupPlayerStats()
GameScope.setupProductionStats();

let CongratsHTML = `<img src="./Assets/Images/welcome.gif" style="width: 450px;border-radius: 10px;margin: auto;display: inherit;position: relative;top: -120px;margin-bottom: -105px;"/>
<p style="">Welcome to OpenWorld, a Resource Management Strategy Game. You have 12 in game hours which equals to 12 mins IRL to get the highest score. A few things to note, all 
production buildings (<img src="./Assets/Images/icons/power.png" width="20" style="position:relative;top:5px;"/>, <img src="./Assets/Images/icons/water.png" width="20"/>, 
and <img src="./Assets/Images/icons/wasteBlk.png" width="20"/>) cost 1 Material Module (<img src="./Assets/Images/icons/MaterialModuleBlk.png" width="20" style="position:relative;top:3px;"/>) 
so use them wisely. It is highly recommended to complete all missions, as they will reward you with the nessassary items for success. Better close this windows your timer has already started. :)</p>`;
GameScope.initModal(CongratsHTML);
