let Buildings = [];

class Building {

    constructor(settings){

        this.id = settings.id || CREATE.rand(); 
        this.type = settings.type;
        this.name = settings.name;
        this.capacity = settings.capacity;
        this.cost = settings.cost || null;
        this.rent = settings.rent || 1000;
        this.module_cost = settings.module_cost || 0;
        this.cost_term = settings.cost_term || null; 
        this.coords = settings.coords || null;
        this.production = settings.production || null;
        this.level = settings.level || 1;
        this.consumption = {
            power: settings.consumption.power || 0,
            water: settings.consumption.water || 0,
            waste: settings.consumption.waste || 0,
        }
        this.icon = settings.icon;
    };

    makePayment(object){
        object.bank -= this.cost;
    };
    
    addToBusinessExpenses(object){
        object.expenses += this.cost;
    };

    isRuning(){
        return true;
    }

    upgrade(){
        if(GameScope.mayorsMoney >= (this.cost*(this.level)) ){

            let Consumption = {
                power: this.consumption.power*(this.level+1),
                water: this.consumption.water*(this.level+1),
                waste: this.consumption.waste*(this.level+1),
            }

            if(GET.hasResources(Consumption)){

                if(this.module_cost != undefined){

                 
               
                    if(GameScope.player.materialModules >= Math.floor(this.module_cost)*(Math.floor(this.level)+1)){

                        GameScope.player.materialModules -= Math.floor(this.module_cost)*(Math.floor(this.level)+1);
                    
                    }else{

                        GameScope.initMessage('Insufficient Material Modules, unable to upgrade');

                        return false;

                    }
                
                }

                   

                GameScope.player.resources.consumption.power -= this.consumption.power;
                GameScope.player.resources.consumption.water -= this.consumption.water;
                GameScope.player.resources.consumption.waste -= this.consumption.waste;

                this.level++;
                this.capacity = 3*(this.level );
    
                if(this.production != undefined){
                    this.production = 18*(this.level ); //TODO: Have to use realistic numbers
                }
    
                this.cost = 1500*(this.level );
                this.consumption = {
                    power: Consumption.power,
                    water: Consumption.water,
                    waste: Consumption.waste,
                }
    
                GameScope.player.resources.consumption.power += this.consumption.power;
                GameScope.player.resources.consumption.water += this.consumption.water;
                GameScope.player.resources.consumption.waste += this.consumption.waste;
    
                if(this.production != undefined){
                    GameScope.player.resources.production[this.type] += this.production;
                }
    
                let upgradeCost = (this.cost)*(this.level);
        
                GameScope.mayorsMoney -= upgradeCost;

            }else{

                GameScope.initMessage('Insufficient resources, unable to upgrade');
                console.log('Not Enough Resources to Upgrade');

            }

        }else{

            GameScope.initMessage('Insufficient credits, unable to upgrade');
            
            console.log('Not Enough Credits to Upgrade');
        }
       
        
    }

};



GET.Building = function(id){
    return Buildings.filter( item=> item.id == id )[0];
}

GET.hasResources = function(Consumption){

    let PowerProduction = GameScope.player.resources.production.power - GameScope.player.resources.consumption.power;
    let WaterProduction = GameScope.player.resources.production.water - GameScope.player.resources.consumption.water;
    let WasteProduction = GameScope.player.resources.production.waste - GameScope.player.resources.consumption.waste;

    let efficientPower = (PowerProduction >= Consumption.power ) ? true : false;
    let efficientWater = (WaterProduction >= Consumption.water ) ? true : false;
    let efficientWaste = (WasteProduction >= Consumption.waste ) ? true : false;

    if(efficientPower && efficientWater && efficientWaste ){
        return true;
    }else{
        return false;
    }

}

DELETE.Building = function(id){

    let building  = GET.Building(id);

    if(building.production == null){

        GameScope.mayorsMoney += (building.cost)*(0.40);
        GameScope.player.resources.consumption.power -= building.consumption.power;
        GameScope.player.resources.consumption.water -= building.consumption.water;
        GameScope.player.resources.consumption.waste -= building.consumption.waste;

            //GameScope.player.resources.production[building.type] -= building.production;
    
        GameScope.gameGrid.filter( (item, index)=>{
            if(item.id == id)
                return   GameScope.gameGrid[index].id = null;
        });

        GameScope.reDraw();

        return Buildings.filter( (item, index)=>{
            if(item.id == id)
                return Buildings.splice(index , 1 );
        });

    }else{
        GameScope.initMessage("Bulldozing production building is not allowed.");
    }
}

