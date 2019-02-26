import React from 'react'
import { i18n, withNamespaces } from '../i18n'
import Link from '../utils/I18nLink';
import isoLanguages from '../components/isoLanguages';
import querystring from 'querystring';
import RuntimeConfig from '../utils/RuntimeConfig';
import icons from '../components/Icons';
const BASE_URL = RuntimeConfig.BASE_URL;
const API_URL = RuntimeConfig.API_URL;

class Karaitem extends React.Component {

	render() {

		// Todo variante resume/detail
		// - langue index = mul detail = liste complete
		// - pas de lien vers les média en mode index

		let filterTools = this.props.filterTools;

		let kara = this.props.data
		//console.log(kara);

		let renderMode = this.props.mode ? this.props.mode : 'compact';

		let quickTagUrl = function(type,value)
		{
			return "/?"+querystring.stringify(filterTools.reset().addTag(type,value).getQuery());
		}

		//console.log(kara);

		let singers = kara.singers.map((v,i) => {
			if(v.name!=='NO_TAG')
			{
				let url = quickTagUrl('singer',v.pk_id_tag);
				return <Link href={url} key={'singer_'+i}><a data-type="singer" data-id={v.pk_id_tag}>{icons.singer} {v.name}</a></Link>
			}
		});
		let creators = kara.creators.map((v,i) => {
			if(v.name!=='NO_TAG')
			{
				let url = quickTagUrl('creator',v.pk_id_tag);
				return <Link href={url} key={'creator_'+i}><a data-type="creator" data-id={v.pk_id_tag}>{icons.creator} {v.name}</a></Link>
			}
		});
		let authors = kara.authors.map((v,i) => {
			if(v.name!=='NO_TAG')
			{
				let url = quickTagUrl('author',v.pk_id_tag);
				return <Link href={url} key={'author_'+i}><a data-type="author" data-id={v.pk_id_tag}>{icons.author} {v.name}</a></Link>
			}
		});
		let songwriters = kara.songwriters.map((v,i) => {
			if(v.name!=='NO_TAG')
			{
				let url = quickTagUrl('songwriter',v.pk_id_tag);
				return <Link href={url} key={'songwriters'+i}><a data-type="songwriter" data-id={v.pk_id_tag}>{icons.songwriter} {v.name}</a></Link>
			}
		});
		let languages = kara.languages.map((v,i) => {
			if(v.name!=='NO_TAG' && v.name!=='mul')
			{
				let url = quickTagUrl('language',v.pk_id_tag);
				return <Link href={url} key={'language'+i}><a data-type="language" data-id={v.pk_id_tag}>{icons.language} {isoLanguages(v.name, i18n.language)}</a></Link>
			}
		});
		let tags = kara.misc_tags.map((v,i) => {
			if(v.name!=='NO_TAG')
			{
				let url = quickTagUrl('tag',v.pk_id_tag);
				return <Link href={url} key={'tags'+i}><a data-type="misc" data-id={v.pk_id_tag}>{icons.tag} {i18n.t("tag:misc."+v.name)}</a></Link>
			}
		});

		let songtypes = kara.songtype.map((v,i) => {
			if(v.name!=='NO_TAG')
			{
				let url = quickTagUrl('tag',v.pk_id_tag);
				return <span key={v.pk_id_tag}>{i18n.t("tag:songtype."+v.name)}</span>
			}
		});

		// on n'exploite que la série principale
		let serie_name = kara.serie;
		//console.log(kara);
		let serie_id = kara.sid;
		if(typeof kara.serie_i18n == "object" && kara.serie_i18n[0] && kara.serie_i18n[0].length)
		{
			kara.serie_i18n[0].forEach( function(v, i) {
				if(v.lang==isoLanguages("iso3",i18n.language))
				{
					serie_name = v.name;
				}
			});
		}
		let serie = serie_name ? <Link href={quickTagUrl('serie',serie_id)} key="serie"><a data-type="serie" data-id={serie_id}><i className="fa fa-tv"></i> {serie_name}</a></Link> : null;

		let year =kara.year ? <Link href={quickTagUrl('year',kara.year)} key="year"><a data-type="year" ><i className="fa fa-calendar"></i> {kara.year}</a></Link> : null;

		//console.log(kara);

		return (
			<div className="kmx-kara-detail">
				<div className="captions">
					<div style={{backgroundImage:"url('https://kara.moe/previews/"+kara.kid+"."+kara.mediasize+".25.jpg'), url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAB3RJTUUH4QUeCAASlEDtqwAAArhQTFRFAAAA4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg////6rYzZQAAAOZ0Uk5TAAABAgMEBQYHCAkKCwwNDg8QERITFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS8wMTM0Njc5Ojs8PT4/QEFCQ0RGR0hJSktM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')"}}></div>
					<div style={{backgroundImage:"url('https://kara.moe/previews/"+kara.kid+"."+kara.mediasize+".33.jpg'), url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAB3RJTUUH4QUeCAASlEDtqwAAArhQTFRFAAAA4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg////6rYzZQAAAOZ0Uk5TAAABAgMEBQYHCAkKCwwNDg8QERITFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS8wMTM0Njc5Ojs8PT4/QEFCQ0RGR0hJSktM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')"}}></div>
					<div style={{backgroundImage:"url('https://kara.moe/previews/"+kara.kid+"."+kara.mediasize+".50.jpg'), url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAB3RJTUUH4QUeCAASlEDtqwAAArhQTFRFAAAA4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg////6rYzZQAAAOZ0Uk5TAAABAgMEBQYHCAkKCwwNDg8QERITFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS8wMTM0Njc5Ojs8PT4/QEFCQ0RGR0hJSktM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')"}}></div>
				</div>

				<h1 className="title">{kara.title}</h1>
				<p className="songtypes">{songtypes}</p>
				{
					kara.mediafile.match(/\.mp4$/)
					? (
						<div>
							<h2>{i18n.t('kara.sing_now')}</h2>
							<p>{i18n.t('kara.live_version_available')} <a target="_blank" href={"https://live.karaokes.moe/?video="+kara.kid}>{i18n.t('kara.play_in_your_browser')}</a></p>
						</div>
					)
					: null
				}
				<h2>{i18n.t('kara.informations')}</h2>
				<ul className="tags">
					<li><strong>{i18n.t('category.serie')} :</strong> {serie}</li>
					<li><strong>{i18n.t('category.language')} :</strong> {languages}</li>
					<li><strong>{i18n.t('category.tag')} :</strong> {tags}</li>
					<li><strong>{i18n.t('category.year')} :</strong> {year}</li>
					<li><strong>{i18n.t('category.singer')} :</strong> {singers}</li>
					<li><strong>{i18n.t('category.songwriter')} :</strong> {songwriters}</li>
					<li><strong>{i18n.t('category.creator')} :</strong> {creators}</li>
					<li><strong>{i18n.t('category.author')} :</strong> {authors}</li>
				</ul>
				<dl key="extra" className="extra">
					<dd key="duration" data-type="duration"><i className="fa fa-clock-o"></i> {i18n.t("kara.duration")} {Math.floor(kara.duration/60)+'m '+(kara.duration%60)+'s'}</dd>
					<dd key="ctime" data-type="ctime">{i18n.t("kara.creation_date")} 25/04/2018</dd>
					<dd key="mtime" data-type="mtime">{i18n.t("kara.modification_date")} 25/04/2018</dd>
					<dd key="kid" data-type="kid">{i18n.t('kara.karaoke_id')} : {kara.kid}</dd>
				</dl>
				<dl key="files" className="files">
					<dd key="kara" data-type="kara"><a href={API_URL+"/downloads/karas/"+kara.karafile}><i className="fa fa-file-code-o"></i> {i18n.t('kara.karafile')}</a></dd>
					<dd key="media" data-type="media"><a href={API_URL+"/downloads/medias/"+kara.mediafile}><i className="fa fa-file-video-o"></i> {i18n.t('kara.mediafile')}</a></dd>
					<dd key="lyrics" data-type="lyrics"><a href={API_URL+"/downloads/lyrics/"+kara.subfile}><i className="fa fa-file-text-o"></i> {i18n.t('kara.subfile')}</a></dd>
					<dd key="series" data-type="series"><a href={API_URL+"/downloads/series/"+kara.seriefiles[0]}><i className="fa fa-file-code-o"></i> {i18n.t('kara.seriefile')}</a></dd>
				</dl>

				<blockquote>
					<h2>{i18n.t('karaissue.title')}</h2>
					<p>{i18n.t('karaissue.baseline')}</p>
					<p><a href={"https://lab.shelter.moe/karaokemugen/karaokebase/issues/new?issuable_template=bad_time&issue[title]="+kara.title}>{i18n.t('karaissue.badtiming')} :</a> {i18n.t('karaissue.badtiming_explain')}</p>
					<p><a href={"https://lab.shelter.moe/karaokemugen/karaokebase/issues/new?issuable_template=bad_quality&issue[title]="+kara.title}>{i18n.t('karaissue.badquality')} :</a> {i18n.t('karaissue.badquality_explain')}</p>
				</blockquote>
			</div>
		)
	}
}

