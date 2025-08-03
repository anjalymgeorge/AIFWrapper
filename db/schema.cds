namespace cfin.aifwrapper.db;

using {
    cuid,
    managed,

} from '@sap/cds/common';


entity rolematrix : cuid, managed {}

entity workflowid : cuid, managed {}

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
