# D1CE

"D1CE" means Draw 1 Cube Engine.

 * Embedded widgets give you the ability to embed web dice on your own website.


## Demo

The web app "Saikoro" (means dice in Japanese) is based on "D1CE" and released at https://saikoro.org/

 * This is a sample of progressive web app (PWA).
 * It can work offline if install (only add to home screen).


## Usage

### Embed web dice.

Copy and paste the code into the HTML of your website.

```
 <iframe src="https://saikoro.org/d1ce/app.html" width="300" height="300"></iframe>
```

Or customize query parameters like the code below if use options.

```
 <iframe src="https://saikoro.org/d1ce/app.html?type=2" width="300" height="300"></iframe>
 <iframe src="https://saikoro.org/d1ce/app.html?type=2&seed=100" width="300" height="300"></iframe>
```

<details>
<summary>
See details of options.
</summary>

All query parameters are separated by `&` like below.

```
?type=2
?type=2&seed=100
```

 * `type` parameter specifies type of dice.
     * Set dice count 1〜9 in `type` parameter.
     * ~~(not implemented) Or set dice count 1〜9 and `d` + dice face maximum number (likes `2d6`) in `type` parameter.~~
 * `seed` parameter specifies random seed of dice face.
     * Set non zero number in `seed` parameter.
 * ~~(not implemented) `face` parameters specify dice faces one by one.~~
     * ~~Set numbers separated by `,` in `face` parameter.~~

</details>

### Receive rolled dice faces.

Receive return values from message event.

<details>
<summary>
See details of return values.
</summary>

 * Recommend to check message origin for security.
 * Message body is URL query parameter format w/o `?`. All parameters in return values are separated by `&` like below.

```
face=1,2&type=2&seed=100
```

 * `face` parameters return dice faces one by one.
     * Set numbers separated by `,` in `face` parameter.
 * *(experimental feature)* `type` parameter returns count and type of dice.
     * Set number 1〜9 in `type` parameter.
     * ~~(not implemented) Or set number 1〜9 and `d` + dice face maximum number (likes `2d6`) in `type` parameter.~~
 * *(experimental feature)* `seed` parameter returns random seed of dice face.
     * Set non zero number in `seed` parameter.

</details>

*(experimental feature)* Import `d1ce/engine.js` and construct `d1ce.Params(origin)`, you can easily parse return values from message body like below.

```
 <script type="text/javascript" src="https://saikoro.org/d1ce/engine.js"></script>
 <script type="text/javascript">
     window.addEventListener("message", (evt) => {
         if (evt.origin == "https://saikoro.org") {
             let params = new d1ce.Params(evt.origin);
             console.log("face:" + params.Value("face"));
         }
     }, false);
 </script>
```

Be care that `origin` was set `*` when local test.


## Build

<details>

<summary>
See details about build this engine.
</summary>

### Setup using nvm.

 1. Install nvm.
     * `apt-get update`
     * `apt-get install build-essential libssl-dev`
     * `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash`
         * See: https://github.com/creationix/nvm#installation-and-update
 2. Install Node.js by nvm.
     * `nvm install stable`
 3. Install Node.js modules by npm.
     * `npm install`

### Setup without nvm.

 1. Install Node.js and npm.
     * See: https://nodejs.org/
 2. Install Node.js modules by npm.
     * `npm install`

### Test "D1CE" widgets.

 1. Open `src/app.html`
     *  Or start to publish source files by ngrok.
         * `npm run serve`
     *  Access `https://xxxxxx.ngrok.io/src/app.html` to open `src/app.html`

### Build packaged "D1CE" widgets and test.

 1. Build a package from source files.
     * `npm run build`
 2. Start to publish widgets by ngrok.
     * `npm run serve`
 3. Access `https://xxxxxx.ngrok.io/d1ce/app.html` to open `d1ce/app.html`

</details>


## License

"D1CE" is not licensed at the moment.

©︎ 2019 Saikoro.org
