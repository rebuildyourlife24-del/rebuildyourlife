import { Action, ActionStatus } from './action.entity';

export class ActionLifecycle {
  static transition(action: Action, newStatus: ActionStatus): Action {
    // Basic state machine validation could go here
    return new Action(
      action.id,
      action.identityId,
      action.decisionId,
      action.type,
      action.payload,
      newStatus,
      action.createdAt,
      action.validationWarnings
    );
  }
}
