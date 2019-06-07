// javascript
// App main script.


// App main.
class App {

    // Constructor.
    constructor() {

        // Print timestamp.
        let info_screen = new d1ce.Screen("info_screen");
        info_screen.Print(d1ce.timestamp);

        // Create screens.
        this.log_screen = new d1ce.Screen("log_screen");
        this.main_screen = new d1ce.Screen("main_screen");
        this.touch_screen = new d1ce.Screen("touch_screen");

        // Create sprites.
        this.hand = new Hand(this.touch_screen);
        this.cubes = new Cubes(this.main_screen);
        this.touching = null;

        // Load fixed parameter from query.
        let query = new d1ce.Params("");
        if (query.Value("face")) {
            this.fixed = "face";
        } else if (query.Value("seed")) {
            this.fixed = "seed";
        } else if (query.Value("type")) {
            if (query.Value("type").match(/([\+\-])(\d*)d(\d*)/)) {
                this.fixed = "face";
            } else {
                this.fixed = "type";
            }
        }

        // // Load fixed parameter from storage.
        // if (this.storage.Value("fixed")) {
        //     this.fixed = this.storage.Value("fixed");
        // }

        // // Store current state.
        // this.storage.UpdateValue("fixed", this.fixed);
    }

    // Setup screen after load assets.
    async Load() {

        await this.hand.Load();
        await this.cubes.Load();

        if (this.fixed == "face") {
            this.cubes.StartRolling();
        } else if (this.fixed == "seed") {
            this.cubes.StartRolling();
        } else {
            this.cubes.StartReleased();
        }
    }

    // Store status on suspend.
    Store() {
        this.cubes.Store();
    }

    // Update.
    Update() {
        this.hand.Update();

        // Tapped -> Roll cubes.
        if (this.hand.Tapped()) {

            // Reroll
            this.cubes.StartRerolling();
            this.touching = null;

        // Released -> Change cubes or do test method.
        } else if (this.hand.Released()) {

            // Released when type parameter is fixed.
            if (this.fixed == "type") {
                this.cubes.StartReleased();
            } else if (this.fixed == "seed" || this.fixed == "face") {
                this.cubes.StartReleased(this.touching);
            } else {

                // Released right/left -> Change cubes type.
                if (this.hand.Released().Right()) {
                    this.cubes.StartChanging(1);
                } else if (this.hand.Released().Left()) {
                    this.cubes.StartChanging(-1);
                }
            }
            this.touching = null;

        // Swiping -> Swiping cubes.
        } else if (this.hand.Swiping()) {

            // Released when type parameter is fixed.
            if (this.fixed == "type") {
                this.cubes.StartReleased();
            } else if (this.fixed == "seed" || this.fixed == "face") {

                // Swipgin down/uo -> Select cube.
                if (this.hand.Swiping().Up()) {
                    this.cubes.StartSelecting(this.touching, 0);
                } else if (this.hand.Swiping().Down()) {
                    this.cubes.StartSelecting(this.touching, 1);
                }
            } else {

                // Swipgin right/left -> Change cubes type.
                if (this.hand.Swiping().Right()) {
                    this.cubes.StartHolding(1);
                } else if (this.hand.Swiping().Left()) {
                    this.cubes.StartHolding(-1);
                } else {
                    this.cubes.StartHolding(0);
                }
            }

        // Holding -> Holding cubes.
        } else if (this.hand.Holding()) {

            // Released when type parameter is fixed.
            if (this.fixed == "type") {
                this.cubes.StartReleased();
            } else if (this.fixed == "seed" || this.fixed == "face") {
                this.cubes.StartSelecting(this.touching, 1);
            } else {
                this.cubes.StartHolding(0);
            }

        // Touching -> Selecting cubes.
        } else if (this.hand.Touching()) {
            this.touching = this.hand.Point();
            this.cubes.StartTouching();
        }

        this.cubes.Update();
    }

    // Draw.
    Draw() {
    }

    // Main.
    async Main() {
        console.log("Load.");
        await this.Load();
        while (true) {
            if (!this.suspend) {
                this.Update();
                this.Draw();
                await d1ce.Engine.Wait(1000 / 60);
            } else {
                this.Store();
            }
        }
    }

    // Suspend.
    async Suspend() {
        console.log("Suspend.");
        this.suspend = true;
        while (this.suspend) {
            await d1ce.Engine.Wait(1000 / 60);
        }
    }

    // Get instance.
    static Instance() {
        if (this.instance == null) {
            this.instance = new App();
        }
        return this.instance;
    }
}

// Main on load event, create instance on boot event.
window.onload = () => App.Instance().Main();

// Suspend on visibilitychange event.
document.visibilitychange = () => App.Instance().Suspend();
