import 'dotenv/config';
import checkObjectValuesNotNull from '../src/utils/checkObjectValuesNotNull';

const config = {
	PORT: process.env.PORT ?? 3000,
	ALLOWED_ORIGINS: '*',
	LOGGER: {
		LEVEL: 'debug',
		SAVE_TO_FILE: false,
		FILE: 'app.log'
	},
} as const;

const checkConfigFields = (): Promise<string> => {
	const nullConfigFieldPath = checkObjectValuesNotNull(config);

	if (typeof nullConfigFieldPath === 'string') {
		return Promise.reject(`config field (config.${nullConfigFieldPath}) is null or undefined`);
	}

	return Promise.resolve('checking config values: OK');
}

export {checkConfigFields};

export default config;
