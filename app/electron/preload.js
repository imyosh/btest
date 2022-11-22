const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs')
const Store = require('secure-electron-store').default
const chokidar = require('chokidar')
const moment = require('moment')

const Watcher = require('watcher')

// Create the electron store to be made available in the renderer process
const store = new Store()

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  store: store.preloadBindings(ipcRenderer, fs),
  send: (channel, data) => {
    // whitelist channels
    let validChannels = ['selectDirectory', 'show-error-message', 'readFile']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  on: (channel, func) => {
    let validChannels = ['selectedDirectory', 'readFile-replay']
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
  clear: (channel, func) => {
    let validChannels = ['selectedDirectory']
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.removeListener(channel, func)
    }
  },

  createProjectFolder: (path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
    if (!fs.existsSync(path + '/Bounces')) {
      fs.mkdirSync(path + '/Bounces')
    }
  },

  createBouncesFolder: (path) => {
    if (!fs.existsSync(path + '/Bounces')) {
      fs.mkdirSync(path + '/Bounces')
    }
  },

  existsSync: (path) => fs.existsSync(path),

  onAddDir: (path, options, func) =>
    new Watcher(path, { ...options, renameDetection: true }).on('addDir', func),

  onRemoveDir: (path, options, func) =>
    new Watcher(path, { ...options, renameDetection: true }).on(
      'unlinkDir',
      func
    ),

  onDirRename: (path, options, func) =>
    new Watcher(path, { ...options, renameDetection: true }).on(
      'renameDir',
      func
    ),

  onAllFilesChange: (path, options, func) =>
    chokidar.watch(path, options).on('all', func),

  getLastModificationDate: (path, callback) => {
    if (fs.existsSync(path)) return callback(recursiveLastModified(path))
  },

  wasFileModified: (path, lastModifed, callback) => {
    let mod = recursiveLastModified(path)
    let previousLMM = moment(lastModifed)
    let folderLMM = moment(mod)
    let res = !folderLMM.isSame(previousLMM, 'second') //seconds granularity
    return callback(res, mod)
  },

  readFileSync: (path) => fs.readFileSync(path).buffer,
  writeFileSync: (path, data) => fs.writeFileSync(path, data),

  readFileBase64: (path) => fs.readFileSync(path).toString('base64'),
  readFile: (path) => fs.readFileSync(path),

  getIsDirectory: (path) => fs.statSync(path).isDirectory(),
  readdir: fs.readdirSync,

  getFlodersCount: (source) =>
    fs
      .readdirSync(source, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory()).length,

  getBufferFromDataUrl: (data) =>
    Buffer.from(data.split('base64,')[1], 'base64'),

  unlinkSync: fs.unlinkSync,

  removeDir: (path, callback) =>
    fs.rm(path, { recursive: true, force: true }, callback),
})

function recursiveLastModified(dir) {
  let path = require('path')
  let fs = require('fs')

  return getLastModifiedRecursive(dir)

  function getLastModifiedRecursive(candidate) {
    let stats = fs.statSync(candidate)
    let candidateTimes = [stats.mtimeMs, stats.ctimeMs, stats.birthtimeMs]
    if (stats.isDirectory()) {
      let files = fs.readdirSync(candidate)
      candidateTimes = candidateTimes.concat(
        files.map((f) => getLastModifiedRecursive(path.join(candidate, f)))
      )
    }
    return Math.max.apply(null, candidateTimes)
  }
}
