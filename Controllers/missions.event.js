let MISSIONS = (function(){
    return{
        gettingStarted:[{
            name:'BuildMode',
            description:'Enable Build Mode',
            method:()=>{
                if(GameScope.player.level >= 1 && GameScope.buildMode == true &&  MISSIONS.gettingStarted[0].completed == false){
                    GameScope.player.levelProgress +=50;
                    MISSIONS.gettingStarted[0].completed = true;
                }
            },
            completed:false,
        },
        {
            name:'firstPower',
            description:'Build you first Power Plant',
            method:()=>{

                Buildings.forEach(item => {

                    if(item.type == 'power'){
                        
                        if(GameScope.player.level >= 1  &&  MISSIONS.gettingStarted[1].completed == false){
                            GameScope.player.levelProgress +=25;
                            MISSIONS.gettingStarted[1].completed = true;
                        }

                    }
                
                });

              
            },
            completed:false,
        },
        {
            name:'firstWater',
            description:'Build your first Water Plant',
            method:()=>{

                Buildings.forEach(item => {

                    if(item.type == 'water'){
                        
                        if(GameScope.player.level >= 1 &&  MISSIONS.gettingStarted[2].completed == false){
                            GameScope.player.levelProgress +=25;
                            MISSIONS.gettingStarted[2].completed = true;
                        }

                    }
                
                });

              
            },
            completed:false,
        },
        {
            name:'firstWaste',
            description:'Build your first Waste Plant',
            method:()=>{

                Buildings.forEach(item => {

                    if(item.type == 'waste'){
                        
                        if(GameScope.player.level >= 1 &&  MISSIONS.gettingStarted[3].completed == false){
                            GameScope.player.levelProgress +=25;
                            MISSIONS.gettingStarted[3].completed = true;
                        }

                    }
                
                });

              
            },
            completed:false,
        },
        {
            name:'gettingStarted',
            description:'Getting Started',
            method:()=>{
                if(MISSIONS.gettingStarted[4].completed == false){
                    if(MISSIONS.gettingStarted[0].completed && MISSIONS.gettingStarted[1].completed  && MISSIONS.gettingStarted[2].completed && MISSIONS.gettingStarted[3].completed) {
                        //REWARD
                            
                         GameScope.mayorsMoney += 5000;
                    GameScope.player.materialModulesEarned += 6;
                    GameScope.player.materialModules += 6;
                         MISSIONS.gettingStarted[4].completed = true;
                    }
                }
              
            },
            completed:false,
        }
        ],
        BuildACommunity:[{
            name:'Houses',
            description:'Build 5 Houses',
            method:()=>{

                let Houses = 0;

                Buildings.forEach(item => {

                        if(item.type == 'housing'){
                            Houses++;
                        }
                    
                });

                if(Houses >= 5 && GameScope.player.level >= 2 &&  MISSIONS.BuildACommunity[0].completed == false){
                    GameScope.player.levelProgress +=37.5;
                    MISSIONS.BuildACommunity[0].completed = true;
                }

            },
            completed:false,
        },
        {
            name:'Business',
            description:'Build 5 Businesses',
            method:()=>{

                let Buinesses = 0;

                Buildings.forEach(item => {
                        if(item.type == 'business'){
                            Buinesses++;
                        }
                });

                if(Buinesses >= 5 && GameScope.player.level >= 2 &&  MISSIONS.BuildACommunity[1].completed == false){
                    GameScope.player.levelProgress +=37.5;
                    MISSIONS.BuildACommunity[1].completed = true;
                }

            },
            completed:false,
        },
        {
            name:'BuildACommunity',
            description:'Build a Community',
            method:()=>{

                if( MISSIONS.BuildACommunity[0].completed &&  MISSIONS.BuildACommunity[1].completed && GameScope.player.level >= 2 && MISSIONS.BuildACommunity[2].completed == false){
                    //REWARD
                    GameScope.mayorsMoney += 25000;
                    GameScope.player.materialModulesEarned += 6;
                    GameScope.player.materialModules += 6;
                    MISSIONS.BuildACommunity[2].completed = true;
                }

            },
            completed:false,
        }
        ],
        ProductionIsKey:[{
            name:'sustain72kW',
            description:'Sustain 72 kW',
            method:()=>{

                if(GameScope.player.level >= 3 && GameScope.player.resources.production.power >= 72 && MISSIONS.ProductionIsKey[0].completed == false){
                    GameScope.player.levelProgress +=40;
                    MISSIONS.ProductionIsKey[0].completed = true
                }
               
            },
            completed:false,
        },
        {
            name:'sustain72gal',
            description:'Sustain 72 Gal.',
            method:()=>{

                if(GameScope.player.level >= 3 && GameScope.player.resources.production.water >= 72 && MISSIONS.ProductionIsKey[1].completed == false){
                    GameScope.player.levelProgress +=40;
                    
                    MISSIONS.ProductionIsKey[1].completed = true;
                }
               
            },
            completed:false,
        },
        {
            name:'sustain72lbs',
            description:'Sustain 72 Lbs.',
            method:()=>{

                if(GameScope.player.level >= 3 && GameScope.player.resources.production.waste >= 72 && MISSIONS.ProductionIsKey[2].completed == false){
                    GameScope.player.levelProgress +=40;
                    
                    MISSIONS.ProductionIsKey[2].completed = true;
                }
               
            },
            completed:false,
        },
        {
            name:'ProductionIsKey',
            description:'Production is Key',
            method:()=>{

                if(MISSIONS.ProductionIsKey[0].completed && MISSIONS.ProductionIsKey[1].completed && MISSIONS.ProductionIsKey[2].completed && MISSIONS.ProductionIsKey[3].completed == false ){
                    //Reward   
                    GameScope.mayorsMoney += 12000;
                    GameScope.player.materialModulesEarned += 6;
                    GameScope.player.materialModules += 6;
                    MISSIONS.ProductionIsKey[3].completed = true;
                }
               
            },
            completed:false,
        }
        ],
        CollectWhenDue:[{
            name:'earn1000000',
            description:'Earn 100000CT this Hour',
            method:()=>{
                let afterBase = GameScope.mayorsMoney - 150000;
                if(GameScope.player.level >= 4 &&  afterBase >= 100000 && MISSIONS.CollectWhenDue[0].completed == false){
                    GameScope.player.levelProgress +=40;
                    MISSIONS.CollectWhenDue[0].completed = true
                }
               
            },
            completed:false,
        },
        {
            name:'earn18Modules',
            description:'Earn 18 Material Modules',
            method:()=>{
                let afterBase = GameScope.player.materialModulesEarned - 3;
                if(GameScope.player.level >= 4 && afterBase >= 18 && MISSIONS.CollectWhenDue[1].completed == false){
                    GameScope.player.levelProgress +=40;
                    MISSIONS.CollectWhenDue[1].completed = true
                }
            },
            completed:false,
        },
        {
            name:'CollectWhenDue',
            description:'Collect When Due',
            method:()=>{
                if(GameScope.player.level >= 4 &&  MISSIONS.CollectWhenDue[0].completed &&  MISSIONS.CollectWhenDue[1].completed &&  MISSIONS.CollectWhenDue[2].completed == false ){
                    GameScope.mayorsMoney += 100000;
                    GameScope.player.materialModules += 6;
                    GameScope.player.materialModulesEarned += 6;
                    MISSIONS.CollectWhenDue[2].completed = true;


                    let CongratsHTML = `<img src="./Assets/Images/ThumbsUp.gif" style="width: 450px;border-radius: 10px;margin: auto;display: inherit;position: relative;top: -120px;margin-bottom: -105px;"/>
                    <h1 style="padding: 0;margin: 0;margin-top: -20px;text-transform: uppercase;color: #faa25a;">Congrats!</h1>
                    <p>You have completed all available missions. You may now purchase Materials Modules. You can purchase Material Modules by clicking the Material Module icon below Clock!</p>`;
                    GameScope.initModal(CongratsHTML);

                }
            },
            completed:false,
        },
        ]
    }
})();
