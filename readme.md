# D1CE

![Saikoro.org](https://saikoro.org/d1ce/info/icon192.png)

 * Embedded "D1CE" widgets give you the ability to embed web dice on your own website.
 * The web app "Saikoro" (means dice in Japanese) is based on it.
   * This is a sample of progressive web app (PWA).
   * It can work offline if install (only add to home screen).


## Demo

The web app "Saikoro" is released at https://saikoro.org/


## Usage

### How to embed web dice.

 * Copy and paste the code into the HTML of your website.
 ```
 <iframe src="https://saikoro.org/d1ce/app.html" width="300"></iframe>
 ```

### Use widget with option.

 * "type" option to set count of dice.
 ```
 <iframe src="https://saikoro.org/d1ce/app.html?type=2" width="300"></iframe>
 ```

 * "seed" option to set seed of dice face.
 ```
 <iframe src="https://saikoro.org/d1ce/app.html?type=2&seed=100" width="300"></iframe>
 ```


## Build

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


## License

"D1CE" is not licensed at the moment.

(C) 2018 Saikoro.org
