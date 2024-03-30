import { Component } from 'react';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        error: false,
        loading: true
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.marvelService.getAllCharacters()
            .then(this.onCharListLoaded)
            .catch()
    }

    onCharListLoaded = (charList) => {
        this.setState({
            charList,
            loading: false
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
        const {charList, loading, error}= this.state;
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(error || loading) ? items : null;
        return (
            <div className="char__list">
                {spinner}
                {content}
                {errorMessage}
                <button className="button button__main button__long">
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