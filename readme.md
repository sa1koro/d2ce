# D1CE


## Summary:

"D1CE" means Draw 1 Cube Engine.
 * It can build interactive web app easily.
 * Sample app "Saikoro" includes.


## Usage:

### How to build

 1. Install Node.js and npm.
 2. Install modules. `npm install`
 3. Run build script. `npm run build`

### Test sample web app.

 1. Open `app.html` by web browser.

### Test sample web app by web server.

 1. Start web server. `npm run serve`
 2. Access `localhost:8080` by web browser.


## Reference:

### engine.js

"D1CE" core engine.

#### async d1ce.Engine.Wait(time)
Wait time.
See also: "engine/count.js".

#### d1ce.Engine.Time()
Get time count.
See also: "engine/count.js".

#### d1ce.Engine.Random(max)
Get random count.
See also: "engine/count.js".

#### d1ce.Engine.Value(key)
Get parameters value.
See also: "engine/params.js".

#### d1ce.Engine.UpdateValue(key, value)
Update parameters value.
See also: "engine/params.js".

#### d1ce.Engine.Print(text)
Print text to screen.
See also: "engine/screen.js".

#### d1ce.Engine.Clear()
Clear screen.
See also: "engine/screen.js".

#### async d1ce.Engine.UpdateDirs()
Update input directions.
See also: "engine/input.js".

#### d1ce.Engine.Dirs(raw=false)
Get input directions.
See also: "engine/input.js" and "engine/basics.js".
