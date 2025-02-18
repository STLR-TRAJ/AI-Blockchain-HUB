import io from 'socket.io-client';
import { store } from '../store';
import { updateStockPrice } from '../store/slices/marketDataSlice';

class WebSocketService {
  constructor() {
    this.socket = io(process.env.REACT_APP_WS_URL);
    this.setupListeners();
  }

  setupListeners() {
    this.socket.on('stockUpdate', (data) => {
      store.dispatch(updateStockPrice(data));
    });

    this.socket.on('cryptoUpdate', (data) => {
      // Handle crypto updates
    });

    this.socket.on('forexUpdate', (data) => {
      // Handle forex updates
    });
  }

  subscribeToChannel(channel) {
    this.socket.emit('subscribe', channel);
  }

  unsubscribeFromChannel(channel) {
    this.socket.emit('unsubscribe', channel);
  }
}

export default new WebSocketService(); 