import * as grpc from '@grpc/grpc-js';
import * as  protoLoader from '@grpc/proto-loader';
import fs from 'fs';
import path from 'path'


// Pfad zur Protobuf-Datei
const PROTO_PATH = 'C:/code/backend_3d/model_3d.proto';

// Lade die Protobuf-Datei
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

const msg = grpc.loadPackageDefinition(packageDefinition);


export class Request3D {
    constructor() {
        const mb = 50;
        this.client = new msg.Model3D('localhost:50051', grpc.credentials.createInsecure(), {
            'grpc.max_receive_message_length': 1024 * 1024 * mb, // MB
            'grpc.max_send_message_length': 1024 * 1024 * mb, // MB
        });
    }

    version = () => {
        const version = 1;
        this.client.Version({ version: version }, function (err, response) {
            if (err) {
                console.log(err);
            } else {
                console.log('Version:', response.number);
            }
        });
    };

    convert = (files, res, resolve, reject) => {
        const file = fs.readFileSync(files.file[0].filepath);
        const name = files.file[0].originalFilename;
        this.client.Convert({ file: file, name: name }, (error, response) => {
            if (error) {
                console.error(error);
                res.send(500, error.message);
                reject();
            } else {
                console.log(response);
                // Hier senden wir die konvertierte Datei zurück
                res.send(response.file);
                resolve();
            }
        });
    }
}

