// javascript
// Dice cubes management script.

// Dice cubes.
class Cubes {

    // Constructor.
    constructor(screen) {
        this.screen = screen;
        this.sprites = null;
        this.sprite_selected = -1;

        this.query = new d1ce.Params("");
        this.storage = new d1ce.Params(d1ce.identifier + "-option");
        this.message = new d1ce.Params("*", true);

        this.random = new d1ce.Count();
        this.update = null;
        this.count = 0;

        this.app = "";
        this.type = "";
        this.type_plus = 0;
        this.type_count = 1;
        this.type_number = 6;
        this.seed = 0;
        this.face = "";
        this.face_numbers = [];
        this.hold = "";
        this.hold_numbers = [];

        // Load and save tag parameter from query or storage.
        if (this.query.Value("app")) {
            this.app = this.query.Value("app");
            this.message.UpdateValue("app", this.app, true);
        }

        // Load and save tag parameter from query or storage.
        if (this.query.Value("tag")) {
            let tag = this.query.Value("tag");
            this.message.UpdateValue("tag", tag, true);
        }

        // Load parameters from query.
        if (this.query.Value("type") != null
         || this.query.Value("seed") != null
         || this.query.Value("face") != null) {
            this.type = this.query.Value("type");
            this.seed = this.query.Value("seed");
            this.face = this.query.Value("face");
            this.hold = this.query.Value("hold");
        }

        // Face add or subtract parameter.
        if (this.type.match(/([\+\-])(\d*)d(\d*)/)) {
            let type = this.storage.Value("type");
            let type_count = 1;
            let type_number = 6;
            if (type.match(/(\d*)d(\d*)/)) {
                type.replace(/(\d*)d(\d*)/, (match, p1, p2) => {
                    (match);
                    type_count = p1 > 0 ? Number(p1) : 1;
                    type_number = p2 > 0 ? Number(p2) : 6;
                });
            }
            let face = this.storage.Value("face");
            this.type.replace(/\+(\d*)d(\d*)/, (match, p1, p2) => {
                (match);
                this.type_count = type_count + (p1 > 0 ? Number(p1) : 1);
                this.type_number = p2 > 0 ? Number(p2) : 6;
                this.type = "" + this.type_count + "d" + this.type_number;
                this.seed = this.seed || 0;
                this.face = face + (this.face ? ("," + this.face) : "");
            });
            this.type.replace(/\-(\d*)d(\d*)/, (match, p1, p2) => {
                (match);
                this.type_count = type_count - (p1 > 0 ? Number(p1) : 1);
                this.type_number = p2 > 0 ? Number(p2) : 6;
                this.type = "" + this.type_count + "d" + this.type_number;
                this.seed = this.seed || 0;
                this.face = face + (this.face ? ("," + this.face) : "");
            });

            // Clear result parameters.
            this.message.UpdateValue("type", this.type, true);
            this.message.UpdateValue("seed", this.seed, true);
            this.message.UpdateValue("face", null);
        }

        // Load type,seed,face from storage.
        if (this.type == "") {
            this.type = this.storage.Value("type");
            this.seed = this.storage.Value("seed");
            this.face = this.storage.Value("face");
        }

        // Set cube count and face number max.
        if (this.type.match(/(\d*)d(\d*)/)) {
            this.type.replace(/(\d*)d(\d*)/, (match, p1, p2) => {
                (match);
                this.type_count = p1 > 0 ? Number(p1) : 1;
                this.type_number = p2 > 0 ? Number(p2) : 6;
            });

        // Set cube count only.
        } else if (isFinite(this.type)) {
            this.type_count = Number(this.type);
            this.type_number = 6;

        // Set default.
        } else {
            this.type = "";
            this.type_count = 1;
            this.type_number = 6;
        }

        // Type range check.
        if (this.type_count < 1) {
            this.type_count = 1;
        } else if (this.type_count > Cubes.count_max) {
            this.type_count = Cubes.count_max;
        }
        if (this.type_number < 1) {
            this.type_number = 1;
        } else if (this.type_number > Cubes.number_max) {
            this.type_number = Cubes.number_max;
        }

        // Seed range check.
        if (!isFinite(this.seed)) {
            this.seed = 0;
        }

        // Parse face parameters.
        this.face_numbers = [];
        if (this.face != null) {
            let numbers = this.face.split(',');
            for (let i = 0; i < this.type_count; ++i) {
                this.face_numbers.push(isFinite(numbers[i]) ? Number(numbers[i]) : 0);
            }
            this.face = this.face_numbers.join(",");
        } else {
            for (let i = 0; i < this.type_count; ++i) {
                this.face_numbers.push(0);
            }
        }
        this.hold_numbers = [];
        if (this.hold != null) {
            let numbers = this.hold.split(',');
            for (let i = 0; i < this.type_count; ++i) {
                this.hold_numbers.push(isFinite(numbers[i]) ? Number(numbers[i]) : 0);
            }
            this.hold = this.hold_numbers.join(",");
        } else {
            for (let i = 0; i < this.type_count; ++i) {
                this.hold_numbers.push(0);
            }
        }

        // Store current state.
        this.storage.UpdateValue("type", this.type);
        this.storage.UpdateValue("seed", this.seed);
        this.storage.UpdateValue("face", this.face);

        // Set random seed.
        this.random = new d1ce.Count(this.seed);

        console.log("type:" + this.type + " seed:" + this.seed);
    }

