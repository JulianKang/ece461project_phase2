export interface ratings {
    "BusFactor": number;
    "Correctness": number;
    "RampUp": number;
    "ResponsiveMaintainer": number;
    "LicenseScore": number;
    "GoodPinningPractice": number;
    "PullRequest": number;
    "NetScore": number;
}

// from inherited code
export interface CLIOutput {
    'BUS_FACTOR_SCORE': number;
    'CORRECTNESS_SCORE': number;
    'RAMP_UP_SCORE': number;
    'RESPONSIVE_MAINTAINER_SCORE': number;
    'LICENSE_SCORE': number;
    'URL': string;
    'NET_SCORE': number;
    [key: string]: number | string;
}


////////////////////////////////////
//////////ENDPOINT SCHEMAS//////////
////////////////////////////////////
// Name of a package.
//     Names should only use typical "keyboard" characters.
//     The name "*" is reserved. See the /packages API for its meaning.
type PackageName = string;

// Unique identifier for a package.
type PackageID = string;

// The "Name" and "Version" are used as a unique identifier pair when uploading a package.
// The "ID" is used as an internal identifier for interacting with existing packages.
export interface PackageMetadata {
    Name: PackageName;
    Version: string;
    ID: PackageID | null; // null opt since endpoint /package/byRegEx does not return id, allowing reuse of this interface
}

// This is a "union" type. (in name only, implementing as an interface, may change later to actual union type if that seems better)
//     On package upload, either Content or URL should be set. If both are set, returns 400.
//     On package update, exactly one field should be set.
//     On download, the Content field should be set.
export interface PackageData {
    Content: string | null;   // null opts to check the above contitionals
    URL: string | null;       // null opts to check the above contitionals
    JSProgram: string | null; // null opts to check the above contitionals
}

// Format of Packages
export interface Package {
    metadata: PackageMetadata;
    data: PackageData;
}

// format for a user
export interface User {
    name: string;
    isAdmin: boolean;
}

type UserAuthenticationInfo = {
    password: string;
}