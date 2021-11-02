// use this host when debugging a data-fair inside a virtualbox vm
// in this case docker-compose.yml also needs a few modifications
// const host = '10.0.2.2'
const host = 'localhost'

module.exports = {
  port: 5608,
  publicUrl: 'http://localhost:5608',
  wsPublicUrl: 'ws://localhost:5608',
  directoryUrl: 'http://localhost:5608/simple-directory'
}
