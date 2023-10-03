import {useState, useEffect} from 'react';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import PropTypes from 'prop-types';

import './charList.scss';


const CharList = (props) => {

    const [charList,setCharlist] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState();
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListloaded)
    }

    const onCharListloaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }

        setCharlist(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    function renderItems(arr) {
        const items =  arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail.includes('image_not_available')) {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    tabIndex={0}
                    className="char__item"
                    key={item.id}
                    onFocus={(e) => (onFocusBlurCharItem(e))}
                    onBlur={(e) => (onFocusBlurCharItem(e))}
                    onClick={() => props.onCharSelected(item.id)}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const onFocusBlurCharItem = (e) => {
        e.currentTarget.classList.toggle('char__item_selected');
    }
    
        const characters = renderItems(charList);
        
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading && !newItemLoading ? <Spinner/> : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {characters}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;