    // Setup screen after load assets.
    async Load() {
        let sprite_file = "image/dot.png";
        let sprite_size = 192;

        // Set sprite from app parameter.
        if (this.app.match(/^(\w+)@(\d+)/)) {
            this.app.replace(/^(\w+)@(\d+)/, (match, p1, p2) => {
                (match);
                sprite_file = "image/" + p1 + ".png";
                sprite_size = Number(p2);
            });
        } else if (this.app != "") {
            sprite_file = "image/" + this.app + ".png";
            sprite_size = 192;

        // Set sprite from type parameter.
        } else if (this.type_number == 10) {
            sprite_file = "image/num.png";
            sprite_size = 192;
        } else if (this.type_number <= 20) {
            sprite_file = "image/dot.png";
            sprite_size = 192;
        } else {
            sprite_file = "image/card.png";
            sprite_size = 192;
        }

        // Create dice cubes sprites.
        this.sprites = [];
        for (let i = 0; i < Cubes.count_max; ++i) {
            this.sprites[i] = new d1ce.Sprite("cubes");
            this.sprites[i].LoadImage(sprite_file, sprite_size, sprite_size);
        }

        for (let i = 0; i < Cubes.count_max; ++i) {
            await this.sprites[i].WaitLoadingImage();
        }

        // Setup sprites.
        for (let i = 0; i < Cubes.count_max; ++i) {
            this.sprites[i].Enable(this.screen, i < this.type_count);
            if (this.type_count == 1) {
                this.sprites[i].SetScale(1);
            } else if (this.type_count <= 4) {
                this.sprites[i].SetScale(0.75);
            } else if (this.type_count <= 9) {
                this.sprites[i].SetScale(0.5);
            } else {
                this.sprites[i].SetScale(0.375);
            }
        }
    }

    // Store status on suspend.
    Store() {
    }

    // Start selecting.
    StartSelecting(point, select) {
        if (this.update != this.UpdateRolling) {
            this.update = this.UpdateSelecting;

            // Start selecting animation.
            for (let i = 0; i < this.sprites.length; ++i) {
                if (this.sprites[i].IsInRect(point)) {
                    if (select) {
                        this.sprites[i].SetAnime("holding");
                        this.hold_numbers[i] = select;
                    } else {
                        this.sprites[i].SetAnime("unselecting");
                        this.hold_numbers[i] = 0;
                    }
                }
            }
        }
    }

    // Start touching.
    StartTouching(point = null) {
        if (this.update == this.UpdateSelecting) {

            // Restart selecting animation.
            for (let i = 0; i < this.sprites.length; ++i) {
                if (!point && !this.hold_numbers[i]) {
                    this.sprites[i].SetAnime("reselecting");
                } else if (this.sprites[i].IsInRect(point)) {
                    this.sprites[i].SetAnime("reselecting");
                }
            }
        } else if (this.update != this.UpdateRolling) {
            this.update = this.UpdateSelecting;

            // Clear result parameters.
            this.message.UpdateValue("type", this.type, true);
            this.message.UpdateValue("seed", this.seed, true);
            this.message.UpdateValue("face", null);

            // Start selecting animation.
            for (let i = 0; i < this.sprites.length; ++i) {
                if (this.hold_numbers[i]) {
                    this.sprites[i].SetAnime("holding");
                } else if (!point && !this.hold_numbers[i]) {
                    this.sprites[i].SetAnime("selecting");
                } else if (this.sprites[i].IsInRect(point)) {
                    this.sprites[i].SetAnime("selecting");
                }
            }
        }
    }

    // Start rolled.
    StartRolled() {
        this.update = this.UpdateRolled;
        this.count = 0;

        // Set default random seed.
        if (this.seed == 0) {
            this.seed = this.random.Seed();
        }

        for (let i = 0; i < this.type_count; ++i) {

            // Fill face numbers not specified.
            if (!this.face_numbers[i]) {
                this.face_numbers[i] = this.random.Random(this.type_number) + 1;
            }
        }
        this.face = this.face_numbers.join(",");

        // Save storage parameters.
        this.storage.UpdateValue("type", this.type, true);
        this.storage.UpdateValue("seed", this.seed, true);
        this.storage.UpdateValue("face", this.face);

        // Save query parameters.
        // this.query.UpdateValue("type", this.type, true);
        // this.query.UpdateValue("seed", this.seed, true);
        // this.query.UpdateValue("face", this.face);

        // Save result parameters.
        this.message.UpdateValue("type", this.type, true);
        this.message.UpdateValue("seed", this.seed, true);
        this.message.UpdateValue("face", this.face);

        // Start rolled animation.
        for (let i = 0; i < this.sprites.length; ++i) {
            if (!this.hold_numbers[i]) {
                this.sprites[i].SetAnime("rolled");
            }
        }
    }

