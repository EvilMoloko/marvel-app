import { useState, useEffect } from 'react';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'
import useMarvelService from '../../services/MarvelService';

import PropTypes from 'prop-types';

import './charInfo.scss';


const CharInfo = (props) => {
    
    const [char, setChar] = useState(null);

    const {loading, error, getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar()
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }
        clearError();
        getCharacter(charId)
            .then(onCharloaded)
            .then(() => {
                setProcess('confirmed');
            })
    }

    const onCharloaded = (char) => {
        setChar(char);
    }

    const setContent = (process, char) => {
        switch (process) {
            case 'waiting':
                return <Skeleton/>;
                break;
            case 'loading':
                return <Spinner/>;
                break;
            case 'confirmed':
                return <View char={char}/>;
                break;
            case 'error':
                return <ErrorMessage/>;
                break;
            default:
                throw new Error('Unexpected process state');

        }
    }

    // const skeleton = char || loading || error ? null : <Skeleton/>;
    // const errorMessage = error ? <ErrorMessage/> : null;
    // const spinner = loading ? <Spinner/> : null;
    // const content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {/* {skeleton}
            {errorMessage}
            {spinner}
            {content} */}
            {setContent(process, char)}
        </div>
    )
}

const View = ({char}) => {
    const {name, desc, thumbnail, homepage, wiki, comics} = char;
    let imgStyle = {'objectFit' : 'cover'};

    if (thumbnail.includes('image_not_available')) {
        imgStyle = {'objectFit' : 'contain'};
    }
    return (
        <>
            <div className="char__basics">
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {desc}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length > 0 ? null : 'There is no comics with this character'}
                    {
                        comics.map((item, i) => {
                            // eslint-disable-next-line
                            if (i >= 10) return;
                            return (
                                <li key={i} className="char__comics-item">
                                    {item.name}
                                </li>
                            )
                        })
                    }                
                </ul>   
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;