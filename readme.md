# Draw 1 Cube Engine for Saikoro.org

![Saikoro.org](https://saikoro.org/d1ce/info/icon192.png)

 * This engine is named "D1CE" (means Draw 1 Cube Engine).
 * With this engine you can easily make an interactive web app.
 * The web app "Saikoro" (means dice in Japanese) is based on it.
   * This is a sample of progressive web app (PWA).
   * It can work offline if install (only add to home screen).


## Demo

The web app "Saikoro" is released at https://saikoro.org/


## Setup

### Setup using nvm.

 1. Install nvm. (See: https://github.com/creationix/nvm)
 * `apt-get update`
 * `apt-get install build-essential libssl-dev`
 * `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash`
   * (See: https://github.com/creationix/nvm#installation-and-update)
 2. Install Node.js by nvm. `nvm install stable`
 3. Install Node.js modules by npm. `npm install`

### Setup without nvm.

 1. Install Node.js and npm. (See: https://nodejs.org/)
 2. Install Node.js modules by npm. `npm install`

### Test a web app "Saikoro".

 1. Open `src/app.html`.
 *  (Or start to publish src files by ngrok. `npm run serve`)
 *  (Access https://xxxxxx.ngrok.io/src/app.html to open `src/app.html`)

### Build a web app "Saikoro" and test.

 1. Build app from src files. `npm run build`
 2. Start to publish app by ngrok. `npm run serve`
 3. Access https://xxxxxx.ngrok.io/docs/app.html to open `docs/app.html`


## Usage

### engine.js

"D1CE" core engine.

#### async d1ce.Engine.Wait(time)
 * Wait time.
   * (See: "engine/count.js")

#### d1ce.Engine.Time()
 * Get time count.
   * (See: "engine/count.js")

#### d1ce.Engine.Random(max)
 * Get random count.
   * (See: "engine/count.js")

#### d1ce.Engine.Value(key)
 * Get parameters value.
   * (See: "engine/params.js")

#### d1ce.Engine.UpdateValue(key, value)
 * Update parameters value.
   * (See: "engine/params.js")

#### d1ce.Engine.Print(text)
 * Print text to screen.
   * (See: "engine/screen.js")

#### d1ce.Engine.Clear()
 * Clear screen.
   * (See: "engine/screen.js")

#### async d1ce.Engine.UpdateDirs()
 * Update input directions.
   * (See: "engine/input.js")

#### d1ce.Engine.Dirs(raw=false)
 * Get input directions.
   * (See: "engine/input.js", "engine/basics.js")


## License

"D1CE" is not licensed at the moment.

(C) 2018 Saikoro.org.
