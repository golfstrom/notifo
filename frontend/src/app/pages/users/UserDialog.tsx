/*
 * Notifo.io
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
 */

import { FormError, Forms, Loader, Types } from '@app/framework';
import { UpsertUserDto, UserDto } from '@app/service';
import { NotificationsForm } from '@app/shared/components';
import { CHANNELS } from '@app/shared/utils/model';
import { upsertUser, useApp, useCore, useUsers } from '@app/state';
import { texts } from '@app/texts';
import { Formik } from 'formik';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink } from 'reactstrap';

export interface UserDialogProps {
    // The user to edit.
    user?: UserDto;

    // Invoked when closed.
    onClose?: () => void;
}

export const UserDialog = (props: UserDialogProps) => {
    const { onClose, user } = props;

    const dispatch = useDispatch();
    const app = useApp()!;
    const appId = app.id;
    const coreLanguages = useCore(x => x.languages);
    const coreTimezones = useCore(x => x.timezones);
    const upserting = useUsers(x => x.upserting);
    const upsertingError = useUsers(x => x.upsertingError);
    const [tab, setTab] = React.useState(0);
    const [wasUpserting, setWasUpserting] = React.useState(false);

    React.useEffect(() => {
        if (upserting) {
            setWasUpserting(true);
        }
    }, [upserting]);

    const doCloseForm = React.useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    React.useEffect(() => {
        if (!upserting && wasUpserting && !upsertingError) {
            doCloseForm();
        }
    }, [dispatch, doCloseForm, upserting, upsertingError, wasUpserting]);

    const doSave = React.useCallback((params: UpsertUserDto) => {
        dispatch(upsertUser({ appId, params }));
    }, [dispatch, appId]);

    const initialValues: any = React.useMemo(() => {
        const result: Partial<UserDto> = Types.clone(user || {});

        result.settings ||= {};

        for (const channel of CHANNELS) {
            result.settings[channel] ||= { send: 'Inherit' };
        }

        return result;
    }, [user]);

    return (
        <Modal isOpen={true} size='lg' backdrop={false} toggle={doCloseForm}>
            <Formik<UpsertUserDto> initialValues={initialValues} enableReinitialize onSubmit={doSave}>
                {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <ModalHeader toggle={doCloseForm}>
                            <Nav className='nav-tabs2'>
                                <NavItem>
                                    <NavLink onClick={() => setTab(0)} active={tab === 0}>{user ? texts.users.editHeader : texts.users.createHeader}</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink onClick={() => setTab(1)} active={tab === 1}>{texts.common.channels}</NavLink>
                                </NavItem>
                            </Nav>
                        </ModalHeader>

                        <ModalBody>
                            {tab === 0 ? (
                                <fieldset disabled={upserting}>
                                    <Forms.Text name='id'
                                        label={texts.common.id} />

                                    <Forms.Text name='fullName'
                                        label={texts.common.name} />

                                    <Forms.Text name='emailAddress'
                                        label={texts.common.emailAddress} />

                                    <Forms.Text name='phoneNumber'
                                        label={texts.common.phoneNumber} />

                                    <Forms.Text name='threemaId'
                                        label={texts.common.threemaId} />

                                    <Forms.Text name='telegramUsername'
                                        label={texts.common.telegramUsername} />

                                    <Forms.Text name='telegramChatId'
                                        label={texts.common.telegramChatId} />

                                    <Forms.Select name='preferredLanguage' options={coreLanguages}
                                        label={texts.common.language} />

                                    <Forms.Select name='preferredTimezone' options={coreTimezones}
                                        label={texts.common.timezone} />
                                </fieldset>
                            ) : (
                                <NotificationsForm.Settings field='settings' disabled={upserting} />
                            )}

                            <FormError error={upsertingError} />
                        </ModalBody>
                        <ModalFooter className='justify-content-between'>
                            <Button type='button' color='none' onClick={doCloseForm} disabled={upserting}>
                                {texts.common.cancel}
                            </Button>
                            <Button type='submit' color='primary' disabled={upserting}>
                                <Loader light small visible={upserting} /> {texts.common.save}
                            </Button>
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};
