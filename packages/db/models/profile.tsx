import { DataTypes } from 'sequelize';

import sequelize from '../connection';

export const Profile = sequelize.define('Profile', {
    // Model attributes are defined here
    profileId: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'to'
    },
    handle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageUri: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'imageURI'
    },
    followModule: {
        type: DataTypes.STRING,
        allowNull: false
    },
    followNftUri: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'followNFTURI'
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
    txHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'evt_tx_hash'
    },
    timestamp: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
    tableName: "profilecreated_vw",
    timestamps: false
});
