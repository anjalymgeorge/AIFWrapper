namespace cfin.aifwrapper.db;

using {
    cuid,
    managed,

} from '@sap/cds/common';


entity rolematrix : cuid, managed {
    category        : String(30);
    categoryGroup   : String(30);
    errorClass      : String(30);
    errorNumber     : Integer;
    errorMessageV1  : String(30);
    errorMessageV2  : String(30);
    errorMessageV3  : String(30);
    errorMessageV4  : String(30);
    responsibleTeam : String(30);
}

entity workflowid : cuid, managed {
    workflowInstance: String(64);
    workflowId: Integer64;
}

/**
 * Source system details table.
 */
entity sourcesystems : cuid, managed {
    sId     : String(10);
    sysId   : String(15);
    sysName : String(20);
    env     : String(3);
}

entity applogs : cuid, managed {}
