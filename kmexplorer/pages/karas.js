import React from 'react'
import { i18n, Router, withNamespaces } from '../i18n'
import Link from '../utils/I18nLink';
import i18nRouterPush from '../utils/i18nRouterPush'
import Head from 'next/head'
import axios from 'axios'
import Pagination from '../components/Pagination';
import isoLanguages from '../components/isoLanguages';
import Karalist from '../components/Karalist';
import tagsMap from '../components/tagsMap.js';
import querystring from 'querystring';
import FilterTools from '../utils/filterTools';
import RuntimeConfig from '../utils/RuntimeConfig';
const BASE_URL = RuntimeConfig.BASE_URL;
const API_URL = RuntimeConfig.API_URL;
const filterTools = new FilterTools();

class Homepage extends React.Component {
  static async getInitialProps({ req, query, res }) {

    const filterParams = filterTools.init(query);
    //console.log(filterParams);

    // ici on gère l'initialisation des props en fonction des paramètres de l'urls
    const page = filterTools.getPage();
    const searchKeywords = filterTools.getKeywords();
    const searchTags = query.t ? query.t : '';

    const pageSize = 24;
    const orderBy = filterTools.getOrderBy();
    const karas = await axios.get(API_URL+'/api/karas/'+orderBy+'?'+querystring.stringify(filterTools.getApiQuery(pageSize)))

    let karaStatus = null;
    let karaPage = 0;
    let karaCount = null;
    let karaList = null;
    if(karas && karas.data && karas.data.infos)
    {
      karaStatus = true;
      karaCount = karas.data.infos.count
      karaPage = page
      karaList = karas.data.content;

      if(karaPage > karaCount/pageSize)
      {
        //console.log(filterTools.setPage(0).getQuery())
        i18nRouterPush("/karas", filterTools.reset().setPage(0).getQuery(),res);
      }
    }
    else
    {
      karaStatus = false;
    }

    let updateTime = (new Date).getTime();

    let namespacesRequired = ['common', 'tag'];

    // on renvoi ici les props qui seront disponible dans le composant monté
    return { updateTime, namespacesRequired, searchKeywords, searchTags, karaStatus, karaPage, karaCount, karaList, pageSize, filterParams, orderBy}
  }

  constructor (props) {
    // on met à jour le "State" du composant qui sert pour les comportement interne en dehors du cadre du routage url
    super(props)
    this.state = {
      loading:false,
      updateTime:props.updateTime,
      searchKeywords:props.searchKeywords,
      orderBy : props.orderBy
    }

    // on restaure les paramètres d'url coté client
    filterTools.setParams(props.filterParams);
  }

  componentWillReceiveProps(nextProps) {
    // une fois l'appli chargé, ce n'est plus le constructeur qui sera appelé en cas de mise à jour via les routes
    // getInitialProps sera bien appelé pour mettre à jour les props, mais c'est componentWillReceiveProps qui sera chargé de réagir
    if (this.props.updateTime!=nextProps.updateTime) {
      // ici si l'updateTime change on force un refresh via un setState
      // et au passage on enlève l'état loading interne
      this.setState({
        loading: false,
        updateTime: nextProps.updateTime,
        searchKeywords: nextProps.searchKeywords,
        orderBy: nextProps.orderBy
      });
    }
  }

  // Le reste est du React du plus classique

  refreshList(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({
      loading:true,
    })
    i18nRouterPush("/karas", filterTools.reset().getQuery())
  }

  updateKeyword(event) {
    // local state update of the search input field
    filterTools.reset().setKeywords(event.target.value).save();
    this.setState({
      searchKeywords: event.target.value,
    })
  }
  
  getTagDetail(id){
    return this.props.tags && this.props.tags[id] ? this.props.tags[id] : null;
  }
  getSerieDetail(id){
    return this.props.series && this.props.series[id] ? this.props.series[id] : null;
  }

  buildFilterTags(id){
    var item = this.getTagDetail(id);
    if(item)
    {
      var url = "/karas?"+querystring.stringify(filterTools.reset().removeTag('misc',id).getQuery())
      let name = item.name;
      if(name === 'NO_TAG')
        name = i18n.t("tag:no_tag");
      else if(item.code=='misc')
        name = i18n.t("tag:misc."+name);
      else if(item.code=='songtype')
        name = i18n.t("tag:songtype."+name);
      else if(item.code=='language')
        name = isoLanguages(name, i18n.language)

      return <Link href={url} key={'tag_'+id}><a data-type={item.code} className="tag">{name}</a></Link>
    }
    return null;
  }

  buildFilterSerie(id){
    let item = this.getSerieDetail(id);
    if(item)
    {
      let real_name = item.name
      if(typeof item.i18n == "object" && item.i18n.length)
      {
        item.i18n.forEach( function(v, i) {
          if(v.lang==isoLanguages("iso3",i18n.language))
          {
            real_name = v.name;
          }
        });
      }
      var url = "/karas?"+querystring.stringify(filterTools.reset().removeTag('serie',id).getQuery())
      return <Link href={url} key={'serie_'+id}><a data-type="serie" className="tag">{real_name}</a></Link>
    }
    return null;
  }

  buildFilterOrder(order, text){
    let url = "/karas?"+querystring.stringify(filterTools.reset().setOrderBy(order).getQuery());
    return <Link href={url}><a>{text}</a></Link>
  }

  render() {

    let filterSerie = (() => {
      let url = "/karas?"+querystring.stringify(filterTools.reset().removeTag('year',filterTools.params.year).getQuery());
      return filterTools.params.year
        ? <Link href={url} key="year"><a data-type="year" className="tag">{filterTools.params.year}</a></Link>
        : null
    })();

    return (
      <div>
        <Head>
          <title key="title">{i18n.t('sitename')} - {i18n.t('category.karas')}</title>
        </Head>

        <div className="kmx-filter-keyword">
          <form onSubmit={(event) => this.refreshList(event)}>
            <input type="text" value={this.state.searchKeywords} onChange={(event) => this.updateKeyword(event)} placeholder={i18n.t('form.karas_keywords_placeholder')} />
            <button type="submit"><i className="fa fa-search"></i></button>
          </form>
        </div>

        <div className="kmx-filter-panel" data-type="tags">
          {filterTools.params.tags.map((v) => { return this.buildFilterTags(v)})}
          {filterTools.params.serie ? this.buildFilterSerie(filterTools.params.serie) : null}
          {filterSerie}
        </div>

        <p>{this.props.karaCount} Karas</p>

        <div className="kmx-filter-line">
          <Pagination
            total={this.props.karaCount}
            size={this.props.pageSize}
            current={this.props.karaPage}
            renderUrl={(i) => { return "/karas?"+querystring.stringify(filterTools.reset().setPage(i).getQuery()); }}
            />
         	<div className="kmx-filter-order">
						<label>{i18n.t('form.order_by')} :</label>
						<div key="search" className={this.state.orderBy=="search" ? "active":""} >{this.buildFilterOrder('search', "A-Z")}</div>
						<div key="recent" className={this.state.orderBy=="recent" ? "active":""} >{this.buildFilterOrder('recent',i18n.t('form.updated'))}</div>
					</div>
				</div>

        <Karalist updating={this.state.loading} data={this.props.karaList} filterTools={filterTools}/>

        <Pagination
          total={this.props.karaCount}
          size={this.props.pageSize}
          current={this.props.karaPage}
          renderUrl={(i) => { return "/karas?"+querystring.stringify(filterTools.reset().setPage(i).getQuery()); }}
          />
      </div>
    )
  }
}

export default withNamespaces(['common','tag'])(Homepage)