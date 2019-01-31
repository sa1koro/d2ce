// javascript
// D1CE Screen components.


/* Namespace - NOBUILD */
var d1ce = d1ce || {};
/* /NOBUILD - /Namespace */


// Screen management class.
d1ce.Screen = class {

    // Constructor.
    constructor(type=null) {
        this.root = null;

        // Setup screen.
        if (type != null) {
            let screens = document.getElementsByClassName(type);
            if (screens.length > 0) {
                for (let i = 0; i < screens.length; ++i) {
                    if (!d1ce.Screen.Instance().screens.includes(screens[i])) {
                        this.root = screens[i];
                        d1ce.Screen.Instance().screens.push(this.root);
                        break;
                    }
                }
            }
        }
        if (this.root == null){
            this.root = document.createElement("pre");
            if (type != null) {
                this.root.setAttribute("class", type);
                d1ce.Screen.Instance().screens.push(this.root);
            }
            document.body.appendChild(this.root);
        }
    }

    // Print text to screen.
    Print(text) {
        if (this.root != null) {
            this.root.appendChild(document.createTextNode(text + "\n"));
        }
    }

    // Clear screen.
    Clear() {
        if (this.root != null) {
            this.root.textContent = null;
        }
    }

    // Get instance for single screen app.
    static Instance() {
        if (this.instance == null) {
            this.instance = new d1ce.Screen();
            this.instance.screens = [];
        }
        return this.instance;
    }
}


// Sprite management class.
d1ce.Sprite = class {

    // Constructor.
    constructor(type=null) {
        this.root = null;
        this.sprite = null;
        this.type = null;
        this.anime = null;
        this.pos = null;
        this.dir = null;
        this.angle = 0;
        this.scale = 1;
        this.alpha = 1;

        // Copy asset data.
        this.root = document.createElement("div");
        this.sprite = document.createElement("div");
        this.root.appendChild(this.sprite);
        if (type != null) {
            this.sprite.setAttribute("class", type);
        }
    }

    // Enable or disable sprite.
    Enable(screen, enable) {
        if (this.root != null && screen.root != null) {
            if (enable) {
                if (!screen.root.contains(this.root)) {
                    screen.root.appendChild(this.root);
                }
            } else {
                if (screen.root.contains(this.root)) {
                    screen.root.removeChild(this.root);
                }
            }
        }
    }

    // Set sprite position vector.
    SetPos(pos) {
        if (this.root != null) {
            this.pos = pos;
            this.root.style.position = "fixed";
            this.root.style.top = this.pos.y - (this.root.clientHeight　/ 2);
            this.root.style.left = this.pos.x - (this.root.clientWidth　/ 2);
        }
    }

    // Set sprite direction vector.
    SetDir(dir) {
        if (this.root != null) {
            this.dir = dir;
            const angle_radian = 180 / Math.PI;
            this.angle = Math.atan2(this.dir.y, this.dir.x) * angle_radian;
            this.root.style.transform = "scale(" + this.scale + ")" +
                "rotate(" + this.angle + "deg)";
        }
    }

    // Set sprite angle.
    SetAngle(angle) {
        if (this.root != null) {
            this.dir = null; // Can not set direction vector.
            this.angle = angle;
            this.root.style.transform = "scale(" + this.scale + ")" +
                "rotate(" + this.angle + "deg)";
        }
    }

    // Set sprite scale.
    SetScale(scale) {
        if (this.root != null) {
            this.scale = scale;
            this.root.style.transform = "scale(" + this.scale + ")" +
                "rotate(" + this.angle + "deg)";
        }
    }

    // Set sprite aplha.
    SetAlpha(alpha) {
        if (this.root != null) {
            this.alpha = alpha;
            this.root.style.opacity = this.alpha;
        }
    }

    // Set sprite type.
    SetType(type) {
        if (this.sprite != null) {
            if (this.sprite != null && !this.sprite.classList.contains(type)) {
                this.sprite.classList.remove(this.type);
                this.sprite.classList.add(type);
                this.type = type;
            }
        }
    }

    // Set animation state.
    SetAnime(anime) {
        if (this.root != null) {
            if (this.sprite != null && !this.sprite.classList.contains(anime)) {
                this.sprite.classList.remove(this.anime);
                this.sprite.classList.add(anime);
                this.anime = anime;
            }
        }
    }
}


/* Screen components test - NOBUILD */
d1ce.ScreenTest = class {

    // Main.
    static async Main() {
        this.main_screen = new d1ce.Screen("screen");
        this.log_screen = new d1ce.Screen("screen");

        // Display sprite.
        this.log_screen.Print("Draw sprite.");
        this.cube1 = new d1ce.Sprite("cube");
        this.cube1.Enable(this.main_screen, true);

        // Transform sprite.
        this.log_screen.Print("Transform sprite.");
        this.cube2 = new d1ce.Sprite("cube");
        this.cube2.SetType("wireframe");
        this.cube2.SetAngle(45);
        this.cube2.SetScale(1.5);
        this.cube2.SetAlpha(0.5);
        this.cube2.SetPos(new d1ce.Vec(100,100));
        this.cube2.Enable(this.main_screen, true);

        // Animate sprite.
        this.log_screen.Print("Animate sprite.");
        this.cube3 = new d1ce.Sprite("cube");
        this.cube3.SetType("wireframe");
        this.cube3.SetAlpha(0.5);
        this.cube3.SetAnime("scaling");
        this.cube3.Enable(this.main_screen, true);
    }
}

window.onload = () => d1ce.ScreenTest.Main();
/* /NOBUILD - /Test */
