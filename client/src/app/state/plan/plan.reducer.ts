import { Action } from '@ngrx/store';

import { initialPlanState } from '../_state.inits';
import { PlanState } from '../_state.interfaces';
import { PlanActionTypes, UpdatePlan, WatchPlanFail } from './plan.action';
import { sortByDatetime } from '../../services/firestore-utils';

export function reducer(state = initialPlanState, action: Action): PlanState {
  switch (action.type) {
    case PlanActionTypes.WatchPlan:
    case PlanActionTypes.CreatePlan:
    case PlanActionTypes.DeletePlan:
      return state;

    case PlanActionTypes.WatchPlanFail:
      const payload = (action as WatchPlanFail).payload;
      if (payload !== void 0) console.error(payload.error);
      return state;

    case PlanActionTypes.UpdatePlan:
      const plans = (action as UpdatePlan).payload;
      sortByDatetime({ key: 'modified', objects: plans }, 'desc');
      return Object.assign({}, { ...state, plans });

    default:
      return state;
  }
}
