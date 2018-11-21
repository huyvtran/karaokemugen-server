import {asyncReadFile} from '../_utils/files';
import testJSON from 'is-valid-json';
import {basename} from 'path';
import {initValidators, check} from '../_utils/validators';
import {uuidRegexp} from '../_services/constants';

const header = {
	version: 3,
	description: 'Karaoke Mugen Series File'
};

const seriesConstraintsV2 = {
	name: {presence: {allowEmpty: false}},
	aliases: {seriesAliasesValidator: true},
	sid: {presence: true, format: uuidRegexp},
	i18n: {seriesi18nValidator: true}
};

export async function getDataFromSeriesFile(file) {
	let seriesFileData;
	try {
		seriesFileData = await asyncReadFile(file, 'utf-8');
	} catch(err) {
		throw `Unable to read series file : ${file}`;
	}
	if (!testJSON(seriesFileData)) throw `Syntax error in file ${file}`;
	const seriesData = JSON.parse(seriesFileData);
	if (header > +seriesData.header) throw `Series file is too old (version found: ${seriesData.header.version}, expected version: ${header.version})`;
	const validationErrors = seriesDataValidationErrors(seriesData.series);
	if (validationErrors) {
		throw `Series data is not valid: ${JSON.stringify(validationErrors)}`;
	}
	seriesData.series.seriefile = basename(file);
	return seriesData.series;
}

export function seriesDataValidationErrors(seriesData) {
	initValidators();
	return check(seriesData, seriesConstraintsV2);
}

export function findSeries(serie, seriesData) {
	return seriesData.find(s => {
		return s.name === serie;
	});
}