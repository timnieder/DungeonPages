const GOOD_DICE_COUNT = 3;
const EVIL_DICE_COUNT = 3;

class Dice {
    IsEvil = false;
    Value = 1;
    // Runtime
    DOMObject = null;
    Used = true;
    Active = false;

    constructor(evil) {
        this.IsEvil = evil;
        this.CreateDOM();
    }

    CreateDOM() {
        let ret = document.createElement("div");
        ret.classList.add("dicepool-dice");
        this.DOMObject = ret;
        // add pips
        for (let i = 0; i < 6; i++) {
            let pip = document.createElement("span");
            pip.classList.add("pip");
            ret.appendChild(pip);
        }
        this.UpdateUI();
        return ret;
    }

    UpdateUI() {
        let obj = this.DOMObject;
        // good
        obj.classList.toggle("evil", this.IsEvil);
        // used
        obj.classList.toggle("used", this.Used);
        // active
        obj.classList.toggle("active", this.Active);
        // mark pips
        let pips = obj.getElementsByClassName("pip");
        for (let i = 0; i < pips.length; i++) {
            let pip = pips[i];
            pip.classList.toggle("active", i < this.Value);
        }
    }
}

class DicePool {
    Dice = [];
    GoodDice = [];
    EvilDice = [];
    // Runtime
    DOMObject = null;
    SelectedDice = null;
    // Events
    OnDiceClick = null;

    constructor() {
        this.CreateDice();
        this.CreateDOM();
    }

    UseDice(tile) {
    UseDice(dungeon, tile, character) {
        let dice = this.SelectedDice;
        if (dice == null || dice.Used)
            return false;

        // mark tile
        if (!tile.CanBeMarked())
            return false;

        if (!dungeon.CanReachTile(tile, character))
            return false;

        tile.Value = dice.Value;
        tile.UpdateUI();
        // use dice
        this.SelectedDice = null;
        dice.Used = true;
        dice.Active = false;
        dice.UpdateUI();
        return true;
    }

    SelectDice(dice) {
        if (dice.Active)
            return false;
        if (dice.Used)
            return false;
        // remove last active dice
        if (this.SelectedDice != null) {
            this.SelectedDice.Active = false;
            this.SelectedDice.UpdateUI();
        }
        // select the new dice
        this.SelectedDice = dice;
        dice.Active = true;
        dice.UpdateUI();
        return true;
    }

    Reroll() {
        // check if all dice were used
        for (let i in this.Dice) {
            let dice = this.Dice[i];
            if (!dice.Used)
                return false;
        }

        //TODO: get active dice?
        for (let i in this.Dice) {
            let dice = this.Dice[i];
            dice.Used = false;
            dice.Active = false;
            dice.Value = Math.floor(Math.random() * 6) + 1;
            dice.UpdateUI();
        }
        return true;
    }

    CreateDOM() {
        let ret = document.createElement("div");
        ret.classList.add("dicepool");
        this.DOMObject = ret;
        // add button
        let reroll = document.createElement("button");
        reroll.classList.add("dicepool-button");
        reroll.onclick = (e) => this.Reroll();
        reroll.innerText = "Reroll";
        ret.appendChild(reroll);
        // add dice
        for (let i in this.Dice) {
            let d = this.Dice[i];
            ret.appendChild(d.DOMObject);
            // listen to click
            d.DOMObject.onclick = (e) => {
                if (this.OnDiceClick) {
                    this.OnDiceClick({
                        "dice": d
                    });
                }
            };
        }
        return ret;
    }

    CreateDice() {
        for (let i = 0; i < GOOD_DICE_COUNT; i++) {
            let d = new Dice(false);
            this.Dice.push(d);
            this.GoodDice.push(d);
        }
        for (let i = 0; i < EVIL_DICE_COUNT; i++) {
            let d = new Dice(true);
            this.Dice.push(d);
            this.EvilDice.push(d);
        }
    }
}