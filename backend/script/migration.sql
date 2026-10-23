-- Enum: Action
CREATE TYPE action AS ENUM ('manage', 'create', 'read', 'update', 'delete');

-- Enum: DayOfWeek
CREATE TYPE day_of_week AS ENUM ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

-- Enum: FrequencyInterval
CREATE TYPE frequency_interval AS ENUM ('daily', 'weekly', 'monthly', 'yearly');

-- Enum: Permission
CREATE TYPE permission AS ENUM ('manage', 'read', 'create', 'update', 'delete');

-- Enum: RoleType
CREATE TYPE role_type AS ENUM ('super-admin', 'project-admin', 'collector-admin', 'collector', 'lab-tech', 'user');

-- Enum: StatusType
CREATE TYPE status_type AS ENUM ('active', 'inactive', 'deleted');

-- Enum: RoleType
CREATE TYPE user_type AS ENUM ('super-admin', 'project-admin', 'collector-admin', 'collector', 'lab-tech', 'sequencing-partner');

-- Enum: VisitStatusType
CREATE TYPE visit_status_type AS ENUM ('pending', 'complete', 'overdue');

-- Enum: VisitStatus
 CREATE TYPE visit_status AS ENUM ('upcoming', 'overdue', 'completed', 'skipped');

 

-- Table: User
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    status status_type DEFAULT 'ACTIVE',
    createdAt TIMESTAMP DEFAULT now(),
    updatedAt TIMESTAMP DEFAULT now()
);

-- Table: Permission
CREATE TABLE permission (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    status status_type DEFAULT 'ACTIVE',
    createdAt TIMESTAMP DEFAULT now(),
    updatedAt TIMESTAMP DEFAULT now()
);

-- Table: Role
CREATE TABLE role (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    status status_type DEFAULT 'ACTIVE',
    createdAt TIMESTAMP DEFAULT now(),
    updatedAt TIMESTAMP DEFAULT now()
);

-- Table: RolePermissions (Join Table)
CREATE TABLE role_permissions (
    roleId UUID REFERENCES role(id),
    permissionId UUID REFERENCES permission(id),
    PRIMARY KEY (roleId, permissionId)
);

-- Table: Disease
CREATE TABLE disease (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    status status_type DEFAULT 'ACTIVE',
    createdAt TIMESTAMP DEFAULT now(),
    updatedAt TIMESTAMP DEFAULT now()
);

-- Table: Location
CREATE TABLE location (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stateName VARCHAR(255) NOT NULL,
    stateCode VARCHAR(255) NOT NULL,
    lgdCode VARCHAR(255) NOT NULL,
    districtName VARCHAR(255) NOT NULL,
    localName VARCHAR(255) NOT NULL,
    metaData JSONB,
    status status_type DEFAULT 'ACTIVE',
    createdAt TIMESTAMP DEFAULT now(),
    updatedAt TIMESTAMP DEFAULT now()
);

-- Table: Project
CREATE TABLE project (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    logisticDetails JSONB,
    processDetail VARCHAR(255),
    isOnboardingCompleted BOOLEAN DEFAULT false,
    status status_type DEFAULT 'ACTIVE',
    createdAt TIMESTAMP DEFAULT now(),
    updatedAt TIMESTAMP DEFAULT now()
);

-- Table: Site
CREATE TABLE site (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    projectId UUID REFERENCES project(id),
    collectionFrequencyInterval INTEGER NOT NULL,
    collectionFrequency INTEGER NOT NULL,
    collectionDayOfWeek day_of_week[] NOT NULL,
    collectionTime TIME,
    collectionStartDate DATE NOT NULL,
    collectionLastScheduleDate DATE,
    collectionDuration INTEGER NOT NULL,
    collectionExpiryDate DATE NOT NULL,
    photos VARCHAR[] NOT NULL,
    farmType VARCHAR(100),
    siteType VARCHAR(100),
    siteOwnerName VARCHAR(100),
    siteOwnerNumber BIGINT,
    workerNumber INTEGER,
    address VARCHAR(400),
    district VARCHAR(100),
    state VARCHAR(100),
    pinCode INTEGER,
    latitude FLOAT,
    longitude FLOAT,
    comment VARCHAR(400)
);