    // Start rolling.
    StartRolling() {
        this.update = this.UpdateRolling;
        this.count = 30;

        for (let i = 0; i < this.face_numbers.length; ++i) {

            // Start rolled animation.
            if (this.face_numbers[i] > 0) {
                this.sprites[i].SetAnime("rolled");

            // Start rolling animation.
            } else {
                this.sprites[i].SetAnime("rolling");
            }
        }
    }

    // Start rerolling.
    StartRerolling() {
        this.update = this.UpdateRolling;
        this.count = 30;

        // Reset face numbers.
        for (let i = 0; i < this.type_count; ++i) {
            if (!this.hold_numbers[i]) {
                this.face_numbers[i] = 0;
            }
        }

        // Send message with face,hold.
        this.face = this.face_numbers.join(",");
        this.message.UpdateValue("face", this.face, true);
        this.hold = this.hold_numbers.join(",");
        this.message.UpdateValue("hold", this.hold);

        // Start rolling animation.
        for (let i = 0; i < this.sprites.length; ++i) {
            this.sprites[i].SetAnime("rolling");
        }
    }

    // Start holding.
    StartHolding(change) {
        this.update = this.UpdateHolding;

        // Start holding animation.
        for (let i = 0; i < this.sprites.length; ++i) {
            if (!this.hold_numbers[i]) {
                if (this.sprite_selected < 0 || this.sprite_selected == i) {
                    if (change > 0) {
                        this.sprites[i].SetAnime("swiping_right");
                    } else if (change < 0) {
                        this.sprites[i].SetAnime("swiping_left");
                    } else {
                        this.sprites[i].SetAnime("holding");
                    }
                }
            }
        }
    }

    // Start dropped.
    /*StartDropped() {

        if (this.update == this.UpdateHolding) {
            if (this.sprite_selected >= 0) {
                this.face_numbers.splice(this.sprite_selected, 1);
                this.face = this.face_numbers.join(",");
                this.storage.UpdateValue("face", this.face);
                this.query.UpdateValue("face", this.face);
                this.message.UpdateValue("face", this.face, true);

                this.type_count -= 1;
                this.type = this.type_count + "d" + this.type_number;
                this.storage.UpdateValue("type", this.type);
                this.query.UpdateValue("type", this.type);
                this.message.UpdateValue("type", this.type, true);
            }
        }

        this.update = this.UpdateSelecting;

        // Start released animation.
        for (let i = 0; i < this.sprites.length; ++i) {
            this.sprites[i].SetAnime("released");
        }
    }*/

    // Start selected.
    StartSelected() {
        this.update = this.UpdateReleased;

        this.face = this.face_numbers.join(",");
        this.message.UpdateValue("face", this.face, true);
        this.hold = this.hold_numbers.join(",");
        this.message.UpdateValue("hold", this.hold);

        // Start released animation.
        for (let i = 0; i < this.sprites.length; ++i) {
            this.sprites[i].SetAnime("released");
        }
    }

    // Start released.
    StartReleased() {
        if (this.update != this.UpdateRolling) {
            this.update = this.UpdateSelecting;

            // Change dice cubes count.
            for (let i = 0; i < this.sprites.length; ++i) {
                this.sprites[i].Enable(this.screen, i < this.type_count);
                if (this.type_count == 1) {
                    this.sprites[i].SetScale(1);
                } else if (this.type_count <= 4) {
                    this.sprites[i].SetScale(0.75);
                } else if (this.type_count <= 9) {
                    this.sprites[i].SetScale(0.5);
                } else {
                    this.sprites[i].SetScale(0.375);
                }
            }


            // Start released animation.
            for (let i = 0; i < this.sprites.length; ++i) {
                if (!this.hold_numbers[i]) {
                    this.sprites[i].SetAnime("released");
                }
            }
        }
    }