UPDATE.Building = function(id , settings){
    return Buildings.filter( (item, index)=>{
        if(item.id == id)
             Object.keys(settings).forEach(key=>{
                Buildings[index][key] = settings[key];
             })
            return Buildings[index];
    });
}


CREATE.Building = {};

CREATE.Building.power = function(level){


    let settings = {
        name:'Power Plant',
        type:'power',
        level: level || 1,
        capacity:3*level,
        production:18*level,
        cost:5000,
        module_cost:1,
        rent:1000,
        cost_term:'monthly',
        consumption: {
            power: 0,
            water: 0,
            waste: 0,
        },
        icon:'./Assets/Images/Tiles/Power.png'
    }


    if(GameScope.mayorsMoney < settings.cost){
        //TODO: Implament Error Method to display on GameBoard
                            
        GameScope.initMessage('Insufficient credits, unable to build ', settings.name,'.');
        
        return false;
    }

    if(GameScope.player.resources.production.power <= settings.consumption.power){
        console.log("Build")
    }else{
        console.log('No Resources')
    }

    if(GET.hasResources (settings.consumption) ){
        if(GameScope.player.materialModules >= settings.module_cost){


            GameScope.mayorsMoney -= settings.cost;
            GameScope.player.materialModules -= settings.module_cost;
            Buildings.push(new Building(settings));
    
            GameScope.player.resources.consumption.power += settings.consumption.power;
            GameScope.player.resources.consumption.water += settings.consumption.water;
            GameScope.player.resources.consumption.waste += settings.consumption.waste;
        
            if(settings.production != undefined){
                GameScope.player.resources.production.power += settings.production;
            }
            
           return Buildings[Buildings.length-1].id;

        }else{

        GameScope.initMessage('Insufficient Material Modules, unable to build ', settings.name,'.');
        GameScope.selectedBuilding = null;
        }
       

    }else{
        console.log('No Resources')
        GameScope.initMessage('Insufficient resources, unable to build ', settings.name,'.');
        
        GameScope.selectedBuilding = null;
    }

};

CREATE.Building.water = function(level){

    let settings = {
        name:'Water Purification',
        type:'water',
        level: level || 1,
        capacity:3*(level), //Current Cappcity effects production ( capacity * (currentOccupants/capacity))
        production: 18*(level),
        cost:5000,
        module_cost:1,
        rent:1000,
        cost_term:'monthly',
        consumption: {
            power: 0,
            water: 0,
            waste: 0,
        },
        icon:'./Assets/Images/Tiles/Water.png'
    }

    if(GameScope.mayorsMoney < settings.cost){
                            
        GameScope.initMessage('Insufficient credits, unable to build ', settings.name,'.');
        
        return false;
        
    }

    if(GET.hasResources (settings.consumption) ){

        if(GameScope.player.materialModules >= settings.module_cost){
        

        GameScope.mayorsMoney -= settings.cost;
        GameScope.player.materialModules -= settings.module_cost;
        
        Buildings.push(new Building(settings));

        GameScope.player.resources.consumption.power += settings.consumption.power;
        GameScope.player.resources.consumption.water += settings.consumption.water;
        GameScope.player.resources.consumption.waste += settings.consumption.waste;
    
        if(settings.production != undefined){
            GameScope.player.resources.production.water += settings.production;
        }
        
       return Buildings[Buildings.length-1].id;
    }else{
        GameScope.initMessage('Insufficient Material Modules, unable to build ', settings.name,'.');
        GameScope.selectedBuilding = null;

    }

    }else{

        GameScope.initMessage('Insufficient resources, unable to build ', settings.name,'.');
        
        GameScope.selectedBuilding = null;

    }

};

