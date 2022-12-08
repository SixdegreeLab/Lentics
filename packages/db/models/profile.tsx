import { DataTypes } from 'sequelize';
import sequelize from "../connection";

export const Profile = sequelize.define('Profile', {
    // Model attributes are defined here
    profileId: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false
    },
    contract_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    creator: {
        type: DataTypes.STRING,
        allowNull: false
    },
    to: {
        type: DataTypes.STRING,
        allowNull: false
    },
    handle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageURI: {
        type: DataTypes.STRING,
        allowNull: false
    },
    followModule: {
        type: DataTypes.STRING,
        allowNull: false
    },
    followModuleReturnData: {
        type: DataTypes.STRING,
        allowNull: false
    },
    followNFTURI: {
        type: DataTypes.STRING,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
    tableName: "lenshub_event_profilecreated",
    timestamps: false
});

