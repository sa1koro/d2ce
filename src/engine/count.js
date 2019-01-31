// javascript
// D1CE Count component.


/* Namespace - NOBUILD */
var d1ce = d1ce || {};
/* /NOBUILD - /Namespace */


// Count management class.
d1ce.Count = class {

    // Constructor.
    constructor(seed=0) {
        this.time = Date.now();
        this.seed = seed != 0 ? seed : this.time;
    }

    // Wait time.
    async Wait(time) {
        if (time > 0) {

            // let start = Date.now();
            // while (Date.now() - start < time) {}
            await new Promise(r => setTimeout(r, time));
        }
    }

    // Get time count.
    Time(diff=false) {
        let time_diff = Date.now() - this.time;
        this.time = Date.now();

        return diff ? time_diff : this.time;
    }

    // Get random count.
    Random(max) {

        // Xorshift algorythm.
        this.seed = this.seed ^ (this.seed << 13);
        this.seed = this.seed ^ (this.seed >>> 17);
        this.seed = this.seed ^ (this.seed << 15);
        return Math.abs(this.seed % max);

        // LCG algorythm.
        // this.seed = (this.seed * 9301 + 49297) % 233280;
        // let rand = this.seed / 233280;
        // return Math.round(rand * max);
    }

    // Get random seed.
    Seed() {
        return this.seed;
    }

    // Set random seed.
    SetSeed(seed) {
        this.seed = seed != 0 ? seed : Date.now();
    }

    // Get instance for single count app.
    static Instance() {
        if (this.instance == null) {
            this.instance = new d1ce.Count();
        }
        return this.instance;
    }
}


/* Count component test - NOBUILD */
d1ce.CountTest = class {

    // Main.
    static async Main() {
        let count = new d1ce.Count();

        document.write("<pre>\n");

        let time = count.Time();
        document.write("Time=" + time + "\n");
        count.SetSeed(time);
        let random = count.Random(100);
        document.write("Random=" + random + "\n");

        await count.Wait(500);
        random = count.Random(100);
        document.write("Random=" + random + "\n");
        count.SetSeed(time);
        random = count.Random(100);
        document.write("Random=" + random + "\n");

        document.write("</pre>\n");
    }
}

window.onload = () => d1ce.CountTest.Main()
/* /NOBUILD - /Test */
