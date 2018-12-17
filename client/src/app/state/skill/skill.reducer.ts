import { Action } from '@ngrx/store';

import { initialSkillState } from '../_state.inits';
import { SkillState } from '../_state.interfaces';
import { SkillActionTypes } from './skill.action';

export function reducer(state = initialSkillState, action: Action): SkillState {
  switch (action.type) {
    case SkillActionTypes.WatchSkill:
      return state;

    case SkillActionTypes.CreateSkill:
    case SkillActionTypes.CreateSkillSuccess:
    case SkillActionTypes.CreateSkillFail:
    case SkillActionTypes.DeleteSkill:
    case SkillActionTypes.DeleteSkillSuccess:
    case SkillActionTypes.DeleteSkillFail:
    default:
      return state;
  }
}
