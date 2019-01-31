// javascript
// D1CE Input component.


/* Namespace - NOBUILD */
var d1ce = d1ce || {};
/* /NOBUILD - /Namespace */


// Input management class.
d1ce.Input = class {

    // Constructor.
    constructor(screen=null) {
        this.dirs = [null, null];
        this.key_code = null;
        this.points = null;
        this.key_time = 0;
        this.tap_time = 0;
        this.flick_time = 0;
        this.down_event = false;
        this.up_event = false;
        this.touches = null;

        // Set element too add event listener.
        let parent = screen != null && screen.root != null ?
            screen.root : document;

        // Add event listener to anonymous function
        // to use "this" keyword in the function.
        document.addEventListener("keyup", (evt) => this.OnKeyUp(evt));
        document.addEventListener("keydown", (evt) => this.OnKeyDown(evt));
        parent.addEventListener("mousedown", (evt) => this.OnMouseDown(evt));
        parent.addEventListener("mousemove", (evt) => this.OnMouseMove(evt));
        document.addEventListener("mouseup", (evt) => this.OnMouseUp(evt));
        parent.addEventListener("touchstart", (evt) => this.OnTouch(evt), {passive: false});
        parent.addEventListener("touchmove", (evt) => this.OnTouch(evt), {passive: false});
        document.addEventListener("touchend", (evt) => this.OnTouch(evt));
        document.addEventListener("touchcancel", (evt) => this.OnTouch(evt));
        document.addEventListener("scroll", (evt) => this.OnScroll(evt));
    }

    // Generate directions from key code.
    KeyCodeToDirs(key_code) {
        const key_code_right = 39;
        const key_code_up = 38;
        const key_code_left = 37;
        const key_code_down = 40;

        // Check if pressed key is direction key.
        if (key_code == key_code_right) {
            return d1ce.Dirs.right.Clone();
        } else if (key_code == key_code_up) {
            return d1ce.Dirs.up.Clone();
        } else if (key_code == key_code_left) {
            return d1ce.Dirs.left.Clone();
        } else if (key_code == key_code_down) {
            return d1ce.Dirs.down.Clone();

        // Pressed key is not direction key.
        } else {
            return new d1ce.Dirs();
        }
    }

    // Generate directions from mouse/touch point vec.
    PointVecToDirs(vec) {
        const pi_4 = Math.PI / 4;
        const pi3_4 = Math.PI * 3 / 4;

        // Check directions.
        let theta = Math.atan2(vec.y, vec.x);
        if (-pi_4 < theta && theta <= pi_4) {
            return d1ce.Dirs.right.Clone();
        } else if (-pi3_4 < theta && theta <= -pi_4) {
            return d1ce.Dirs.up.Clone();
        } else if (pi3_4 < theta || theta <= -pi3_4) {
            return d1ce.Dirs.left.Clone();
        } else if (pi_4 < theta && theta <= pi3_4) {
            return d1ce.Dirs.down.Clone();
        }
        return new d1ce.Dirs();
    }

    // Update and wait input event.
    // - timeout: Timeout time for tap/flick check.
    // - radius2: Play radius for tap/flick check.
    // - depth: Far depth for press check.
    async UpdateDirs(timeout=1000, radius2=50*50, depth=0.5) {
        let time = Date.now();

        // No input.
        if (this.key_code <= 0 && this.points == null) {
            this.dirs[0] = null;
            this.key_time = time;
            this.tap_time = time;
            this.flick_time = time;

        // Key input.
        } else if (this.key_code > 0) {
            this.dirs[0] = this.KeyCodeToDirs(this.key_code);
            // console.log("Key input:" + this.tap_time + " " + time);

            // Timeout check.
            if (this.key_time <= time - timeout) {
                this.dirs[0].Add(d1ce.Dirs.far);
            }

        // Mouse/Touch input.
        } else if (this.points != null) {

            // Play radius check.
            let vec = this.points[1].Clone().Sub(this.points[0]);
            if (radius2 <= 0 || vec.LenSq() >= radius2) {

                // Flick/Swiping.
                this.dirs[0] = this.PointVecToDirs(vec);

                // Ignore tap after point out of play radius.
                this.tap_time = time - timeout;

                // Timeout or Far depth check.
                if (this.flick_time <= time - timeout || this.points[1].z >= depth) {
                    this.dirs[0].Add(d1ce.Dirs.far);

                    // Ignore flick after point reach to far depth.
                    this.flick_time = time - timeout;
                }
            } else {

                // Tap/Touching.
                this.dirs[0] = new d1ce.Dirs();

                // Timeout or Far depth check.
                if (this.tap_time <= time - timeout || this.points[1].z >= depth) {
                    this.dirs[0].Add(d1ce.Dirs.far);

                    // Ignore tap/flick after point reach to far depth.
                    this.tap_time = time - timeout;
                    this.flick_time = time - timeout;
                }
            }
            // console.log("Mouse/Touch input:" + this.tap_time + " " + time);
        }

        // On down event, only update status.
        if (this.down_event) {
            console.log("Down Event:" + this.dirs[0].ToString());
            this.dirs[1] = null;
            this.down_event = false;

        // On up event, update status and return dirs.
        } else if (this.up_event) {
            console.log("Up Event:" + this.dirs[0].ToString());
            this.dirs[1] = this.dirs[0];
            this.up_event = false;

        // On after up event.
        } else if (this.dirs[1] != null) {
            console.log("Up Event End.");
            this.dirs[0] = null;
            this.dirs[1] = null;
            this.key_code = null;
            this.points = null;
        }
    }

    // Get input directions.
    Dirs(raw=false) {
        if (this.dirs[raw ? 0 : 1] != null) {
            return this.dirs[raw ? 0 : 1].Clone();
        }
        return null;
    }

    // Get mouse/touch point position.
    Point(raw=false) {
        if (this.points != null) {
            return this.points[raw ? 0 : 1].Clone();
        }
        return null;
    }

    // Set input direction directly.
    SetDirs(dirs) {
        this.dirs[0] = dirs;
        this.dirs[1] = dirs;
    }

    // Key down event handler.
    OnKeyDown(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        this.key_code = evt.keyCode;
        this.down_event = true;
        // console.log("event:" + evt.type + " keycode:" + evt.keyCode)
    }

    // Key up event handler.
    OnKeyUp(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        this.key_code = evt.keyCode;
        this.up_event = true;
        // console.log("event:" + evt.type + " keycode:" + evt.keyCode)
    }

    // Update point on down event.
    UpdatePointOnDown(pos) {
        this.points = [pos.Clone(), pos.Clone()];
        this.down_event = true;
        // console.log("Down:" + pos.ToString());
    }

    // Update point on move event.
    UpdatePointOnMove(pos) {
        if (this.points != null) {
            this.points[1] = pos.Clone();
        }
        // console.log("Move:" + pos.ToString());
    }

    // Update point on up event.
    UpdatePointOnUp(pos) {
        if (this.points != null) {
            this.points[1] = pos.Clone();
            this.up_event = true;
        }
        // console.log("Up:" + pos.ToString());
    }

    // Mouse down event handler.
    OnMouseDown(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        let mouse = new d1ce.Vec(evt.pageX, evt.pageY);
        this.UpdatePointOnDown(mouse);
        // console.log("event:" + evt.type + " " + mouse.ToString());
    }

    // Mouse move event handler.
    OnMouseMove(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        let mouse = new d1ce.Vec(evt.pageX, evt.pageY);
        this.UpdatePointOnMove(mouse);
        // console.log("event:" + evt.type + " " + mouse.ToString());
    }

    // Mouse up event handler.
    OnMouseUp(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        let mouse = new d1ce.Vec(evt.pageX, evt.pageY);
        this.UpdatePointOnUp(mouse);
        // console.log("event:" + evt.type + " " + mouse.ToString());
    }

    // Touch down/move/up/cancel event handler.
    OnTouch(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();

        // Touch down first finger.
        if (this.touches == null && evt.touches.length > 0) {
            this.touches = [];
            let touch = new d1ce.Vec();
            for (let i = 0; i < evt.touches.length; ++i) {
                this.touches.push(evt.touches[i]);
                touch.Add(new d1ce.Vec(evt.touches[i].pageX,
                                       evt.touches[i].pageY,
                                       evt.touches[i].force));
            }
            touch.Div(evt.touches.length);
            this.UpdatePointOnDown(touch);

            // console.log("1:" + evt.touches.length + " " + touch.ToString());

        // Touch down/up additinal finger or touch move.
        } else {
            let touches_next = [];
            let move_vec = new d1ce.Vec();
            let move_count = 0;
            for (let i = 0; i < evt.touches.length; ++i) {
                touches_next.push(evt.touches[i]);
                for (let j = 0; j < this.touches.length; ++j) {
                    if (evt.touches[i].identifier == this.touches[j].identifier) {
                        move_vec.x += evt.touches[i].pageX - this.touches[j].pageX;
                        move_vec.y += evt.touches[i].pageY - this.touches[j].pageY;
                        move_vec.z += evt.touches[i].force - this.touches[j].force;
                        move_count += 1;
                    }
                }
            }

            // Touch move.
            if (this.points != null) {
                if (move_count > 0) {
                    let touch = this.points[1].Add(move_vec.Clone().Div(move_count));
                    this.UpdatePointOnMove(touch);
                    this.touches = touches_next;

                    // console.log("2:" + evt.touches.length + " " + touch.ToString() +
                    //     " " + move_vec.ToString() + " " + move_count);

                // Touch up last finger.
                } else {
                    let touch = this.points[1];
                    this.UpdatePointOnUp(touch);
                    this.touches = null;

                    // console.log("3:" + evt.touches.length + " " + touch.ToString());
                }
            }
        }
    }

    // Scroll event handler.
    OnScroll(evt) {
        evt = evt != null ? evt : window.event;
        evt.preventDefault();
        console.log("event:" + evt.type)
    }

    // Get instance for single input app.
    static Instance() {
        if (this.instance == null) {
            this.instance = new d1ce.Input();
        }
        return this.instance;
    }
}


/* Input component test - NOBUILD */
d1ce.Test = class {

    // Main.
    static async Main() {
        this.log_screen = new d1ce.Screen("screen");
        this.main_screen = new d1ce.Screen("screen");
        this.input = new d1ce.Input(this.main_screen);

        while (true) {
            this.log_screen.Clear();
            this.input.UpdateDirs();
            if (this.input.Dirs(true) != null) {
                this.log_screen.Print("Dirs: " +
                    this.input.Dirs(true).ToString());
                if (this.input.Dirs() != null) {
                    this.log_screen.Print("Trigger: " +
                        this.input.Dirs().ToString());
                }
            } else {
                this.log_screen.Print("No Input.");
            }
            await new Promise(r => setTimeout(r, 1000/60));
        }
    }
}

window.onload = () => d1ce.Test.Main();
/* /NOBUILD - /Test */
