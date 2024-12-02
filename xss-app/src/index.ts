import server from './server';
import logger from './utils/logger';
import config, {checkConfigFields} from '../config';

checkConfigFields()
	.then(successMsg => {
		logger.info(successMsg);

		server.listen(config.PORT, () => logger.info(`server listening on http://localhost:${config.PORT}`));
	})
	.catch(errorMessage => {
		logger.error(errorMessage);
		process.exit(1);
	});
