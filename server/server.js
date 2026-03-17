import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import { startServer } from './modules/api.js';

const API_PORT = 9000;

startServer(API_PORT);


