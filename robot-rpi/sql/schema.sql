DROP TABLE IF EXISTS TBL_SETTINGS;
CREATE TABLE TBL_SETTINGS(
    TYPE STRING NOT NULL PRIMARY KEY,
    CONTENT JSON NOT NULL
);