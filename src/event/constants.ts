export enum EventType {
    CREATE_PROJECT = 'CREATE_PROJECT',
    UPDATE_PROJECT = 'UPDATE_PROJECT',
    DELETE_PROJECT = 'DELETE_PROJECT',
    CREATE_TASK = 'CREATE_TASK',
    UPDATE_TASK = 'UPDATE_TASK',
    DELETE_TASK = 'DELETE_TASK',
    ASSIGN_TASK = 'ASSIGN_TASK',
    UNASSIGN_TASK = 'UNASSIGN_TASK',
    GOT_ASSIGNMENT = 'GOT_ASSIGNMENT',
    GIVE_UP_ASSIGNMENT = 'GIVE_UP_ASSIGNMENT',
    ASSIGN_TO_A_MEMBER = 'ASSIGN_TO_A_MEMBER',
    CHANGE_ASSIGNEE = 'CHANGE_ASSIGNEE',
    CHANGE_ASSIGNEE_MEMBERS = 'CHANGE_ASSIGNEE_MEMBERS',
    CHANGE_ASSIGNEE_MANGER = 'CHANGE_ASSIGNEE_MANGER',
    UPDATE_ASSIGNED_TASK = 'UPDATE_ASSIGNED_TASK',
    MANAGER_UPDATE_TASK = 'MANAGER_UPDATE_TASK'
}