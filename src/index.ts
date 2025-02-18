import config from 'config'
import http from 'http'
import app from './app'
import sequalize from "./db"

const httpServer = http.createServer(app)
const serverConfig: { port: number} = config.get('server')

sequalize.sync()

httpServer.listen(serverConfig.port).on('listening', () => {
	console.log(`Server started at port ${serverConfig.port}`)
})

/**function f() {
	console.log("Hello world")
	console.log('Hello again')
}**/