    // Start swapping.
    /*StartSwapping(change) {

        this.update = this.UpdateSelecting;

        // Swap dice cubes type and save parameters.
        if (this.face_numbers.length >= 2) {
            if (change > 0) {
                if (this.sprite_selected <= this.face_numbers.length - 2) {
                    let number = this.face_numbers[this.sprite_selected];
                    this.face_numbers[this.sprite_selected] = this.face_numbers[this.sprite_selected + 1];
                    this.face_numbers[this.sprite_selected + 1] = number;
                    this.face = this.face_numbers.join(",");
                    this.query.UpdateValue("face", this.face);
                }

            } else if (change < 0) {
                if (this.sprite_selected >= 1) {
                    let number = this.face_numbers[this.sprite_selected];
                    this.face_numbers[this.sprite_selected] = this.face_numbers[this.sprite_selected - 1];
                    this.face_numbers[this.sprite_selected - 1] = number;
                    this.face = this.face_numbers.join(",");
                    this.query.UpdateValue("face", this.face);
                }
            }
        }

        // Start/continue changed animation.
        for (let i = 0; i < this.sprites.length; ++i) {
            this.sprites[i].SetAnime("changed");
        }
    }*/

    // Start changing.
    StartChanging(change) {
        this.update = this.UpdateSelecting;

        // Change dice cubes type and save parameters.
        if (this.sprites.length >= 2) {
            if (change > 0) {
                if (this.type_count >= Cubes.count_max) {
                    this.type_count = Cubes.count_max;
                } else {
                    this.type_count = this.type_count + 1;
                }

            } else if (change < 0) {
                if (this.type_count <= 1) {
                    this.type_count = 1;
                } else {
                    this.type_count = this.type_count - 1;
                }
            }
        }
        if (change != 0) {
            this.type = this.type_count + "d" + this.type_number;
            this.storage.UpdateValue("type", this.type);
            this.query.UpdateValue("type", this.type);
            this.message.UpdateValue("type", this.type, true);
        }

        // Change dice cubes count.
        for (let i = 0; i < this.sprites.length; ++i) {
            this.sprites[i].Enable(this.screen, i < this.type_count);
            if (this.type_count == 1) {
                this.sprites[i].SetScale(1);
            } else if (this.type_count <= 4) {
                this.sprites[i].SetScale(0.75);
            } else if (this.type_count <= 9) {
                this.sprites[i].SetScale(0.5);
            } else {
                this.sprites[i].SetScale(0.375);
            }
        }

        // Start/continue changed animation.
        for (let i = 0; i < this.sprites.length; ++i) {
            this.sprites[i].SetAnime("changed");
        }
    }

    // Update selecting.
    UpdateSelecting() {
        let number = Math.floor(this.count / 20) % this.type_number + 1;

        let numbers = [];
        for (let i = 0; i < this.sprites.length; ++i) {

            // Rolled dice cubes face.
            if (this.face_numbers[i] > 0) {
                numbers.push(this.face_numbers[i]);

            // Selecting dice cubes face.
            } else {
                numbers.push(number);
            }
        }

        // Update dice cubes type.
        for (let i = 0; i < this.sprites.length; ++i) {
            if (i < this.type_count) {
                this.sprites[i].SetFrame(numbers[i] - 1);
            }
        }

        // Count up for dice cubes face.
        this.count += 1;
    }

    // Update rolling.
    UpdateRolling() {

        // Rolled dice cubes face.
        let numbers = [];
        for (let i = 0; i < this.sprites.length; ++i) {
            if (this.face_numbers[i] > 0) {
                numbers.push(this.face_numbers[i]);
            } else {
                let number = d1ce.Engine.Random(this.type_number) + 1;
                numbers.push(number);
            }
        }

        // Update dice cubes type.
        for (let i = 0; i < this.sprites.length; ++i) {
            if (i < numbers.length) {
                this.sprites[i].SetFrame(numbers[i] - 1);
            }
        }

        // Count down to stop rolling dice cubes.
        this.count -= 1;
        if (this.count <= 0) {
            this.StartRolled();
        }
    }

    // Update rolled.
    UpdateRolled() {

        // Update dice cubes type.
        for (let i = 0; i < this.sprites.length; ++i) {
            if (i < this.face_numbers.length) {
                this.sprites[i].SetFrame(this.face_numbers[i] - 1);
            }
        }

        // Start/continue changed animation.
        for (let i = 0; i < this.sprites.length; ++i) {
            this.sprites[i].SetAnime("rolled");
        }
    }

    // Update holding.
    UpdateHolding() {
        let number = Math.floor(this.count / 20) % this.type_number + 1;

        // Rolled dice cubes face.
        let numbers = [];
        for (let i = 0; i < this.sprites.length; ++i) {
            if (this.face_numbers[i] > 0) {
                numbers.push(this.face_numbers[i]);
            } else {
                numbers.push(number);
            }
        }

        // Update dice cubes type.
        for (let i = 0; i < this.sprites.length; ++i) {
            if (i < this.type_count) {
                this.sprites[i].SetFrame(numbers[i] - 1);
            }
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
Cubes.count_max = 16;

// Dice cubes sprites maximum number.
Cubes.number_max = 54;
