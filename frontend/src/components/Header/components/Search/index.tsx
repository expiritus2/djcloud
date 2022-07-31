import React, { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useNavigate, useLocation, NavigateFunction } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';

import { debounce as _debounce } from 'lodash';
import { getQuery, setQuery } from 'helpers/query';
import { useScreen, useOutsideClick } from 'hooks';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    placeholder?: string;
};

const debounce = _debounce((navigate: NavigateFunction, url: string) => navigate(url), 300);

const Search: FC<ComponentProps> = (props) => {
    const { className, placeholder = 'Search' } = props;
    const [open, setOpen] = useState(false);
    const { screen } = useScreen();
    const [inputValue, setInputValue] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const query = getQuery(location);
    const fieldRef = useRef(null);

    useOutsideClick([fieldRef], () => setOpen(false));

    useEffect(() => {
        setInputValue((query.search || '') as string);
    }, [query.search]); // eslint-disable-line

    const onChange = (e: any) => {
        const { value } = e.target;
        const url = setQuery({ search: value }, location);
        debounce(navigate, url);
        setInputValue(value);
    };

    const onClickSearch = () => {
        setOpen(true);
    };

    return (
        <div
            ref={fieldRef}
            className={classNames(styles.search, screen.width >= 900 ? styles.full : styles.small, className)}
        >
            <input
                onChange={onChange}
                className={classNames(
                    styles.input,
                    screen.width >= 900 ? styles.full : styles.small,
                    open ? styles.open : '',
                )}
                type="search"
                placeholder={placeholder}
                value={inputValue}
            />
            <AiOutlineSearch
                onClick={onClickSearch}
                className={classNames(styles.searchIcon, screen.width < 900 && !open ? styles.show : styles.hide)}
            />
        </div>
    );
};

export default Search;
