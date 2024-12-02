import express, {Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import requestLogger from './middlewares/requestLogger';
import {NOT_FOUND, SUCCESS} from './utils/httpCodeResponses/messages';
import config from '../config';
import {Server} from 'socket.io'
import logger from './utils/logger';
import Post from './types/Post';
// import sanitizeUserInput from './utils/sanitizeUserInput';
import path from 'path';
import formatDate from './utils/formatDate';

const app = express();

const messages: Array<Post> = [];

/* socket.io server setup */
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
	cors: {origin: config.ALLOWED_ORIGINS}
});

io.on('connection', client => {
	logger.info(`client (ID=${client.id}) connected`);

	client.on('message', (msg: string) => {

		logger.info(`client (ID=${client.id}) sent message: ${msg}`);

		const newMessage: Post = {
			clientId: client.id,
			content: msg, 
			timestamp: new Date()
		};

		messages.push(newMessage);

		client.broadcast.emit('new-message', newMessage);
	});

	client.on('disconnect', () => logger.info(`client (ID=${client.id}) disconnected`));
});

/* basic express config */
app.use(cors({
	origin: config.ALLOWED_ORIGINS,
	credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

/* view engine */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* static folder */
app.use(express.static(path.join(__dirname, 'public')));

/* main router */
app.get('/', (req: Request, res: Response) => {
	const queryParams = Object.entries(req.query).map(([name, value]) => ({
		name,
		value
	}));

	res.render('index', {
        queryParams,
        messages,
        formatDate
    })
});

app.use('/api', (req: Request, res: Response) => SUCCESS(res, 'Hello world', {method: req.method}));

/* 404 Not Found handler */
app.use('*', (req, res) => NOT_FOUND(res));

export default httpServer;
