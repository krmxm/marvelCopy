import { Component } from 'react';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        error: false,
        loading: true,
        offset: 210,
        newCharLoading: false,
        charEnded: false,
        pageEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();

        window.addEventListener('scroll', this.checkingPageEnded);
        window.addEventListener('scroll', this.onUpdateCharListByScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.checkingPageEnded);
        window.removeEventListener('scroll', this.onUpdateCharListByScroll);
    }

    checkingPageEnded = () => {
        if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.offsetHeight - 3) {
            this.setState({
                pageEnded: true
            })
        }
    }

    onUpdateCharListByScroll = () => {
        const {pageEnded, newCharLoading, charEnded, offset} = this.state;
        if(pageEnded && !newCharLoading && !charEnded) {
            this.onCharListLoading();
            this.onRequest(offset);
        }
        if(charEnded) {
            window.removeEventListener('scroll', this.checkingPageEnded);
            window.removeEventListener('scroll', this.onUpdateCharListByScroll);
        }
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch()
    }

    onCharListLoaded = (newCharItems) => {
        let ended = this.marvelService._totalItem - this.state.offset <= 9;
        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharItems],
            loading: false,
            offset: offset + 9,
            newCharLoading: false,
            charEnded: ended,
            pageEnded: false
        }))
    }

    onCharListLoading = () => {
        this.setState({
            newCharLoading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    renderItems = (items) => {
        const newArr = items.map(item => {
            const {id, ...itemsOptions} = item;
            return(
                <CharItem key={id} id={id} {...itemsOptions} onClick={this.props.onSelectedChar}/>
            )
        })

        return(
            <ul className="char__grid">
                    {newArr}
            </ul>
        )
    }
    
    
    render() {
        const {charList, loading, error, offset, newCharLoading, charEnded}= this.state;
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(error || loading) ? items : null;
        return (
            <div className="char__list">
                {spinner}
                {content}
                {errorMessage}
                <button 
                    className="button button__main button__long"
                    disabled={newCharLoading}
                    onClick={() => this.onRequest(offset)}
                    style={{'display': charEnded ? 'none' : 'block'}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    } 
}

const CharItem = ({name, thumbnail, id, onClick}) => {
    const imgStyle = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? {'objectFit': 'contain'} : {'objectFit': 'cover'};

    const li = 
        <li className="char__item" onClick={() => onClick(id)}>
            <img src={thumbnail} alt="abyss" style={imgStyle}/>
            <div className="char__name">{name}</div>
        </li>

    return li;
}

export default CharList;