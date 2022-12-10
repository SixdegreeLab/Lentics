import { DataTypes } from 'sequelize';

import sequelize from '../connection';

export const Comment = sequelize.define('Comment', {
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
    profileId: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
    },
    pubId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contentUri: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'contentURI'
    },
    profileIdPointed: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pubIdPointed: {
        type: DataTypes.STRING,
        allowNull: false
    },
    collectModule: {
        type: DataTypes.STRING,
        allowNull: false
    },
    referenceModule: {
        type: DataTypes.STRING,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
    tableName: "lenshub_event_commentcreated",
    timestamps: false
});
