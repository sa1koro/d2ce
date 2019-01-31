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
        this.user = new User(this.touch_screen);
        this.dice = new Dice(this.main_screen);
    }

    // Setup screen after load assets.
    Load() {
        this.user.Load();
        this.dice.Load();
    }

    // Store status on suspend.
    Store() {
        this.dice.Store();
    }

    // Update.
    Update() {
        this.user.Update();

        // Tapped -> Roll dice.
        if (this.user.Tapped()) {
            this.dice.StartRolling();

        // Released -> Change dice or do test method.
        } else if (this.user.Released()) {

            // Released right -> Change dice type.
            if (this.user.Released().Right()) {

                // // Clear cache.
                // if (this.dice.option.Value("type") >= 3) {
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

                this.dice.StartChanging(1);

            // Released left -> Change dice type.
            } else if (this.user.Released().Left()) {
                this.dice.StartChanging(-1);

            // Released other -> Selecting dice.
            } else {
                this.dice.StartSelecting();
            }

        // Swiping -> Swiping dice.
        } else if (this.user.Swiping()) {
            if (this.user.Swiping().Right()) {
                this.dice.StartHolding(1);
            } else if (this.user.Swiping().Left()) {
                this.dice.StartHolding(-1);
            } else {
                this.dice.StartHolding(0);
            }

        // Holding -> Holding dice.
        } else if (this.user.Holding()) {
            this.dice.StartHolding(0);

        // Touching -> Selecting dice.
        } else if (this.user.Touching()) {
            this.dice.StartSelecting();
        }

        this.dice.Update();
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
