import React from 'react'
import { i18n, withNamespaces } from '../i18n'
import i18nRouterPush from '../utils/i18nRouterPush'
import isoLanguages from '../components/isoLanguages';
import Head from 'next/head'
import axios from 'axios'
import Pagination from '../components/Pagination';
import DedicatedTagtList from '../components/DedicatedTagList';
import tagsMap from '../components/tagsMap.js';
import querystring from 'querystring';
import FilterTools from '../utils/filterTools';
const filterTools = new FilterTools();


class Page extends React.Component {
	static async getInitialProps({ req, query, res }) {

		let namespacesRequired = ['common', 'tag'];

		return { namespacesRequired };
	}

	constructor (props) {
		super(props)
		this.state = {
			searchKeywords:"",
		}
		filterTools.setParams(props.filterParams);
	}

	componentWillUpdate(nextProps, nextState) {
		filterTools.setParams(nextProps.filterParams);
	}

	updateKeyword(event) {
	    // local state update of the search input field
	    filterTools.reset().setKeywords(event.target.value).save();
	    this.setState({
	    	searchKeywords: event.target.value,
	    })
	}

	render() {
		let kmax = 1;
		let keywords = this.state.searchKeywords;

		let tagList = [];
		for (let id in this.props.tags) {
			let tag = this.props.tags[id];
			if(tag.code=="language")
			{
				kmax = Math.max(kmax,tag.karacount);
				tag.real_name = isoLanguages(tag.name, i18n.language)
				if(keywords.length==0 || filterTools.keywordSearch(tag.real_name,keywords) || filterTools.keywordSearch(tag.name,keywords))
					tagList.push(tag);
			}
		}

		tagList.sort(function(a,b){
			return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
		})

		tagList = tagList.map(function(tag){
			return {
				key: tag.tid,
				name : tag.real_name,
				karacount : tag.karacount,
				link : "/karas?"+querystring.stringify(filterTools.clear().addTag('language',tag.tid).getQuery()),
				height : 100 * tag.karacount / kmax
			};
		})

		return (
			<div>
				<Head>
					<title key="title">{i18n.t('sitename')} - {i18n.t('category.languages')}</title>
				</Head>

				<div className="kmx-filter-keyword">
					<form onSubmit={(event) => event.preventDefault()}>
						<input type="text" value={keywords} onChange={(event) => this.updateKeyword(event)} placeholder={i18n.t('form.tags_keywords_placeholder')} />
						<button type="submit"><i className="fa fa-search"></i></button>
					</form>
				</div>

				<DedicatedTagtList type="languages" tags={tagList} />
			</div>
			)
	}
}

export default withNamespaces(['common','tag'])(Page)