import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useNavigate, useLocation, NavigateFunction } from 'react-router-dom';

import styles from './styles.module.scss';
import { debounce as _debounce } from 'lodash';
import { getQuery, setQuery } from '../../helpers/query';

type ComponentProps = {
    className?: string;
    placeholder?: string;
};

const debounce = _debounce((navigate: NavigateFunction, url: string) => navigate(url), 300);

const Search: FC<ComponentProps> = (props) => {
    const { className, placeholder = 'Search' } = props;
    const [inputValue, setInputValue] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const query = getQuery(location);

    useEffect(() => {
        setInputValue((query.search || '') as string);
    }, []); // eslint-disable-line

    const onChange = (e: any) => {
        const { value } = e.target;
        const url = setQuery({ search: value }, location);
        debounce(navigate, url);
        setInputValue(value);
    };

    return (
        <div className={classNames(styles.search, className)}>
            <input
                onChange={onChange}
                className={styles.input}
                type="search"
                placeholder={placeholder}
                value={inputValue}
            />
        </div>
    );
};

export default Search;
