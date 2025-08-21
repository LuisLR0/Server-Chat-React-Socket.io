import { createServer } from 'node:http'
import { Server } from 'socket.io'
import bdMongo from './config.js';

const httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: 'http://192.168.0.100:5173'
    },
    connectionStateRecovery: {}
});

let mensajes;

io.on('connection', async (socket) => {
    console.log(`✅ Usuario Conectado: ${socket.id}`)
    await bdMongo.Run()

    socket.on("usuarioIngresado", async (user, callBack) => {

        callBack('Usuario Recibido')

        mensajes = await bdMongo.obtenerMensajes()
        
        socket.emit('enviarMensaje', { mensajes, "user": user.User })
    })


    socket.on('disconnect', () => {
        console.log('❌ Usuario Desconectado: ' + socket.id)
        bdMongo.cerrarBaseDeDatos()
    })

    socket.on('mensajeRecibido', async (resp, callBack) => {
        
        callBack("Mensaje Recibido")

        await bdMongo.agregarMensaje(resp)
        
        mensajes = await bdMongo.obtenerMensajes()
        
        io.emit('enviarMensaje', { mensajes, "user": resp.usuario })
    })

    socket.on('mensajeEliminado', async (resp, callback) => {

        callback("Mensaje Eliminado")

        await bdMongo.borrarMensaje(resp.id)

        mensajes = await bdMongo.obtenerMensajes()
        
        io.emit('enviarMensaje', { mensajes, "user": resp.usuario })


    })

    socket.on('buscarMensajeID', async (resp, callBack) => {

        callBack("Id del mensaje recibido")

        const mensaje = await bdMongo.obtenerMensajeID(resp.id)

        socket.emit('buscarMensajeID', mensaje)

    })

    socket.on("editMensaje", async (resp, callBack) => {
        callBack("Mensaje Editado")

        await bdMongo.editarMensajeID(resp.id, resp.mensaje)

        mensajes = await bdMongo.obtenerMensajes()
        
        io.emit('enviarMensaje', { mensajes, "user": resp.usuario })
    })

})

httpServer.listen(4000, () => {
    console.log('Servidor activo en http://localhost:4000')
})