CREATE.Building.waste = function(level){

    let settings = {
        name:'Waste Management',
        type:'waste',
        level: level || 1,
        capacity:3*(level),
        production: 18*(level),
        cost:5000,
        module_cost:1,
        rent:1000,
        cost_term:'monthly',
        consumption: {
            power: 0,
            water: 0,
            waste: 0,
        },
        icon:'./Assets/Images/Tiles/Waste.png'
    }

    if(GameScope.mayorsMoney < settings.cost){
                            
        GameScope.initMessage('Insufficient credits, unable to build ', settings.name,'.');
        
        return false;
    }

    GameScope.mayorsMoney -= settings.cost;
    Buildings.push(new Building(settings));


        if(GET.hasResources (settings.consumption)){

            if(GameScope.player.materialModules >= settings.module_cost){
            

            GameScope.mayorsMoney -= settings.cost;
            GameScope.player.materialModules -= settings.module_cost;

            
            Buildings.push(new Building(settings));

            GameScope.player.resources.consumption.power += settings.consumption.power;
            GameScope.player.resources.consumption.water += settings.consumption.water;
            GameScope.player.resources.consumption.waste += settings.consumption.waste;
        
            if(settings.production != undefined){
                GameScope.player.resources.production.waste += settings.production;
            }
            
            return Buildings[Buildings.length-1].id;

        }else{
            GameScope.initMessage('Insufficient Material Modules, unable to build ', settings.name,'.');
            GameScope.selectedBuilding = null;
        }

    }else{
        GameScope.initMessage('Insufficient resources, unable to build ', settings.name,'.');
        
        GameScope.selectedBuilding = null;
    }

   
};

CREATE.Building.housing = function(level){

    let housingName;

    switch(level){
        case 2:
            housingName = 'Small Home';
        break;
        case 3:
            housingName = 'Large Home';
        break;
        default:
            housingName = 'Apartment';
    }

    let settings = {
        name: housingName,
        type:'housing',
        level: level || 1,
        capacity:2*(level),
        cost: 5000,
        rent: 1500,
        cost_term:'monthly',
        consumption: {
            power: 3*(level),
            water: 3*(level),
            waste: 3*(level),
        },
        icon:'./Assets/Images/Tiles/Housing.png'
    }

    if(GameScope.mayorsMoney < settings.cost){
                            
        GameScope.initMessage('Insufficient credits, unable to build ', settings.name,'.');
        
        return false;
    }

    if(GET.hasResources (settings.consumption) ){

        GameScope.mayorsMoney -= settings.cost;
        Buildings.push(new Building(settings));

        GameScope.player.resources.consumption.power += settings.consumption.power;
        GameScope.player.resources.consumption.water += settings.consumption.water;
        GameScope.player.resources.consumption.waste += settings.consumption.waste;
    
        return Buildings[Buildings.length-1].id;

    }else{
        console.log('No Resources')
        GameScope.initMessage('Insufficient resources, unable to build ', settings.name,'.');
        
        GameScope.selectedBuilding = null;
    }
};

CREATE.Building.business = function(level){

    let businessName;

    switch(level){
        case 2:
            businessName = 'Medium Business';
        break;
        case 3:
            businessName = 'Large Business';
        break;
        default:
            businessName = 'Small Business';
    }

    let settings = {
        name: businessName,
        type:'business',
        level: level || 1,
        capacity:5+(level),
        cost: 15000,
        rent: 5000,
        cost_term:'monthly',
        consumption: {
            power: 3*(level),
            water: 3*(level),
            waste: 3*(level),
        },
        icon:'./Assets/Images/Tiles/Business.png'
    }

    if(GameScope.mayorsMoney < settings.cost){
                            
        GameScope.initMessage('Insufficient credits, unable to build ', settings.name,'.');
        
        return false;
    }

    if(GET.hasResources (settings.consumption) ){

        GameScope.mayorsMoney -= settings.cost;
        Buildings.push(new Building(settings));

        GameScope.player.resources.consumption.power += settings.consumption.power;
        GameScope.player.resources.consumption.water += settings.consumption.water;
        GameScope.player.resources.consumption.waste += settings.consumption.waste;
    
        return Buildings[Buildings.length-1].id;

    }else{
        console.log('No Resources')
        GameScope.initMessage('Insufficient resources, unable to build ', settings.name,'.');
        GameScope.selectedBuilding = null;
    }
};