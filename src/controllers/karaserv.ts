import {getRawKara, getBaseStats, getKara, getAllKaras, getAllYears, newKaraIssue} from '../services/kara';
import {getTag, getTags} from '../services/tag';
import {getAllSeries} from '../services/series';
import {getSettings} from '../lib/dao/database';
import { Router } from 'express';
import {getConfig} from '../lib/utils/config';
import { postSuggestionToKaraBase } from '../lib/services/gitlab';
import { optionalAuth } from './middlewares/auth';

export default function KSController(router: Router) {
	router.route('/karas/lastUpdate')
		.get(async (_, res) => {
			try {
				const settings: any = await getSettings();
				res.send(settings.lastGeneration);
			} catch(err) {
				res.status(500).json(err);
			}
		});

	router.route('/karas')
		.get(optionalAuth, async (req: any, res) => {
			try {
				const karas = await getAllKaras(req.query.filter, req.query.from, req.query.size, null, null, null, null, req.authToken?.username);
				res.json(karas);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/stats')
		.get(async (_, res) => {
			try {
				res.json(await getBaseStats());
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/search')
		// Route used by KMApp to get Kara lists with comparison
		.post(async (req: any, res) => {
			try {
				const karas = await getAllKaras(req.body.filter, req.body.from, req.body.size, 'search', req.body.q, req.body.compare, req.body.localKaras);
				res.json(karas);
			} catch(err) {
				res.status(500).json(err);
			}
		})
		// Route used by KMExplorer
		.get(optionalAuth, async (req: any, res) => {
			try {
				console.log(req.authToken);
				const karas = await getAllKaras(req.query.filter, req.query.from, req.query.size, 'search', req.query.q, null, null, req.authToken?.username);
				res.json(karas);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/:kid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})')
		.get(optionalAuth, async (req: any, res) => {
			try {
				const kara = await getKara(null, null, null, 'kid', req.params.kid, req?.authToken?.username);
				res.json(kara);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/:kid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/raw')
		.get(async (req: any, res) => {
			try {
				const kara = await getRawKara(req.params.kid);
				res.json(kara);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/:kid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/problem')
		.post(async (req: any, res) => {
			try {
				const url = await newKaraIssue(req.params.kid, req.body.type, req.body.comment, req.body.username);
				res.status(200).json(url);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/recent')
		.get(async (req: any, res) => {
			try {
				const karas = await getAllKaras(req.query.filter, req.query.from, req.query.size,'recent');
				res.json(karas);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/tags/:tagtype([0-9]+)')
		.get(async (req: any, res) => {
			try {
				const tags = await getTags({filter: req.query.filter, type: req.params.tagtype, order: req.query.order, from: req.query.from, size: req.query.size});
				res.json(tags);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/tags')
		.get(async (req: any, res) => {
			try {
				const tags = await getTags(({filter: req.query.filter, type: null, from: req.query.from, size: req.query.size}));
				res.json(tags);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/series')
		.get(async (req: any, res) => {
			try {
				const series = await getAllSeries(req.query.filter, req.query.from, req.query.size);
				res.json(series);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/years')
		.get(async (_, res) => {
			try {
				const years = await getAllYears();
				res.json(years);
			} catch(err) {
				res.status(500).json(err);
			}
		});
	router.route('/karas/suggest')
		.post(async (req, res) => {
			try {
				if (getConfig().Gitlab.Enabled) {
					const url = await postSuggestionToKaraBase(req.body.title, req.body.serie, req.body.type, req.body.link, req.body.username, );
					res.json(url);
				} else {
					res.status(403).json('Gitlab is not enabled');
				}
			} catch(err) {
				res.status(500).json(err);
			}
		});

	router.route('/tags/:tid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})')
		.get(async (req, res) => {
			try {
				const tag = await getTag(req.params.tid, false);
				res.json(tag);
			} catch (err) {
				res.status(500).json(err);
			}
		});
}
