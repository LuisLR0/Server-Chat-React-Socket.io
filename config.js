import { ObjectId } from "mongodb";
import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017"

const dbName = "react-chat"

class MongoDBConexion {

    constructor(nombreBD, urlBD) {
        this.nombreBD = nombreBD;
        this.urlBD = urlBD;
        this._db = null;
        this.client = null;
    }

    Run = async () => {

        this._client = new MongoClient(this.urlBD)
        
        try {
    
            await this._client.connect()
            console.log("MongoDB Conectado")
            
            this._db = this._client.db(this.nombreBD)
            console.log(`Base de datos seleccionado: ${this.nombreBD}`)

        } catch (error) {
            console.log("Hubo un error:")
            console.log(error)
        }

    }

    agregarMensaje = async (msg) => {

        try {

            const coleccion = this._db.collection('mensajes')

            await coleccion.insertOne({
                "usuario": msg?.usuario,
                "mensaje": msg?.msg
            })
            
        } catch (error) {
            console.log("Hubo un error al agregar mensaje:")
            console.log(error)
        }

    }

    obtenerMensajes = async () => {

        try {

            const coleccion = this._db.collection('mensajes')

            const mensajes = await coleccion.find().toArray()

            return mensajes
            
        } catch (error) {
            console.log("Hubo un error al obtener mensaje:")
            console.log(error)
        }

    }

    obtenerMensajeID = async (id) => {

        try {

            const coleccion = this._db.collection('mensajes')

            const idMensaje = new ObjectId(id)

            const mensaje = await coleccion.find({"_id": idMensaje}).toArray()

            return mensaje
            
        } catch (error) {
            console.log("Hubo un error al obtener un mensaje por ID")
            console.log(error)
        }

    }

    editarMensajeID = async (id, mensaje) => {

        try {

            const coleccion = this._db.collection('mensajes')

            const idMensaje = new ObjectId(id)

            await coleccion.updateOne({"_id": idMensaje}, { $set: { "mensaje": mensaje } })
            
        } catch (error) {
            console.log("Hubo un error al Editar el mensaje: " + id)
            console.log(error)
        }

    }

    borrarMensaje = async (id) => {

        try {

            const coleccion = this._db.collection('mensajes')
            const objectID = new ObjectId(id)

            await coleccion.deleteOne({"_id": objectID})
            
        } catch (error) {
            console.log("Hubo un error al eliminar el mensaje")
            console.log(error)
        }

    }

    cerrarBaseDeDatos = async () => {
        try {
            this._client.close()
            console.log("Base de Datos Cerrada")
        } catch (error) {
            console.log("Hubo un error al cerrar la base de datos:")
            console.log(error)
        }
    }

}

const bdMongo = new MongoDBConexion(dbName, url)

export default bdMongo