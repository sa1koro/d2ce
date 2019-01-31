// javascript
// Dice management script.


// Dice.
class Dice {

    // Constructor.
    constructor(screen) {
        this.screen = screen;
        this.option = new d1ce.Params(d1ce.identifier + "-option");
        this.pips = [1, 1, 1];
        this.history = new d1ce.Params(d1ce.identifier + "-history");
        this.random = new d1ce.Count();
        this.faces = null;
        this.update = null;
        this.count = 0;
    }

    // Setup screen after load assets.
    Load() {

        // Create dice faces.
        this.faces = [];
        for (let i = 0; i < 3; ++i) {
            this.faces[i] = new d1ce.Sprite("dice");
        }

        // Overwrite by boot parameters.
        if (d1ce.Engine.Value("type")) {
            this.option.UpdateValue("type", d1ce.Engine.Value("type"));
            d1ce.Engine.UpdateValue("type", null);
        }
        if (d1ce.Engine.Value("seed")) {
            this.option.UpdateValue("seed", d1ce.Engine.Value("seed"));
            d1ce.Engine.UpdateValue("seed", null);
        }

        // Set default option.
        this.option.UpdateValue("type", Number(this.option.Value("type") || 1));
        this.option.UpdateValue("seed", Number(this.option.Value("seed") || 0));

        // Set random seed.
        this.random = new d1ce.Count(this.option.Value("seed"));

        // Setup faces.
        for (let i = 0; i < 3; ++i) {
            this.faces[i].Enable(this.screen, i < this.option.Value("type"));
        }

        if (this.option.Value("seed") != 0) {
            this.StartRolled();
        } else {
            this.StartSelecting();
        }

        console.log("type:" + this.option.Value("type") + " seed:" + this.option.Value("seed"));
    }

    // Store status on suspend.
    Store() {
    }

    // Start selecting.
    StartSelecting() {
        if (this.update == this.UpdateSelecting) {
            this.update = this.UpdateSelecting;

            // Restart selecting animation.
            for (let i = 0; i < this.faces.length; ++i) {
                this.faces[i].SetAnime("reselecting");
            }
        } else {
            this.update = this.UpdateSelecting;

            // Restart selecting animation.
            for (let i = 0; i < this.faces.length; ++i) {
                this.faces[i].SetAnime("selecting");
            }
        }
    }

    // Start rolled.
    StartRolled() {
        this.update = this.UpdateRolled;
        this.count = 0;

        // Rolled dice without saving parameters.
        this.pips = [];
        for (let i = 0; i < this.option.Value("type"); ++i) {
            this.pips.push(this.random.Random(6) + 1);
        }

        // Start rolling animation.
        for (let i = 0; i < this.faces.length; ++i) {
            this.faces[i].SetAnime("rolling");
        }
    }

    // Start rolling.
    StartRolling() {
        this.update = this.UpdateRolling;
        this.count = 30;

        // Start rolling animation.
        for (let i = 0; i < this.faces.length; ++i) {
            this.faces[i].SetAnime("rolling");
        }
    }

    // Start holding.
    StartHolding(change) {
        if (this.update != this.UpdateHolding) {
            this.update = this.UpdateHolding;
        }

        // Start holding animation.
        for (let i = 0; i < this.faces.length; ++i) {
            if (change > 0) {
                this.faces[i].SetAnime("swiping_right");
            } else if (change < 0) {
                this.faces[i].SetAnime("swiping_left");
            } else {
                this.faces[i].SetAnime("holding");
            }
        }
    }

    // Start changing.
    StartChanging(change) {
        this.update = this.UpdateSelecting;

        // Change dice type and save parameters.
        if (change > 0) {
            this.option.UpdateValue("type", Math.min(this.option.Value("type") + 1, 3));
            console.log("type:" + this.option.Value("type"));
        } else if (change < 0) {
            this.option.UpdateValue("type", Math.max(this.option.Value("type") - 1, 1));
            console.log("type:" + this.option.Value("type"));
        }

        // Change dice number.
        for (let i = 0; i < this.faces.length; ++i) {
            this.faces[i].Enable(this.screen, i < this.option.Value("type"));
        }

        // Start/continue selecting animation.
        for (let i = 0; i < this.faces.length; ++i) {
            this.faces[i].SetAnime("selecting");
        }
    }

    // Update selecting.
    UpdateSelecting() {

        // Selecting dice face.
        let p = Math.floor(this.count / 20) % 6 + 1;
        this.pips = [p, p, p];

        // Update dice type.
        for (let i = 0; i < this.faces.length; ++i) {
            this.faces[i].SetType("pip" + this.pips[i]);
        }

        // Count up for dice face.
        this.count += 1;
    }

    // Update rolling.
    UpdateRolling() {

        // Rolling dice face.
        let p1 = this.random.Random(6) + 1;
        let p2 = this.random.Random(6) + 1;
        let p3 = this.random.Random(6) + 1;
        this.pips = [p1, p2, p3];

        // Update dice type.
        for (let i = 0; i < this.faces.length; ++i) {
            this.faces[i].SetType("pip" + this.pips[i]);
        }

        // Count down to stop rolling dice.
        this.count -= 1;
        if (this.count <= 0) {

            // Save parameters.
            this.option.UpdateValue("seed", this.random.Seed());
            let time = d1ce.Engine.Time();
            let result = [time, this.option.Value("type"), this.option.Value("seed")];
            this.history.UpdateValue(this.history.Keys().length, result);

            this.StartRolled();
        }
    }

    // Update rolled.
    UpdateRolled() {

        // Update dice type.
        for (let i = 0; i < this.faces.length; ++i) {
            this.faces[i].SetType("pip" + this.pips[i]);
        }
    }

    // Update holding.
    UpdateHolding() {

        // Selecting dice face.
        this.option.UpdateValue("seed", 0);
        let p = Math.floor(this.count / 20) % 6 + 1;
        this.pips = [p, p, p];

        // Update dice type.
        for (let i = 0; i < this.faces.length; ++i) {
            this.faces[i].SetType("pip" + this.pips[i]);
        }

        // Count up for dice face.
        this.count += 1;
    }

    // Update.
    Update() {
        if (this.update != null) {
            this.update();
        }
    }
}
