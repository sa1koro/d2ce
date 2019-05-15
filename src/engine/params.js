// javascript
// D1CE Parameters component.


/* Namespace - NOBUILD */
var d1ce = d1ce || {};
/* /NOBUILD - /Namespace */


// Parameters management class.
d1ce.Params = class {

    // Constructor.
    constructor(name=null) {
        this.name = name;
        this.keyvalues = {};

        let texts = [];
        if (this.name == null) {

            // Load parameters text from query string.
            let query = window.location.search;
            if (query != null) {
                console.log("Load query:" + query);
                let text = query.slice(1);
                texts.push(text);
            }

        } else {

            // Load parameters text from message.
            let text = d1ce.Params.Instance().messages[this.name];
            if (text != null) {
                console.log("Load message:" + text);
                texts.push(text);

            // Load parameters text from local storage.
            } else {
                let text = localStorage.getItem(this.name);
                if (text != null) {
                    texts.push(text);
                }
            }
        }

        // Parse text.
        for (let i = 0; i < texts.length; ++i) {
            if (texts[i].includes('&')) {
                texts[i].split('&').forEach((q) => {
                    let keyvalue = q.split('=');
                    if (keyvalue[0] != null && keyvalue[1] != null) {
                        this.keyvalues[keyvalue[0]] = keyvalue[1];
                        // console.log("parameter:" + kv[0] + " = " + kv[1]);
                    }
                });
            } else {
                let keyvalue = texts[i].split('=');
                if (keyvalue[0] != null && keyvalue[1] != null) {
                    this.keyvalues[keyvalue[0]] = keyvalue[1];
                    // console.log("parameter:" + kv[0] + " = " + kv[1]);
                }
            }
        }
    }

    // Get keys.
    Keys() {
        return Object.keys(this.keyvalues);
    }

    // Get value.
    Value(key) {
        return this.keyvalues[key];
    }

    // Update parameters.
    UpdateValue(key, value, silent=false) {
        if (value != null) {
            this.keyvalues[key] = value;
        } else {
            delete this.keyvalues[key];
        }

        // Do not send nor save when silent update.
        if (silent) {
            return;
        }

        let keyvalues = [];
        for (let key in this.keyvalues) {
            if (key != null && this.keyvalues[key] != null) {
                keyvalues.push(key + "=" + this.keyvalues[key]);
            }
        }
        let text = keyvalues.join("&");

        if (this.name == null) {

            // Save parameters text to query string.
            let query = "?" + text;
            console.log("Save query:" + query);
            window.history.replaceState(null, "", query);
            // window.location.search = query;

        } else {

            // Save parameters text to local storage.
            localStorage.setItem(this.name, text);

            // Post parameters text to parent window.
            if (window.parent != null) {
                if (this.name == "*"
                 || this.name.match(new RegExp("^https?:\/\/"))) {
                     window.parent.postMessage(text, this.name);
                }
            }
        }
    }

    // Get instance.
    static Instance() {
        if (this.instance == null) {
            this.instance = new d1ce.Params();
            this.instance.messages = [];
        }
        return this.instance;
    }
}

// Receive parameters envent.
window.addEventListener("message", (evt) => {
    d1ce.Params.Instance().messages[evt.origin ? evt.origin : "*"] = evt.data;
}, false);


/* Parameters component test - NOBUILD */
d1ce.ParamsTest = class {

    // Main.
    static async Main() {
        document.write("<pre>\n");

        document.write("Boot Parameters.\n"
            + " p=" + d1ce.Params.Instance().Value("p")
            + " q=" + d1ce.Params.Instance().Value("q")
            + "\n");

        d1ce.Params.Instance().UpdateValue("p",
            d1ce.Params.Instance().Value("p") ? null : 1);
        d1ce.Params.Instance().UpdateValue("q",
            d1ce.Params.Instance().Value("q") ? null : 1);
        document.write("Update Boot Parameters.\n"
            + " p=" + d1ce.Params.Instance().Value("p")
            + " q=" + d1ce.Params.Instance().Value("q")
            + "\n");

        let params1 = new d1ce.Params("test");
        for (let i = 0; i < 6; ++i) {
            params1.UpdateValue(i, "value" + i);
        }
        let keys1 = params1.Keys();
        document.write("Save Parameters: ");
        for (let i = 0; i < keys1.length; ++i) {
            document.write(keys1[i] + "=" + params1.Value(keys1[i]) + ",");
        }
        document.write("\n");

        let params2 = new d1ce.Params("test");
        let keys2 = params2.Keys();
        document.write("Load Parameters: ");
        for (let i = 0; i < keys2.length; ++i) {
            document.write(keys2[i] + "=" + params2.Value(keys2[i]) + ",");
        }
        document.write("\n");

        document.write("</pre>\n");
    }
}

// window.onload = () => d1ce.ParamsTest.Main()
/* /NOBUILD - /Test */
