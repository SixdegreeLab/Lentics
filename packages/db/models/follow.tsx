import { DataTypes } from 'sequelize';

import sequelize from '../connection';

export const Follow = sequelize.define('Follow', {
    // Model attributes are defined here
    txHash: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
        field: 'evt_tx_hash'
    },
    txIndex: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
        field: 'evt_index'
    },
    blockTime: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'evt_block_time'
    },
    blockNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'evt_block_number'
    },
    follower: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'to'
    },
    profileId: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'profileId'
    },
    followerHandle: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'followerHandle'
    },
    followerProfileId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'followerProfileId'
    },
    timestamp: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
    tableName: "follow_transferred_vw",
    timestamps: false
});
