import { DataTypes } from 'sequelize';

import sequelize from '../connection';

export const Collect = sequelize.define('Collect', {
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
    collector: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profileId: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
    },
    pubId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rootProfileId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rootPubId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
    tableName: "lenshub_event_collected",
    timestamps: false
});
