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
    }

    // Setup screen after load assets.
    Load() {
        this.hand.Load();
        this.cubes.Load();
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
            this.cubes.StartRolling();

        // Released -> Change cubes or do test method.
        } else if (this.hand.Released()) {

            // Released right -> Change cubes type.
            if (this.hand.Released().Right()) {

                // // Clear cache.
                // if (this.cubes.option.Value("type") >= 3) {
                //     this.log_screen.Print("Clear local storage.");
                //     window.localStorage.clear();
                //     this.log_screen.Print("Clear cache.");
                //     window.caches.keys().then((keys) => {
                //         keys.map((key) => {
                //             window.caches.delete(key);
                //         });
                //     });
                //     this.log_screen.Print("Clear debug screen.");
                //     this.log_screen.Clear();
                // }

                this.cubes.StartChanging(1);

            // Released left -> Change cubes type.
            } else if (this.hand.Released().Left()) {
                this.cubes.StartChanging(-1);

            // Released other -> Selecting cubes.
            } else {
                this.cubes.StartSelecting();
            }

        // Swiping -> Swiping cubes.
        } else if (this.hand.Swiping()) {
            if (this.hand.Swiping().Right()) {
                this.cubes.StartHolding(1);
            } else if (this.hand.Swiping().Left()) {
                this.cubes.StartHolding(-1);
            } else {
                this.cubes.StartHolding(0);
            }

        // Holding -> Holding cubes.
        } else if (this.hand.Holding()) {
            this.cubes.StartHolding(0);

        // Touching -> Selecting cubes.
        } else if (this.hand.Touching()) {
            this.cubes.StartSelecting();
        }

        this.cubes.Update();
    }

    // Draw.
    Draw() {
    }

    // Main.
    async Main() {
        console.log("Load.");
        this.Load();
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
