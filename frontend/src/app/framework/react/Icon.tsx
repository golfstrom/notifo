/*
 * Notifo.io
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
 */

import * as React from 'react';

export type IconType =
    'add' |
    'alternate_email' |
    'browser' |
    'clear' |
    'code' |
    'create' |
    'dashboard' |
    'delete' |
    'error_outline' |
    'expand_less' |
    'expand_more' |
    'extension' |
    'file_copy' |
    'history' |
    'hourglass_empty' |
    'integration' |
    'keyboard_arrow_down' |
    'keyboard_arrow_left' |
    'keyboard_arrow_right' |
    'keyboard_arrow_up' |
    'mail_outline' |
    'message' |
    'messaging' |
    'mobile' |
    'more' |
    'person_add' |
    'person' |
    'photo_size_select_actual' |
    'plus' |
    'publish' |
    'refresh' |
    'search' |
    'send' |
    'settings' |
    'sms' |
    'spinner';

export interface IconProps {
    // The optional classname.
    className?: string;

    // The icon type.
    type: IconType;

    // True when spinning.
    spin?: boolean;
}

export const Icon = (props: IconProps) => {
    const { className, spin, type } = props;

    let clazz = `icon-${type}`;

    if (spin) {
        clazz += ' spin2';
    }

    if (className) {
        clazz += ' ';
        clazz += className;
    }

    return (
        <i className={clazz} />
    );
};
