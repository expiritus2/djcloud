import React, { FC, useState } from 'react';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { Track } from 'types/track';

import { Checkbox } from 'components';

import styles from './styles.module.scss';

type ComponentProps = {
    className?: string;
    track: Track;
};

const Visible: FC<ComponentProps> = (props) => {
    const { className, track } = props;
    const { modifyTrack, tracksGenres } = useStore();
    const [pending, setPending] = useState(false);

    const onVisibleChange = (e: any, id: number) => {
        setPending(true);
        modifyTrack.updateVisible({ id, visible: e.target.value }, {}, (err: AxiosError) => {
            if (!err) {
                setPending(false);
                tracksGenres.getTracksGenres();
            }
        });
    };

    return (
        <div className={classNames(styles.visible, className)}>
            <Checkbox
                pending={pending}
                name="visible"
                checked={track.visible}
                onChange={(e: any) => onVisibleChange(e, track.id)}
            />
        </div>
    );
};

export default observer(Visible);
