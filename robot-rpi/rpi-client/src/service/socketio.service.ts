import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import io from "socket.io-client";
import { Constant } from 'src/utils/constant';

@Injectable()
export class SocketService {
    private socketio: any;
    private connection: Subject<any> = new Subject<any>();
    private message: Subject<any> = new Subject<any>();

    connect() {
        const token = sessionStorage.getItem('token');
        this.socketio = io(Constant.SOCKET.NAMESPACE_CAR, { query: { token } });

        this.socketio.on('connect', () => {
            this.connection.next(true);
        })

        this.socketio.on('message', (data: any) => {
            this.message.next(data);
        })
    }

    onConnect() {
        return this.connection.asObservable();
    }

    onMessage() {
        return this.message.asObservable();
    }
}