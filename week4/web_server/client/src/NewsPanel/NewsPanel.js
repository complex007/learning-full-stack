import './NewsPanel.css';
import NewsCard from '../NewsCard/NewsCard';
import React from 'react';
import _ from 'lodash';
class NewsPanel extends React.Component{
    constructor(){
        super();
        this.state = {news:null};
    }
    componentDidMount(){
        this.loadMoreNews();
        this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
        window.addEventListener('scroll', () => this.handleScroll());
    }
    handleScroll() {
        let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50 )) {
            console.log('Loading more news.');
            this.loadMoreNews();
        }
    }

    renderNews(){
        //if a list contains components, it requires "key" attribute to identify
        // each comoponents.
        // Then virtual DOM can quickly identify the components in the list. It
        // only re-render the modified component instead of the entire list.
        // If the "key" attribute is not provided, it will re-render the entire
        // list when any component is changed.
        const news_card_list = this.state.news.map( one_news =>{
            return(
                <div className='list-group-item' key={one_news.digest}  >
                    <NewsCard news={one_news}/>
                </div>
            );
        })
        return (
            <div className="container-fluid">
                <div className="list-group">
                    {news_card_list}
                </div>
            </div>
        );

    }
    loadMoreNews(){
        const news_url = 'http://' + window.location.hostname + ':3000' + '/news';
        const request = new Request(news_url,{method:'GET'});
        fetch(request)
        .then(res=>res.json())
        .then(fetched_news_list=>{
            this.setState((prevState)=>{
                let news = {news: prevState.news? prevState.news.concat(fetched_news_list):fetched_news_list};
                return news;
            })
        })
        
    }

    render(){
        if(this.state.news){
            return(<div>{ this.renderNews() }</div>);
        }
        else{
            return(<div id='msg-app-loading'>Loading</div>);
        }
    }

}
export default NewsPanel;