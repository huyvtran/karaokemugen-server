export const upsertInstance = `
INSERT INTO instance(
	modified_at,
	pk_iid,
	version,
	locale,
	screens,
	cpu_manufacturer,
	cpu_model,
	cpu_speed,
	cpu_cores,
	memory,
	total_disk_space,
	os_platform,
	os_distro,
	os_release,
	config)
	VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
	ON CONFLICT (pk_iid) DO UPDATE SET
	modified_at = $1,
	version = $3,
	locale = $4,
	screens = $5,
	cpu_manufacturer = $6,
	cpu_model = $7,
	cpu_speed = $8,
	cpu_cores = $9,
	memory = $10,
	total_disk_space = $11,
	os_platform = $12,
	os_distro = $13,
	os_release = $14,
	config = $15;
`;

export const deleteFavorites = `
DELETE FROM stats_favorites
WHERE fk_iid = $1;
`;

export const insertFavorite = `
INSERT INTO stats_favorites(fk_iid, fk_kid)
VALUES(
	$1,
	$2
)
`;

export const insertViewcount = `
INSERT INTO stats_played(fk_kid, fk_seid, played_at)
VALUES(
	$1,
	$2,
	$3
)
`;

export const insertRequested = `
INSERT INTO stats_requested(fk_kid, fk_seid, requested_at)
VALUES(
	$1,
	$2,
	$3
)
`;

export const wipeInstance = `
DELETE FROM instance WHERE pk_iid = $1
`;

export const insertSession = `
INSERT INTO stats_session(fk_iid, pk_seid, started_at, name)
VALUES(
	$1,
	$2,
	$3,
	$4
)
`;