/*
Ema Dance
Insert

CHANTEZ SUR CE KARAOKÉ MAINTENANT !
Version Karaoke Mugen Live disponible ! Testez ce karaoké depuis votre navigateur !

INFORMATIONS
Langues :
Tags : Animé, Série TV
Série : Shirobako
Année : 2014
Interprètes : Haruka Yoshimura, Manami Numakura
Compositeurs : NO_TAG
Studios/Créateurs : P.A.Works
Auteur : Kmeuh
Durée : 0m 39s
Date de création : 2019-02-06
Date de dernière mise à jour : 2019-02-06
Identifiant du Karaoke (KID) : efe9785f-4697-47f8-b601-8c91def683df
Fichier de paroles : MUL - Shirobako - IN - Ema Dance.ass
Fichier média : MUL - Shirobako - IN - Ema Dance.mp4 (9 Mo)
Fichier métadonnées : MUL - Shirobako - IN - Ema Dance.kara
Fichiers de série : Shirobako.series.json

UN PROBLÈME ?
Un souci avec ce karaoké ? Faites-le nous savoir :

Erreur de time : Karaoké décalé, police trop petite ou illisible, erreur dans les paroles, choix des couleurs douteux...
Média de mauvaise qualité : Vidéo en basse résolution, pixélisée, son ignoble, metadata foireuses...
*/

export default withNamespaces('common')(Karaitem)