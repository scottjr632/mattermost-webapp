
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';

import Permissions from 'mattermost-redux/constants/permissions';
import {haveITeamPermission} from 'mattermost-redux/selectors/entities/roles';
import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';
import {GenericAction} from 'mattermost-redux/types/actions';
import {getConfig} from 'mattermost-redux/selectors/entities/general';

import {GlobalState} from 'types/store';
import {getIsLhsOpen} from 'selectors/lhs';

import Sidebar from './sidebar';

function mapStateToProps(state: GlobalState) {
    const currentTeam = getCurrentTeam(state);
    const config = getConfig(state);
    const isDataPrefechEnabled = config.ExperimentalDataPrefetch === 'true';

    let canCreatePublicChannel = false;
    let canCreatePrivateChannel = false;
    let canJoinPublicChannel = false;

    if (currentTeam) {
        canCreatePublicChannel = haveITeamPermission(state, {team: currentTeam.id, permission: Permissions.CREATE_PUBLIC_CHANNEL});
        canCreatePrivateChannel = haveITeamPermission(state, {team: currentTeam.id, permission: Permissions.CREATE_PRIVATE_CHANNEL});
        canJoinPublicChannel = haveITeamPermission(state, {team: currentTeam.id, permission: Permissions.JOIN_PUBLIC_CHANNELS});
    }

    return {
        canCreatePrivateChannel,
        canCreatePublicChannel,
        canJoinPublicChannel,
        isOpen: getIsLhsOpen(state),
        isDataPrefechEnabled,
    };
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators({
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
