let EVENTS = (function(){
    return{
        dailyTriggers: [
           
        ],
        hourlyTriggers: [
            {
                //Mayor Pay Bills Event Trigger
                name:'MayorPayBuildings',
                method:function(){
                    
                    Buildings.forEach(building => {

                        if(building.type != 'house'){
                            console.log('Before Cost:', GameScope.mayorsMoney )
                            GameScope.mayorsMoney += building.rent;
                            console.log('After Cost:', GameScope.mayorsMoney )
                        }
                        
                    });
                    
                }
            },
  
        ],
        minTrigger:[
          
        ],
        secTrigger:[
            {
                //Mission Trigger and Output
                name:'MissonTriggers',
                method:function(){
                    let Keys = Object.keys(MISSIONS);

                    let htmlOutput = ``;

                    Keys.forEach(item => {


                        let missionGroup = MISSIONS[item][MISSIONS[item].length-1].name;
                        let missionGroupDescription = MISSIONS[item][MISSIONS[item].length-1].description;
                        let missionGroupCompleted = MISSIONS[item][MISSIONS[item].length-1].completed
                        let missionGroupIndex = MISSIONS[item].length-1;

                        if(missionGroupCompleted != true){

                            htmlOutput += `<div id="${missionGroup}" >
                            <h5 style="color:${(missionGroupCompleted ? 'green':'red')}">${missionGroupDescription}</h5>`;

                            MISSIONS[item].forEach((mission,index) => {
                                mission.method();
                                //
                                if(missionGroupIndex != index){

                                    htmlOutput += `<span style="color:${(mission.completed == true)? 'green': 'red'};">${mission.description}</span>`;

                                }

                                if(GameScope.player.levelProgress >= 100){
                                    GameScope.player.level += 1;
                                    GameScope.player.levelProgress -= 100;
                                }
                            });

                            htmlOutput += `</div>`


                        }
                 
                        

                        
                    });


                    let htmlDOM = document.createElement('div')
                    htmlDOM.setAttribute('id','MissionOutput');

                    htmlDOM.innerHTML = htmlOutput;
                    document.getElementById('gameDetail-panes').innerHTML = "";
                    document.getElementById('gameDetail-panes').appendChild(htmlDOM);
                }
            },
            {
                //Production Stat Refresher
                name:'refreshProductionStats',
                method:function(){
                    GameScope.setupProductionStats();
                }
            },
            {
                //Production Stat Refresher
                name:'refreshPlayerStats',
                method:function(){
                    GameScope.setupPlayerStats();
                }
            },
        ]
    }
})();    