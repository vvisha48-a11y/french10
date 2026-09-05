// Registers a Web App in the Firebase project, saves its config, and rebuilds the clone.
//
//   firebase login          <-- you must run this yourself first (Google OAuth)
//   node setup-firebase-app.js
//
// Re-running is safe: if a web app with the same name already exists it is reused
// rather than a duplicate being created.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT = process.argv[2] || 'visha-119e0';
const APPNAME = 'French Class 10 Web';
const CONFIG_FILE = path.join(__dirname, 'firebase-config.js');

const fb = (args, quiet) => {
  try {
    return execFileSync('firebase', args.concat(['--project', PROJECT]),
      { encoding: 'utf8', stdio: quiet ? ['ignore','pipe','pipe'] : ['ignore','pipe','inherit'], shell: true });
  } catch (e){
    const out = String(e.stdout || '') + String(e.stderr || '');
    throw new Error('firebase ' + args.join(' ') + '\n' + out.slice(0, 800));
  }
};

/* 0. logged in? */
let who = '';
try { who = execFileSync('firebase', ['login:list'], { encoding: 'utf8', shell: true }); } catch (e){ who = ''; }
if (/No authorized accounts/i.test(who) || !who.trim()){
  console.error('Not logged in. Run:  firebase login');
  process.exit(2);
}
console.log('  account          :', (who.match(/\[.*?\]\s*(\S+@\S+)/) || who.match(/(\S+@\S+)/) || ['', '(unknown)'])[1]);
console.log('  project          :', PROJECT);

/* 1. find or create the web app */
let list = [];
try { list = JSON.parse(fb(['apps:list', 'WEB', '--json'], true)).result || []; } catch (e){ list = []; }
let app = list.find(a => a.displayName === APPNAME) || list[0];
if (app){
  console.log('  web app          : reusing "' + app.displayName + '" (' + app.appId + ')');
} else {
  console.log('  web app          : creating "' + APPNAME + '"…');
  fb(['apps:create', 'WEB', APPNAME], true);
  list = JSON.parse(fb(['apps:list', 'WEB', '--json'], true)).result || [];
  app = list.find(a => a.displayName === APPNAME) || list[0];
  if (!app) throw new Error('web app was created but could not be read back');
  console.log('  web app          : created (' + app.appId + ')');
}

/* 2. pull the SDK config */
const raw = fb(['apps:sdkconfig', 'WEB', app.appId, '--json'], true);
let cfg = JSON.parse(raw);
cfg = (cfg.result && (cfg.result.sdkConfig || cfg.result)) || cfg;
['apiKey','authDomain','projectId','appId'].forEach(k => {
  if (!cfg[k]) throw new Error('config is missing ' + k + ' — got: ' + JSON.stringify(cfg).slice(0, 300));
});

const body = 'const firebaseConfig = ' + JSON.stringify(cfg, null, 2)
  .split('\n').map((l, i) => i === 0 ? l : '  ' + l).join('\n') + ';';
fs.writeFileSync(CONFIG_FILE, body + '\n');
console.log('  config saved     : firebase-config.js');
console.log('  projectId        :', cfg.projectId);

/* 3. rebuild the clone with the real config, then gate it */
console.log('');
execFileSync(process.execPath, ['make-firebase-clone.js'], { cwd: __dirname, stdio: 'inherit' });
console.log('');
execFileSync(process.execPath, ['check-clone.js'], { cwd: __dirname, stdio: 'inherit' });
