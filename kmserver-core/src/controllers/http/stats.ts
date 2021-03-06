import {getRequestedStats, getFavoritesStats, getPlayedStats, processStatsPayload, addPlayed} from '../../services/stats';
import { Router } from 'express';

export default function statsController(router: Router) {
	router.post('/stats', async (req, res) => {
		try {
			await processStatsPayload(req.body);
			res.status(200).json('Stats payload accepted');
		} catch(err) {
			res.status(500).json(`Error while processing stats payload : ${err}`);
		}
	});
	/*
	router.get('/stats/instances', async (_, res) => {
		try {
			res.status(200).json(await getInstanceStats());
		} catch(err) {
			res.status(500).json(`Error while retrieving instance Stats : ${err}`);
		}
	});
	*/
	router.get('/stats/played', async (req: any, res) => {
		try {
			res.status(200).json(await getPlayedStats(req.query.filter, req.query.from, req.query.size));
		} catch(err) {
			res.status(500).json(`Error while retrieving played stats : ${err}`);
		}
	});
	// Played songs are usually sent via instance data in POST /stats but this route is usable to add a single played song, for Live for example
	router.post('/stats/played', async (req: any, res) => {
		try {
			await addPlayed(req.body.seid, req.body.kid, req.body.played_at);
			res.status(200).json();
		} catch(err) {
			res.status(500).json(`Error while retrieving played stats : ${err}`);
		}
	});
	router.get('/stats/favorites', async (req: any, res) => {
		try {
			res.status(200).json(await getFavoritesStats(req.query.filter, req.query.from, req.query.size));
		} catch(err) {
			res.status(500).json(`Error while retrieving favorites : ${err}`);
		}
	});
	router.get('/stats/requested', async (req: any, res) => {
		try {
			res.status(200).json(await getRequestedStats(req.query.filter, req.query.from, req.query.size));
		} catch(err) {
			res.status(500).json(`Error while retrieving requested stats : ${err}`);
		}
	});
}
