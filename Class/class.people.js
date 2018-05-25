class People {
    constructor(settings){
        this.happiness = settings.happines;
        this.income = settings.happiness;
        this.bank = settings.bank;
        this.health = settings.health;
        this.employer = settings.employer;
        this.housing_id = settings.housing_id;
    }
    payHousing(){
        this.bank -= GET.Building(this.housing_id).cost;
    }
}