// javascript
// Dice cubes management script.

// Dice cubes.
class Cubes {

    // Constructor.
    constructor(screen) {
        this.screen = screen;
        this.option = new d1ce.Params(d1ce.identifier + "-option");
        this.pips = [];
        //this.history = new d1ce.Params(d1ce.identifier + "-history");
        this.random = new d1ce.Count();
        this.faces = null;
        this.update = null;
        this.count = 0;
    }

    // Setup screen after load assets.
    Load() {

        // Create dice cubes faces.
        this.faces = [];
        for (let i = 0; i < Cubes.count_max; ++i) {
            this.faces[i] = new d1ce.Sprite("cubes");
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
        for (let i = 0; i < Cubes.count_max; ++i) {
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

        // Rolled dice cubes without saving parameters.
        this.pips = [];
        for (let i = 0; i < this.option.Value("type"); ++i) {
            this.pips.push(this.random.Random(Cubes.number_max) + 1);
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

        // Change dice cubes type and save parameters.
        if (change > 0) {
            this.option.UpdateValue("type",
                Math.min(this.option.Value("type") + 1, Cubes.count_max));
            console.log("type:" + this.option.Value("type"));
        } else if (change < 0) {
            this.option.UpdateValue("type",
                Math.max(this.option.Value("type") - 1, 1));
            console.log("type:" + this.option.Value("type"));
        }

        // Change dice cubes count.
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

        // Selecting dice cubes face.
        this.pips = [];
        let pip = Math.floor(this.count / 20) % Cubes.number_max + 1;
        for (let i = 0; i < this.faces.length; ++i) {
            this.pips.push(pip);
        }

        // Update dice cubes type.
        for (let i = 0; i < this.faces.length; ++i) {
            this.faces[i].SetType("pip" + this.pips[i]);
        }

        // Count up for dice cubes face.
        this.count += 1;
    }

    // Update rolling.
    UpdateRolling() {

        // Rolling dice cubes face.
        this.pips = [];
        for (let i = 0; i < this.faces.length; ++i) {
            let pip = this.random.Random(Cubes.number_max) + 1;
            this.pips.push(pip);
        }

        // Update dice cubes type.
        for (let i = 0; i < this.faces.length; ++i) {
            this.faces[i].SetType("pip" + this.pips[i]);
        }

        // Count down to stop rolling dice cubes.
        this.count -= 1;
        if (this.count <= 0) {

            // Save parameters.
            this.option.UpdateValue("seed", this.random.Seed());
            //let time = d1ce.Engine.Time();
            //let result = [time, this.option.Value("type"), this.option.Value("seed")];
            //this.history.UpdateValue(this.history.Keys().length, result);

            this.StartRolled();
        }
    }

    // Update rolled.
    UpdateRolled() {

        // Update dice cubes type.
        for (let i = 0; i < this.faces.length; ++i) {
            this.faces[i].SetType("pip" + this.pips[i]);
        }
    }

    // Update holding.
    UpdateHolding() {

        // Selecting dice cubes face.
        this.option.UpdateValue("seed", 0);
        this.pips = [];
        let pip = Math.floor(this.count / 20) % Cubes.number_max + 1;
        for (let i = 0; i < this.faces.length; ++i) {
            this.pips.push(pip);
        }

        // Update dice cubes type.
        for (let i = 0; i < this.faces.length; ++i) {
            this.faces[i].SetType("pip" + this.pips[i]);
        }

        // Count up for dice cubes face.
        this.count += 1;
    }

    // Update.
    Update() {
        if (this.update != null) {
            this.update();
        }
    }
}

// Dice cubes maximum counts.
Cubes.count_max = 12;

// Dice cubes faces maximum number.
Cubes.number_max = 6;

